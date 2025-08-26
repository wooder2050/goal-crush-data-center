import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/community/stats/weekly-growth - 주간 성장률 조회
export async function GET() {
  try {
    // 현재 주의 시작과 끝 계산
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // 일요일
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(0, 0, 0, 0);

    // 이전 주의 시작과 끝 계산
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);

    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 7);

    // 이번 주와 이전 주의 게시글 수
    const [currentWeekPosts, lastWeekPosts] = await Promise.all([
      prisma.communityPost.count({
        where: {
          created_at: {
            gte: startOfWeek,
            lt: endOfWeek,
          },
          is_deleted: false,
        },
      }),
      prisma.communityPost.count({
        where: {
          created_at: {
            gte: startOfLastWeek,
            lt: endOfLastWeek,
          },
          is_deleted: false,
        },
      }),
    ]);

    // 성장률 계산 (이전 주 대비)
    let weeklyGrowth = 0;
    if (lastWeekPosts > 0) {
      weeklyGrowth = ((currentWeekPosts - lastWeekPosts) / lastWeekPosts) * 100;
    } else if (currentWeekPosts > 0) {
      weeklyGrowth = 100; // 이전 주에 게시글이 없고 이번 주에 있는 경우
    }

    return NextResponse.json({
      success: true,
      data: {
        weeklyGrowth: Math.round(weeklyGrowth * 10) / 10, // 소수점 첫째 자리까지 반올림
        currentWeekPosts,
        lastWeekPosts,
      },
    });
  } catch (error) {
    console.error('주간 성장률 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '주간 성장률을 조회하는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
