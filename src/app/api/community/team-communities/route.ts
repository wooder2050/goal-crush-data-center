import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/community/team-communities - 팀별 커뮤니티 현황 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20'); // 기본값을 20으로 증가

    // 팀별 게시글 수와 최신 게시글 정보 조회
    const teams = await prisma.team.findMany({
      select: {
        team_id: true,
        team_name: true,
        logo: true,
      },
      take: limit,
    });

    const teamCommunities = await Promise.all(
      teams.map(async (team) => {
        // 최근 30일간 해당 팀 관련 게시글 수
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentPostsCount = await prisma.communityPost.count({
          where: {
            team_id: team.team_id,
            is_deleted: false,
            created_at: {
              gte: thirtyDaysAgo,
            },
          },
        });

        // 해당 팀 관련 게시글을 작성한 사용자 수 (대략적인 멤버 수)
        const totalMembers = await prisma.communityPost
          .findMany({
            where: {
              team_id: team.team_id,
              is_deleted: false,
            },
            select: {
              user_id: true,
            },
            distinct: ['user_id'],
          })
          .then((posts) => posts.length);

        // 최신 게시글 정보
        const latestPost = await prisma.communityPost.findFirst({
          where: {
            team_id: team.team_id,
            is_deleted: false,
          },
          select: {
            title: true,
            created_at: true,
            user: {
              select: {
                korean_nickname: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        });

        return {
          team_id: team.team_id,
          team_name: team.team_name,
          logo: team.logo,
          recent_posts_count: recentPostsCount,
          total_members: totalMembers,
          latest_post: latestPost
            ? {
                title: latestPost.title,
                created_at: latestPost.created_at,
                user_nickname: latestPost.user.korean_nickname,
              }
            : null,
        };
      })
    );

    // 최근 게시글 수 기준으로 정렬
    teamCommunities.sort((a, b) => b.recent_posts_count - a.recent_posts_count);

    return NextResponse.json({
      success: true,
      data: teamCommunities,
    });
  } catch (error) {
    console.error('팀 커뮤니티 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '팀 커뮤니티 정보를 조회하는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
