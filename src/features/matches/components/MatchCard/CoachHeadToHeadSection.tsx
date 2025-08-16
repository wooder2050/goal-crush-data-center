'use client';

import React, { useMemo } from 'react';

import { Card } from '@/components/ui/card';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

import { getCoachHeadToHeadListByMatchIdPrisma } from '../../api-prisma';

export default function CoachHeadToHeadSection({
  matchId,
}: {
  matchId: number;
}) {
  const { data } = useGoalSuspenseQuery(getCoachHeadToHeadListByMatchIdPrisma, [
    matchId,
    'prev',
  ]);

  const summary = useMemo(() => {
    if (!data || data.items.length === 0) return null;

    const wins = new Map<number, number>();

    for (const m of data.items) {
      const homeId = m.home.coach_id ?? undefined;
      const awayId = m.away.coach_id ?? undefined;
      const hs = m.penalty ? m.penalty.home : m.score.home;
      const as = m.penalty ? m.penalty.away : m.score.away;
      if (hs !== null && as !== null) {
        if (hs > as && homeId) wins.set(homeId, (wins.get(homeId) ?? 0) + 1);
        else if (hs < as && awayId)
          wins.set(awayId, (wins.get(awayId) ?? 0) + 1);
      }
    }

    const aId = data.current.home_coach_id ?? undefined;
    const bId = data.current.away_coach_id ?? undefined;
    if (!aId || !bId) return null;
    return {
      total: data.items.length,
      a: {
        id: aId,
        name: data.current.home_coach_name ?? '감독 A',
        wins: wins.get(aId) ?? 0,
      },
      b: {
        id: bId,
        name: data.current.away_coach_name ?? '감독 B',
        wins: wins.get(bId) ?? 0,
      },
    };
  }, [data]);

  if (!summary) return null;

  return (
    <Card className="p-3 sm:p-4">
      <div className="mb-2">
        <div className="text-sm text-gray-700 font-semibold">
          감독 맞대결 전적
        </div>
        <div className="mt-0.5 text-[11px] text-gray-500">
          현재 경기 이전 기준
        </div>
      </div>
      <div className="grid grid-cols-3 items-center text-center text-xs sm:text-sm">
        <div className="flex flex-col gap-1">
          <div className="text-gray-900 font-bold">{summary.a.wins} 승</div>
        </div>
        <div>
          <div className="text-gray-900 font-semibold">
            {summary.a.name} vs {summary.b.name}
          </div>
          <div className="text-gray-500">총 {summary.total}경기</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-gray-900 font-bold">{summary.b.wins} 승</div>
        </div>
      </div>
    </Card>
  );
}
