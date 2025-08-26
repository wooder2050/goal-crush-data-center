import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 최근 30일 내 활동 기준으로 활발한 사용자 조회
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // 게시글 작성 수 기준
    const postLeaders = await prisma.communityPost.groupBy({
      by: ['user_id'],
      where: {
        created_at: { gte: thirtyDaysAgo },
        is_deleted: false,
      },
      _count: {
        post_id: true,
      },
      orderBy: {
        _count: {
          post_id: 'desc',
        },
      },
      take: 5,
    });

    // 댓글 작성 수 기준
    const commentLeaders = await prisma.postComment.groupBy({
      by: ['user_id'],
      where: {
        created_at: { gte: thirtyDaysAgo },
        is_deleted: false,
      },
      _count: {
        comment_id: true,
      },
      orderBy: {
        _count: {
          comment_id: 'desc',
        },
      },
      take: 5,
    });

    // 사용자 정보와 함께 조회
    const postLeadersWithUser = await Promise.all(
      postLeaders.map(async (leader) => {
        const user = await prisma.user.findUnique({
          where: { user_id: leader.user_id },
          select: {
            korean_nickname: true,
            user_id: true,
          },
        });
        return {
          user_id: leader.user_id,
          nickname: user?.korean_nickname || '알 수 없음',
          post_count: leader._count.post_id,
          activity_type: 'post',
        };
      })
    );

    const commentLeadersWithUser = await Promise.all(
      commentLeaders.map(async (leader) => {
        const user = await prisma.user.findUnique({
          where: { user_id: leader.user_id },
          select: {
            korean_nickname: true,
            user_id: true,
          },
        });
        return {
          user_id: leader.user_id,
          nickname: user?.korean_nickname || '알 수 없음',
          comment_count: leader._count.comment_id,
          activity_type: 'comment',
        };
      })
    );

    // 포인트 기준 리더보드
    const pointLeaders = await prisma.userPoint.groupBy({
      by: ['user_id'],
      where: {
        created_at: { gte: thirtyDaysAgo },
        points_change: { gt: 0 },
      },
      _sum: {
        points_change: true,
      },
      orderBy: {
        _sum: {
          points_change: 'desc',
        },
      },
      take: 5,
    });

    const pointLeadersWithUser = await Promise.all(
      pointLeaders.map(async (leader) => {
        const user = await prisma.user.findUnique({
          where: { user_id: leader.user_id },
          select: {
            korean_nickname: true,
            user_id: true,
          },
        });
        return {
          user_id: leader.user_id,
          nickname: user?.korean_nickname || '알 수 없음',
          points_earned: leader._sum.points_change || 0,
          activity_type: 'points',
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        post_leaders: postLeadersWithUser,
        comment_leaders: commentLeadersWithUser,
        point_leaders: pointLeadersWithUser,
      },
    });
  } catch (error) {
    console.error('활동 리더보드 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '활동 리더보드 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
