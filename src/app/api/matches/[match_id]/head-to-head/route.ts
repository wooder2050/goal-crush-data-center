import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { match_id: string } }
) {
  try {
    const matchId = Number(params.match_id);
    if (Number.isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const match = await prisma.match.findUnique({
      where: { match_id: matchId },
      include: { home_team: true, away_team: true },
    });
    if (!match || !match.home_team_id || !match.away_team_id) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const small = Math.min(match.home_team_id, match.away_team_id);
    const large = Math.max(match.home_team_id, match.away_team_id);

    // 집계 테이블에서 ORM으로 한 번에 집계 가져오기
    const stat = await prisma.h2hPairStats.findUnique({
      where: {
        team_small_id_team_large_id: {
          team_small_id: small,
          team_large_id: large,
        },
      },
      select: {
        total_matches: true,
        small_wins: true,
        large_wins: true,
        draws: true,
        small_goals: true,
        large_goals: true,
      },
    });

    const teamAId = match.home_team_id;
    const mapToAB = (
      s:
        | undefined
        | {
            total_matches: number;
            small_wins: number;
            large_wins: number;
            draws: number;
            small_goals: number;
            large_goals: number;
          }
    ) => {
      if (!s) {
        return {
          total: 0,
          teamA: {
            wins: 0,
            draws: 0,
            losses: 0,
            goals_for: 0,
            goals_against: 0,
          },
          teamB: {
            wins: 0,
            draws: 0,
            losses: 0,
            goals_for: 0,
            goals_against: 0,
          },
        } as const;
      }
      const teamAIsSmall = teamAId === small;
      const teamAWins = teamAIsSmall ? s.small_wins : s.large_wins;
      const teamBWins = teamAIsSmall ? s.large_wins : s.small_wins;
      const teamAGoals = teamAIsSmall ? s.small_goals : s.large_goals;
      const teamBGoals = teamAIsSmall ? s.large_goals : s.small_goals;
      return {
        total: s.total_matches,
        teamA: {
          wins: teamAWins,
          draws: s.draws,
          losses: teamBWins,
          goals_for: teamAGoals,
          goals_against: teamBGoals,
        },
        teamB: {
          wins: teamBWins,
          draws: s.draws,
          losses: teamAWins,
          goals_for: teamBGoals,
          goals_against: teamAGoals,
        },
      } as const;
    };

    const summary = mapToAB(stat ?? undefined);

    return NextResponse.json({
      match_id: match.match_id,
      teamA: match.home_team,
      teamB: match.away_team,
      summary,
    });
  } catch (error) {
    console.error('Failed to fetch head-to-head summary', error);
    return NextResponse.json(
      { error: 'Failed to fetch head-to-head summary' },
      { status: 500 }
    );
  }
}
