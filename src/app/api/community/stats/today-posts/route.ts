import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/community/stats/today-posts - 오늘 게시글 수 조회
export async function GET() {
  try {
    // 오늘 날짜의 시작과 끝 계산
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // 오늘 작성된 게시글 수
    const todayPosts = await prisma.communityPost.count({
      where: {
        created_at: {
          gte: startOfDay,
          lt: endOfDay,
        },
        is_deleted: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        todayPosts,
      },
    });
  } catch (error) {
    console.error('오늘 게시글 수 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '오늘 게시글 수를 조회하는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
