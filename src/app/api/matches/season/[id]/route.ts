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
        team_id: { in: number[] };
        season_id: number;
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
  { params }: { params: { id: string } }
) {
  try {
    const seasonId = parseInt(params.id);

    if (isNaN(seasonId)) {
      return NextResponse.json({ error: 'Invalid season ID' }, { status: 400 });
    }

    const matches = await prisma.match.findMany({
      where: { season_id: seasonId },
      include: {
        home_team: true,
        away_team: true,
        season: true,
      },
      orderBy: {
        match_date: 'asc',
      },
    });

    if (matches.length === 0) {
      return NextResponse.json([]);
    }

    // 모든 팀 ID 수집
    const teamIds = matches.flatMap((match) => [
      match.home_team_id!,
      match.away_team_id!,
    ]);

    // 시즌별 팀명을 한 번에 조회 - Prisma 관계 쿼리 사용
    const teamSeasonNames = await (
      prisma as unknown as ExtendedPrismaClient
    ).teamSeasonName.findMany({
      where: {
        team_id: { in: teamIds },
        season_id: seasonId,
      },
      select: {
        team_id: true,
        team_name: true,
      },
    });

    // 팀별로 매핑
    const teamNameMap = new Map(
      teamSeasonNames.map((t: TeamSeasonNameResult) => [t.team_id, t.team_name])
    );

    // 각 경기에 대해 시즌별 팀명 적용
    const updatedMatches = matches.map((match) => ({
      ...match,
      home_team: match.home_team
        ? {
            ...match.home_team,
            team_name:
              teamNameMap.get(match.home_team_id!) || match.home_team.team_name,
            logo: match.home_team.team_logo_url,
          }
        : null,
      away_team: match.away_team
        ? {
            ...match.away_team,
            team_name:
              teamNameMap.get(match.away_team_id!) || match.away_team.team_name,
            logo: match.away_team.team_logo_url,
          }
        : null,
    }));

    return NextResponse.json(updatedMatches);
  } catch (error) {
    console.error('Failed to fetch matches by season:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches by season' },
      { status: 500 }
    );
  }
}
