'use client';

import React, { useMemo } from 'react';

import { Card } from '@/components/ui/card';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

import {
  getHeadToHeadByMatchIdPrisma,
  getHeadToHeadListByMatchIdPrisma,
} from '../../api-prisma';

export default function HeadToHeadSection({ matchId }: { matchId: number }) {
  const { data } = useGoalSuspenseQuery(getHeadToHeadByMatchIdPrisma, [
    matchId,
  ]);
  const { data: listData } = useGoalSuspenseQuery(
    getHeadToHeadListByMatchIdPrisma,
    [matchId]
  );

  const teamA = data?.teamA ?? null;
  const teamB = data?.teamB ?? null;

  const simplifyTeamName = (name?: string | null) =>
    (name || '')
      .replace(/\bFC\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

  // 이전 경기들만으로 요약 재계산
  const recomputed = useMemo(() => {
    const teamAId = teamA?.team_id ?? null;
    const teamBId = teamB?.team_id ?? null;
    const base = {
      total: 0,
      teamA: { wins: 0, draws: 0, losses: 0, goals_for: 0, goals_against: 0 },
      teamB: { wins: 0, draws: 0, losses: 0, goals_for: 0, goals_against: 0 },
    } as const;
    if (!listData || !teamAId || !teamBId) return base;
    let aWins = 0;
    let bWins = 0;
    let draws = 0;
    let aGF = 0;
    let aGA = 0;
    for (const m of listData.items) {
      // 각 경기 기준 점수 선택 (PK 우선)
      const usePenalty = Boolean(
        m.penalty && m.penalty.home !== null && m.penalty.away !== null
      );
      const hs = usePenalty
        ? (m.penalty?.home ?? null)
        : (m.score.home ?? null);
      const as = usePenalty
        ? (m.penalty?.away ?? null)
        : (m.score.away ?? null);
      // A가 홈인지 원정인지 식별
      const aIsHome = m.home?.team_id === teamAId;
      const aGoals = aIsHome ? hs : as;
      const bGoals = aIsHome ? as : hs;
      if (aGoals !== null && bGoals !== null) {
        aGF += aGoals;
        aGA += bGoals;
        if (aGoals > bGoals) aWins += 1;
        else if (aGoals < bGoals) bWins += 1;
        else draws += 1;
      }
    }
    return {
      total: listData.items.length,
      teamA: {
        wins: aWins,
        draws,
        losses: bWins,
        goals_for: aGF,
        goals_against: aGA,
      },
      teamB: {
        wins: bWins,
        draws,
        losses: aWins,
        goals_for: aGA,
        goals_against: aGF,
      },
    };
  }, [listData, teamA?.team_id, teamB?.team_id]);

  // 승수 섹션에 컬러 강조 미적용 (기본 상태 유지)

  if (!data && (!listData || listData.items.length === 0)) return null;

  return (
    <Card className="p-3 sm:p-4">
      <div className="mb-2">
        <div className="text-sm text-gray-700 font-semibold">맞대결 전적</div>
        <div className="mt-0.5 text-[11px] text-gray-500">
          현재 경기 이전 기준
        </div>
      </div>
      <div className="grid grid-cols-5 items-center text-center text-xs sm:text-sm md:grid-cols-3">
        <div className="flex flex-col gap-1 col-span-1 md:col-span-1">
          <div className="text-gray-900 font-bold">
            {recomputed.teamA.wins} 승
          </div>
        </div>
        <div className="col-span-3 md:col-span-1">
          <div className="text-gray-900 font-semibold">
            {simplifyTeamName(teamA?.team_name) || '팀 A'} vs{' '}
            {simplifyTeamName(teamB?.team_name) || '팀 B'}
          </div>
          <div className="text-gray-500">총 {recomputed.total}경기</div>
        </div>
        <div className="flex flex-col gap-1 col-span-1 md:col-span-1">
          <div className="text-gray-900 font-bold">
            {recomputed.teamB.wins} 승
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-5 items-center text-[11px] sm:text-xs text-gray-600 md:grid-cols-3">
        <div className="text-right col-span-1 md:col-span-1">
          득 {recomputed.teamA.goals_for} / 실 {recomputed.teamA.goals_against}
        </div>
        <div className="text-center text-gray-400 col-span-3 md:col-span-1">
          vs
        </div>
        <div className="text-left col-span-1 md:col-span-1">
          득 {recomputed.teamB.goals_for} / 실 {recomputed.teamB.goals_against}
        </div>
      </div>
    </Card>
  );
}
