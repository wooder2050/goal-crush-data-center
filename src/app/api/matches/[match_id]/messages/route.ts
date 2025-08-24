import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/matches/[match_id]/messages - 특정 경기의 응원 메시지 조회 (페이지네이션)
export async function GET(
  request: NextRequest,
  { params }: { params: { match_id: string } }
) {
  try {
    const matchId = parseInt(params.match_id);

    if (isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const teamId = searchParams.get('teamId'); // 특정 팀 필터링 (선택사항)

    // 경기가 존재하는지 확인
    const match = await prisma.match.findUnique({
      where: { match_id: matchId },
      select: {
        match_id: true,
        home_team_id: true,
        away_team_id: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // 필터 조건 설정
    const whereCondition: {
      match_id: number;
      message: { not: null };
      team_id?: number;
    } = {
      match_id: matchId,
      message: {
        not: null, // 메시지가 있는 것만
      },
    };

    // 특정 팀 필터링
    if (teamId) {
      const teamIdNum = parseInt(teamId);
      if (!isNaN(teamIdNum)) {
        whereCondition.team_id = teamIdNum;
      }
    }

    // 전체 카운트 조회
    const totalCount = await prisma.matchSupport.count({
      where: whereCondition,
    });

    // 페이지네이션된 응원 메시지 조회
    const supports = await prisma.matchSupport.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            korean_nickname: true,
            profile_image_url: true,
          },
        },
        team: {
          select: {
            team_id: true,
            team_name: true,
            logo: true,
            primary_color: true,
            secondary_color: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      messages: supports.map((support) => ({
        support_id: support.support_id,
        user_id: support.user_id,
        user_nickname: support.user.korean_nickname,
        profile_image: support.user.profile_image_url,
        message: support.message,
        team: {
          team_id: support.team.team_id,
          team_name: support.team.team_name,
          logo: support.team.logo,
          primary_color: support.team.primary_color,
          secondary_color: support.team.secondary_color,
        },
        created_at: support.created_at,
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    console.error('Error fetching match messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
