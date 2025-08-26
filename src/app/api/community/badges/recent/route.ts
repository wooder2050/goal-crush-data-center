import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('최근 배지 API 호출됨');

    // 최근 7일 내에 획득한 배지들을 조회
    const recentBadges = await prisma.userBadge.findMany({
      where: {
        earned_at: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
        },
      },
      select: {
        badge_id: true,
        user_id: true,
        badge_type: true,
        badge_name: true,
        badge_description: true,
        badge_icon: true,
        earned_at: true,
        user: {
          select: {
            korean_nickname: true,
            user_id: true,
          },
        },
      },
      orderBy: {
        earned_at: 'desc',
      },
      take: 10, // 최근 10개
    });

    console.log('조회된 배지 수:', recentBadges.length);
    console.log('첫 번째 배지 샘플:', recentBadges[0]);

    // 배지 색상 매핑 (badge_type에 따른 동적 색상)
    const badgeColors: Record<string, string> = {
      first_post: '#059669', // 에메랄드 그린
      prediction_master: '#2563EB', // 파란색
      team_supporter: '#EA580C', // 주황색
      mvp_voter: '#7C3AED', // 보라색
      daily_login: '#DC2626', // 빨간색
      comment_king: '#0891B2', // 청록색
      like_champion: '#DB2777', // 핑크색
    };

    const formattedBadges = recentBadges.map((userBadge) => ({
      user_badge_id: userBadge.badge_id,
      earned_at: userBadge.earned_at,
      user: userBadge.user,
      badge: {
        badge_name: userBadge.badge_name,
        badge_description: userBadge.badge_description,
        badge_icon: userBadge.badge_icon || '🏆',
        badge_color: badgeColors[userBadge.badge_type] || '#6B7280', // 기본 회색
      },
    }));

    console.log('포맷된 배지 수:', formattedBadges.length);

    return NextResponse.json({
      success: true,
      data: formattedBadges,
    });
  } catch (error) {
    console.error('최근 배지 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '배지 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
