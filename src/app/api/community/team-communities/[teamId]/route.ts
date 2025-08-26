import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params;

    console.log('팀 커뮤니티 API 호출:', { teamId });

    // 팀 정보 조회
    const team = await prisma.team.findUnique({
      where: { team_id: parseInt(teamId) },
      select: {
        team_id: true,
        team_name: true,
        logo: true,
      },
    });

    if (!team) {
      console.log('팀을 찾을 수 없음:', teamId);
      return NextResponse.json(
        { error: '팀을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log('팀 확인됨:', team);

    // 최근 게시글 수 조회 (최근 30일)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPostsCount = await prisma.communityPost.count({
      where: {
        team_id: parseInt(teamId),
        created_at: {
          gte: thirtyDaysAgo,
        },
      },
    });

    console.log('최근 30일 게시글 수:', recentPostsCount);

    // 전체 멤버 수 조회 (게시글을 작성한 사용자 수)
    const totalMembers = await prisma.communityPost.groupBy({
      by: ['user_id'],
      where: {
        team_id: parseInt(teamId),
      },
      _count: {
        user_id: true,
      },
    });

    console.log('전체 멤버 수:', totalMembers.length);

    // 최신 게시글 조회
    const latestPost = await prisma.communityPost.findFirst({
      where: {
        team_id: parseInt(teamId),
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        post_id: true,
        title: true,
        content: true,
        created_at: true,
        user: {
          select: {
            korean_nickname: true,
          },
        },
      },
    });

    console.log('최신 게시글:', latestPost ? '있음' : '없음');

    const teamCommunity = {
      team_id: team.team_id.toString(),
      team_name: team.team_name,
      logo: team.logo,
      recent_posts_count: recentPostsCount,
      total_members: totalMembers.length,
      latest_post: latestPost
        ? {
            id: latestPost.post_id.toString(),
            title: latestPost.title,
            content: latestPost.content,
            created_at: latestPost.created_at,
            user_nickname: latestPost.user.korean_nickname,
          }
        : null,
    };

    console.log('팀 커뮤니티 정보:', teamCommunity);

    return NextResponse.json({
      data: teamCommunity,
    });
  } catch (error) {
    console.error('팀 커뮤니티 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '팀 커뮤니티 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
