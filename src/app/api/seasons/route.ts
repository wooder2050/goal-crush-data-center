import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { inferLeague } from '@/lib/utils';

// Season 타입 정의
type SeasonWithMatchCount = {
  season_id: number;
  season_name: string;
  year: number;
  start_date: Date | null;
  end_date: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  _count: {
    matches: number;
  };
  match_count: number;
  champion_team_id?: number | null;
  champion_team_name?: string | null;
  champion_team_logo?: string | null;
  champion_label?: '우승팀' | '승격팀' | '1위' | '현재 1위' | null;
  champion_teams?: Array<{
    team_id: number | null;
    team_name: string | null;
    logo: string | null;
  }>;
};

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/seasons - 모든 시즌 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const year = searchParams.get('year');

    const seasons = await prisma.season.findMany({
      where: {
        ...(name && {
          season_name: {
            contains: name,
            mode: 'insensitive' as const,
          },
        }),
        ...(year &&
          !isNaN(parseInt(year)) && {
            year: parseInt(year),
          }),
      },
      include: {
        _count: {
          select: {
            matches: true,
          },
        },
      },
      orderBy: {
        season_id: 'desc',
      },
    });

    // match_count 필드를 추가하여 응답 형식 통일
    const seasonIds = seasons.map((s) => s.season_id);
    const winners = await prisma.standing.findMany({
      where: { season_id: { in: seasonIds }, position: 1 },
      select: {
        season_id: true,
        team: { select: { team_id: true, team_name: true, logo: true } },
      },
    });
    const winnersBySeason = new Map<
      number,
      Array<{ id: number | null; name: string | null; logo: string | null }>
    >();
    for (const w of winners) {
      if (w.season_id == null) continue;
      const arr = winnersBySeason.get(w.season_id) ?? [];
      arr.push({
        id: w.team?.team_id ?? null,
        name: w.team?.team_name ?? null,
        logo: w.team?.logo ?? null,
      });
      winnersBySeason.set(w.season_id, arr);
    }

    const seasonsWithMatchCount: SeasonWithMatchCount[] = seasons.map(
      (season) => {
        const league = inferLeague(season.season_name);
        const pilotSeason =
          season.season_id === 1 || /파일럿|pilot/i.test(season.season_name);
        const firstSeason = season.season_id === 2;
        const secondSeason = season.season_id === 3;
        const isCompleted = Boolean(season.end_date);

        let label: SeasonWithMatchCount['champion_label'] = null;
        let teams: SeasonWithMatchCount['champion_teams'] = [];

        if (isCompleted) {
          if (
            league === 'super' ||
            league === 'cup' ||
            pilotSeason ||
            firstSeason
          ) {
            const arr = winnersBySeason.get(season.season_id) ?? [];
            const w = arr[0] ?? null;
            label = '우승팀';
            teams = w
              ? [{ team_id: w.id, team_name: w.name, logo: w.logo }]
              : [];
          } else if (league === 'challenge' || league === 'playoff') {
            const arr = winnersBySeason.get(season.season_id) ?? [];
            const w = arr[0] ?? null;
            label = '승격팀';
            teams = w
              ? [{ team_id: w.id, team_name: w.name, logo: w.logo }]
              : [];
          } else if (league === 'g-league' || secondSeason) {
            const arr = winnersBySeason.get(season.season_id) ?? [];
            // 조별리그: 각 조 1위 모두 노출 (standings 기준 여러 팀 가능)
            label = '1위';
            teams = arr.map((t) => ({
              team_id: t.id,
              team_name: t.name,
              logo: t.logo,
            }));
          }
        } else {
          // 진행중 시즌: standings 기준 현재 1위 (리그 구분 없이 공통 처리)
          if (
            league === 'super' ||
            league === 'cup' ||
            pilotSeason ||
            firstSeason
          ) {
            const arr = winnersBySeason.get(season.season_id) ?? [];
            const w = arr[0] ?? null;
            label = '우승팀';
            teams = w
              ? [{ team_id: w.id, team_name: w.name, logo: w.logo }]
              : [];
          } else if (league === 'g-league' || secondSeason) {
            const arr = winnersBySeason.get(season.season_id) ?? [];
            label = arr.length > 0 ? '현재 1위' : null;
            teams = arr.map((t) => ({
              team_id: t.id,
              team_name: t.name,
              logo: t.logo,
            }));
          } else {
            const arr = winnersBySeason.get(season.season_id) ?? [];
            const w = arr[0] ?? null;
            label = w ? '현재 1위' : null;
            teams = w
              ? [{ team_id: w.id, team_name: w.name, logo: w.logo }]
              : [];
          }
        }

        const first = teams && teams.length > 0 ? teams[0] : null;
        return {
          ...season,
          match_count: season._count.matches,
          champion_team_id: first?.team_id ?? null,
          champion_team_name: first?.team_name ?? null,
          champion_team_logo: first?.logo ?? null,
          champion_label: label,
          champion_teams: teams,
        };
      }
    );

    return NextResponse.json(seasonsWithMatchCount);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch seasons',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
