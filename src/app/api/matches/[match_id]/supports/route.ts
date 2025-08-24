import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/matches/[match_id]/supports - 특정 경기의 응원 통계 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { match_id: string } }
) {
  try {
    const matchId = parseInt(params.match_id);

    if (isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    // 경기 정보 조회
    const match = await prisma.match.findUnique({
      where: { match_id: matchId },
      include: {
        home_team: {
          select: {
            team_id: true,
            team_name: true,
            logo: true,
            primary_color: true,
            secondary_color: true,
          },
        },
        away_team: {
          select: {
            team_id: true,
            team_name: true,
            logo: true,
            primary_color: true,
            secondary_color: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // 응원 통계 조회
    const supportStats = await prisma.matchSupport.groupBy({
      by: ['team_id'],
      where: {
        match_id: matchId,
      },
      _count: {
        support_id: true,
      },
    });

    // 최근 응원자들 조회 (각 팀별로 최대 5명)
    const recentSupporters = await prisma.matchSupport.findMany({
      where: {
        match_id: matchId,
      },
      include: {
        user: {
          select: {
            korean_nickname: true,
            profile_image_url: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10,
    });

    // 홈팀과 어웨이팀별 응원 통계 정리
    const homeTeamSupports =
      supportStats.find((stat) => stat.team_id === match.home_team?.team_id)
        ?._count.support_id || 0;

    const awayTeamSupports =
      supportStats.find((stat) => stat.team_id === match.away_team?.team_id)
        ?._count.support_id || 0;

    const totalSupports = homeTeamSupports + awayTeamSupports;

    // 홈팀과 어웨이팀별 최근 응원자들
    const homeTeamSupporters = recentSupporters
      .filter((support) => support.team_id === match.home_team?.team_id)
      .slice(0, 5);

    const awayTeamSupporters = recentSupporters
      .filter((support) => support.team_id === match.away_team?.team_id)
      .slice(0, 5);

    return NextResponse.json({
      match: {
        match_id: match.match_id,
        match_date: match.match_date,
        status: match.status,
        home_team: match.home_team,
        away_team: match.away_team,
      },
      statistics: {
        total_supports: totalSupports,
        home_team_supports: homeTeamSupports,
        away_team_supports: awayTeamSupports,
        home_team_percentage:
          totalSupports > 0 ? (homeTeamSupports / totalSupports) * 100 : 0,
        away_team_percentage:
          totalSupports > 0 ? (awayTeamSupports / totalSupports) * 100 : 0,
      },
      recent_supporters: {
        home_team: homeTeamSupporters.map((support) => ({
          user_nickname: support.user.korean_nickname,
          profile_image: support.user.profile_image_url,
          message: support.message,
          created_at: support.created_at,
        })),
        away_team: awayTeamSupporters.map((support) => ({
          user_nickname: support.user.korean_nickname,
          profile_image: support.user.profile_image_url,
          message: support.message,
          created_at: support.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching match supports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
