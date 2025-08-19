'use client';

import { format } from 'date-fns';
import React from 'react';

import { Card } from '@/components/ui/card';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import { shortenSeasonName } from '@/lib/utils';

import { getCoachHeadToHeadListByMatchIdPrisma } from '../../api-prisma';

export default function CoachHeadToHeadList({ matchId }: { matchId: number }) {
  const { data } = useGoalSuspenseQuery(getCoachHeadToHeadListByMatchIdPrisma, [
    matchId,
    'prev',
  ]);

  if (!data || data.items.length === 0) return null;

  return (
    <Card className="p-3 sm:p-4">
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 font-semibold">
            감독 맞대결 전체
          </div>
        </div>
        <div className="mt-0.5 text-[11px] text-gray-500">
          현재 경기 이전 기준
        </div>
      </div>

      <ul className="divide-y divide-gray-100">
        {data.items.map((m) => {
          const dateStr = format(new Date(m.match_date), 'yy.MM.dd');
          const seasonStr = shortenSeasonName(m.season?.season_name ?? '');
          const center = m.penalty
            ? `${m.score.home ?? '-'}:${m.score.away ?? '-'} (P ${m.penalty.home ?? '-'}:${m.penalty.away ?? '-'})`
            : `${m.score.home ?? '-'}:${m.score.away ?? '-'}`;

          const hs = m.penalty ? m.penalty.home : m.score.home;
          const as = m.penalty ? m.penalty.away : m.score.away;
          let winner: 'home' | 'away' | 'draw' = 'draw';
          if (hs !== null && as !== null) {
            if (hs > as) winner = 'home';
            else if (hs < as) winner = 'away';
          }

          const homeCanColor = Boolean(
            m.home?.primary_color && m.home?.secondary_color
          );
          const awayCanColor = Boolean(
            m.away?.primary_color && m.away?.secondary_color
          );
          const homeStyle: React.CSSProperties =
            winner === 'home' && homeCanColor
              ? {
                  color: m.home!.secondary_color!,
                  backgroundColor: m.home!.primary_color!,
                  border: '1px solid',
                  borderColor: m.home!.secondary_color!,
                  borderRadius: 9999,
                  padding: '0 6px',
                  fontWeight: 700,
                }
              : { color: winner === 'away' ? '#9CA3AF' : '#374151' };
          const awayStyle: React.CSSProperties =
            winner === 'away' && awayCanColor
              ? {
                  color: m.away!.secondary_color!,
                  backgroundColor: m.away!.primary_color!,
                  border: '1px solid',
                  borderColor: m.away!.secondary_color!,
                  borderRadius: 9999,
                  padding: '0 6px',
                  fontWeight: 700,
                }
              : { color: winner === 'home' ? '#9CA3AF' : '#374151' };

          return (
            <li key={m.match_id} className="py-1 sm:py-2.5 text-xs sm:text-sm">
              {/* Mobile layout - single line with truncation */}
              <div className="p-1 sm:hidden flex items-center gap-1 text-xs">
                <div className="shrink-0 text-[11px] text-gray-500">
                  {dateStr}
                </div>
                <span className="shrink-0 text-gray-300">•</span>
                <div className="shrink min-w-0 flex-1 truncate text-center font-medium">
                  <span className="truncate">
                    <span style={homeStyle}>{m.home.coach_name ?? '감독'}</span>{' '}
                    vs{' '}
                    <span style={awayStyle}>{m.away.coach_name ?? '감독'}</span>
                  </span>
                  <span className="text-gray-400"> (</span>
                  <span className="text-gray-500">{center}</span>
                  <span className="text-gray-400">)</span>
                </div>
                <span className="shrink-0 text-gray-300">•</span>
                <div className="shrink-0 text-[11px] text-gray-500 truncate max-w-[30%] text-right">
                  {shortenSeasonName(m.season?.season_name ?? '')}
                </div>
              </div>

              {/* Desktop / Tablet layout */}
              <div className="hidden sm:grid grid-cols-3 items-center gap-2">
                <div className="text-gray-500">
                  <div>{dateStr}</div>
                  <div className="text-gray-500">{seasonStr}</div>
                </div>
                <div className="text-center font-medium">{center}</div>
                <div className="text-right">
                  <span className="block whitespace-normal break-words">
                    <span style={homeStyle}>{m.home.coach_name ?? '감독'}</span>{' '}
                    vs{' '}
                    <span style={awayStyle}>{m.away.coach_name ?? '감독'}</span>
                  </span>
                  <span className="block text-[11px] text-gray-500 whitespace-normal break-words">
                    {m.home.team_name ?? '팀'} vs {m.away.team_name ?? '팀'}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
