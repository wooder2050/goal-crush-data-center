import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

interface TeamSeasonNameResult {
  team_id: number;
  team_name: string;
}

// Prisma 클라이언트에 teamSeasonName 메서드가 없는 문제를 해결하기 위한 타입 확장
interface ExtendedPrismaClient {
  teamSeasonName: {
    findMany: (args: {
      where: {
        OR: Array<{
          team_id: number;
          season_id: number;
        }>;
      };
      select: {
        team_id: boolean;
        team_name: boolean;
      };
    }) => Promise<TeamSeasonNameResult[]>;
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { match_id: string } }
) {
  try {
    const matchId = parseInt(params.match_id);

    if (isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const match = await prisma.match.findUnique({
      where: { match_id: matchId },
      include: {
        home_team: true,
        away_team: true,
        season: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // 시즌별 팀명을 한 번에 조회 - Prisma 관계 쿼리 사용
    const teamSeasonNames = await (
      prisma as unknown as ExtendedPrismaClient
    ).teamSeasonName.findMany({
      where: {
        OR: [
          { team_id: match.home_team_id!, season_id: match.season_id! },
          { team_id: match.away_team_id!, season_id: match.season_id! },
        ],
      },
      select: {
        team_id: true,
        team_name: true,
      },
    });

    // 팀별로 매핑
    const homeTeamSeasonName = teamSeasonNames.find(
      (t: TeamSeasonNameResult) => t.team_id === match.home_team_id
    );
    const awayTeamSeasonName = teamSeasonNames.find(
      (t: TeamSeasonNameResult) => t.team_id === match.away_team_id
    );

    // 시즌별 팀명으로 업데이트
    const updatedMatch = {
      ...match,
      home_team: match.home_team
        ? {
            ...match.home_team,
            team_name:
              homeTeamSeasonName?.team_name || match.home_team.team_name,
          }
        : null,
      away_team: match.away_team
        ? {
            ...match.away_team,
            team_name:
              awayTeamSeasonName?.team_name || match.away_team.team_name,
          }
        : null,
    };

    return NextResponse.json(updatedMatch);
  } catch (error) {
    console.error('Failed to fetch match:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}
