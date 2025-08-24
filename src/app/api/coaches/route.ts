import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const order = searchParams.get('order'); // 'total' | 'wins' | 'win_rate'

    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const total = await prisma.coach.count({ where });

    const needsComputedOrder =
      order === 'total' || order === 'wins' || order === 'win_rate';

    // Explicitly type coaches result to avoid any/unused generic issues
    let coaches: Awaited<ReturnType<typeof prisma.coach.findMany>>;
    if (needsComputedOrder) {
      // 전체 코치 ID 목록 확보 (검색 조건 반영)
      const allCoaches = await prisma.coach.findMany({
        where,
        select: { coach_id: true },
      });
      const allCoachIds = allCoaches.map((c) => c.coach_id);

      // 해당 코치들의 경기 메트릭 계산을 위한 match_coach 조회 (role=head)
      const matchRows = allCoachIds.length
        ? await prisma.matchCoach.findMany({
            where: { role: 'head', coach_id: { in: allCoachIds } },
            select: {
              coach_id: true,
              team_id: true,
              match: {
                select: {
                  home_team_id: true,
                  away_team_id: true,
                  home_score: true,
                  away_score: true,
                  penalty_home_score: true,
                  penalty_away_score: true,
                },
              },
            },
          })
        : [];

      const metrics = new Map<
        number,
        { total: number; away: number; wins: number; winRate: number }
      >();
      for (let i = 0; i < allCoachIds.length; i++)
        metrics.set(allCoachIds[i], { total: 0, away: 0, wins: 0, winRate: 0 });

      for (let i = 0; i < matchRows.length; i++) {
        const r = matchRows[i];
        const coachId = r.coach_id;
        const teamId = r.team_id ?? null;
        const m = metrics.get(coachId)!;
        m.total += 1;
        const match = r.match;
        if (teamId != null && match?.away_team_id === teamId) m.away += 1;
        const isHome = teamId != null && match?.home_team_id === teamId;
        const ts = isHome ? match?.home_score : match?.away_score;
        const os = isHome ? match?.away_score : match?.home_score;
        const pkT = isHome
          ? match?.penalty_home_score
          : match?.penalty_away_score;
        const pkO = isHome
          ? match?.penalty_away_score
          : match?.penalty_home_score;
        if (ts != null && os != null) {
          if (ts > os) m.wins += 1;
          else if (ts < os) {
            // no-op
          } else if (pkT != null && pkO != null) {
            if (pkT > pkO) m.wins += 1;
          }
        }
      }
      // Avoid for..of over Map for ES target compatibility
      Array.from(metrics.entries()).forEach(([cid, m]) => {
        const updated = { ...m, winRate: m.total > 0 ? m.wins / m.total : 0 };
        metrics.set(cid, updated);
      });

      const sorted = allCoachIds.sort((a, b) => {
        const ma = metrics.get(a)!;
        const mb = metrics.get(b)!;
        if (order === 'total') return mb.total - ma.total;
        if (order === 'wins') return mb.wins - ma.wins;
        if (order === 'win_rate') return mb.winRate - ma.winRate;
        return (mb.total ?? 0) - (ma.total ?? 0);
      });

      const pageIds = sorted.slice(offset, offset + limit);
      const pageCoaches: Awaited<ReturnType<typeof prisma.coach.findMany>> =
        await prisma.coach.findMany({
          where: { coach_id: { in: pageIds } },
          include: {
            team_coach_history: {
              include: { team: true, season: true },
              orderBy: { start_date: 'desc' },
            },
          },
        });
      // 원래 정렬 순서 유지
      const orderIndex = new Map<number, number>(
        pageIds.map((id, idx) => [id, idx])
      );
      pageCoaches.sort(
        (a, b) => orderIndex.get(a.coach_id)! - orderIndex.get(b.coach_id)!
      );

      // 메트릭 병합
      const computedCoaches = pageCoaches.map((c) => {
        const m = metrics.get(c.coach_id) ?? {
          total: 0,
          away: 0,
          wins: 0,
          winRate: 0,
        };
        return {
          ...c,
          total_matches: m.total,
          wins: m.wins,
          win_rate: Math.round(m.winRate * 100),
          away_matches: m.away,
        } as typeof c & {
          total_matches: number;
          wins: number;
          win_rate: number;
          away_matches: number;
        };
      });
      coaches = computedCoaches;
    } else {
      // 기본: 이름순 → 이후 total_matches 기준 정렬은 아래에서 적용
      coaches = await prisma.coach.findMany({
        where,
        include: {
          team_coach_history: {
            include: {
              team: true,
              season: true,
            },
            orderBy: {
              start_date: 'desc',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        take: limit,
        skip: offset,
      });
    }

    // 현재팀 검증: team_current_head_coach 뷰 기준으로 매칭
    let verifiedRows: Array<{
      team_id: number;
      team_name: string;
      logo: string | null;
      coach_id: number;
      last_match_date: Date;
    }> = [];
    const coachIds = coaches.map((c) => c.coach_id);
    if (coachIds.length > 0) {
      verifiedRows = await prisma.$queryRaw<
        Array<{
          team_id: number;
          team_name: string;
          logo: string | null;
          coach_id: number;
          last_match_date: Date;
        }>
      >`SELECT team_id, team_name, logo, coach_id, last_match_date
        FROM public.team_current_head_coach
        WHERE coach_id IN (${Prisma.join(coachIds)})`;
    }
    const coachIdToVerified = new Map<
      number,
      {
        team_id: number;
        team_name: string;
        logo: string | null;
        last_match_date: Date;
      }
    >();
    for (const row of verifiedRows) coachIdToVerified.set(row.coach_id, row);

    // 코치별 총 경기 수 집계 (match_coaches 기준)
    // 총 경기수 (needsComputedOrder 분기에서는 이미 채워짐)
    let coachIdToMatchCount = new Map<number, number>();
    if (!needsComputedOrder) {
      const matchCounts = await prisma.matchCoach.groupBy({
        by: ['coach_id'],
        where: { role: 'head' },
        _count: { _all: true },
      });
      coachIdToMatchCount = new Map<number, number>(
        matchCounts.map((row) => [row.coach_id, row._count._all])
      );
    }

    const enriched = coaches
      .map((c) => {
        const base: Record<string, unknown> = {
          ...c,
          current_team_verified: coachIdToVerified.get(c.coach_id) ?? null,
          has_current_team: coachIdToVerified.has(c.coach_id),
        };
        if (!needsComputedOrder) {
          base.total_matches = coachIdToMatchCount.get(c.coach_id) ?? 0;
        }
        return base;
      })
      .sort((a, b) => {
        if (needsComputedOrder) return 0; // 이미 순서 유지됨
        const bt =
          (b as unknown as { total_matches?: number }).total_matches ?? 0;
        const at =
          (a as unknown as { total_matches?: number }).total_matches ?? 0;
        return bt - at;
      });

    return NextResponse.json({
      coaches: enriched,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coaches' },
      { status: 500 }
    );
  }
}
