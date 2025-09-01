import { NextResponse } from 'next/server';

import type { TeamSeasonNameResult } from '@/app/api/types';
import { prisma } from '@/lib/prisma';

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
        season_id: boolean;
        team_name: boolean;
      };
    }) => Promise<TeamSeasonNameResult[]>;
  };
}

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        home_team: true,
        away_team: true,
        season: true,
      },
      orderBy: {
        match_date: 'desc',
      },
    });

    if (matches.length === 0) {
      return NextResponse.json([]);
    }

    // 모든 팀 ID와 시즌 ID 수집
    const teamSeasonPairs = matches
      .map((match) => ({
        team_id: match.home_team_id!,
        season_id: match.season_id!,
      }))
      .concat(
        matches.map((match) => ({
          team_id: match.away_team_id!,
          season_id: match.season_id!,
        }))
      );

    // 시즌별 팀명을 한 번에 조회 - Prisma 관계 쿼리 사용
    const teamSeasonNames = await (
      prisma as unknown as ExtendedPrismaClient
    ).teamSeasonName.findMany({
      where: {
        OR: teamSeasonPairs.map((pair) => ({
          team_id: pair.team_id,
          season_id: pair.season_id,
        })),
      },
      select: {
        team_id: true,
        season_id: true,
        team_name: true,
      },
    });

    // 팀별로 매핑 (team_id + season_id 조합)
    const teamNameMap = new Map(
      teamSeasonNames.map((t: TeamSeasonNameResult) => [
        `${t.team_id}-${t.season_id}`,
        t.team_name,
      ])
    );

    // 각 경기에 대해 시즌별 팀명 적용
    const updatedMatches = matches.map((match) => {
      const { highlight_url = null, full_video_url = null } = match as {
        highlight_url?: string | null;
        full_video_url?: string | null;
      };
      return {
        ...match,
        highlight_url,
        full_video_url,
        home_team: match.home_team
          ? {
              ...match.home_team,
              team_name:
                teamNameMap.get(`${match.home_team_id}-${match.season_id}`) ||
                match.home_team.team_name,
            }
          : null,
        away_team: match.away_team
          ? {
              ...match.away_team,
              team_name:
                teamNameMap.get(`${match.away_team_id}-${match.season_id}`) ||
                match.away_team.team_name,
            }
          : null,
      };
    });

    return NextResponse.json(updatedMatches);
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
