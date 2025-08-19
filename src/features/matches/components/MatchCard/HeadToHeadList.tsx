'use client';

import { format } from 'date-fns';
import React from 'react';

import { Card } from '@/components/ui/card';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import { shortenSeasonName } from '@/lib/utils';

import { getHeadToHeadListByMatchIdPrisma } from '../../api-prisma';

const simplify = (name?: string | null) =>
  (name || '')
    .replace(/\bFC\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

// removed softBg (not needed after switching to solid primary background)

export default function HeadToHeadList({ matchId }: { matchId: number }) {
  const { data } = useGoalSuspenseQuery(getHeadToHeadListByMatchIdPrisma, [
    matchId,
    'prev',
  ]);

  if (!data || data.items.length === 0) return null;

  const getResult = (m: (typeof data.items)[number]) => {
    const usePenalty = Boolean(
      m.penalty && m.penalty.home !== null && m.penalty.away !== null
    );
    const hs = usePenalty ? (m.penalty?.home ?? null) : (m.score.home ?? null);
    const as = usePenalty ? (m.penalty?.away ?? null) : (m.score.away ?? null);
    let winner: 'home' | 'away' | 'draw' = 'draw';
    if (hs !== null && as !== null) {
      if (hs > as) winner = 'home';
      else if (hs < as) winner = 'away';
    }
    return { winner, usePenalty } as const;
  };

  return (
    <Card className="p-3 sm:p-4">
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 font-semibold">
            최근 맞대결 전체
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
          const tourLabel = m.group_stage
            ? '조별리그'
            : m.tournament_stage
              ? '토너먼트'
              : '';
          const center = m.penalty
            ? `${m.score.home ?? '-'}:${m.score.away ?? '-'} (P ${m.penalty.home ?? '-'}:${m.penalty.away ?? '-'})`
            : `${m.score.home ?? '-'}:${m.score.away ?? '-'}`;
          const { winner } = getResult(m);
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
                  fontWeight: 700,
                }
              : { color: winner === 'away' ? '#9CA3AF' : '#374151' };
          const awayStyle: React.CSSProperties =
            winner === 'away' && awayCanColor
              ? {
                  color: m.away!.secondary_color!,
                  fontWeight: 700,
                }
              : { color: winner === 'home' ? '#9CA3AF' : '#374151' };
          const homePill: React.CSSProperties =
            winner === 'home' && homeCanColor
              ? {
                  backgroundColor: m.home!.primary_color!,
                  border: '1px solid',
                  borderColor: m.home!.secondary_color!,
                  borderRadius: 9999,
                  padding: '0 6px',
                }
              : {};
          const awayPill: React.CSSProperties =
            winner === 'away' && awayCanColor
              ? {
                  backgroundColor: m.away!.primary_color!,
                  border: '1px solid',
                  borderColor: m.away!.secondary_color!,
                  borderRadius: 9999,
                  padding: '0 6px',
                }
              : {};
          const homeDot =
            winner === 'home' ? (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle"
                style={{
                  backgroundColor: m.home?.secondary_color ?? '#111827',
                }}
              />
            ) : null;
          const awayDot =
            winner === 'away' ? (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle"
                style={{
                  backgroundColor: m.away?.secondary_color ?? '#111827',
                }}
              />
            ) : null;
          return (
            <li key={m.match_id} className="py-1 sm:py-2.5 text-xs sm:text-sm">
              {/* Mobile layout - single line */}
              <div className="p-1 sm:hidden flex items-center gap-1 text-xs">
                <div className="hidden">{dateStr}</div>
                <span className="hidden">•</span>
                <div className="min-w-0 flex-1 truncate text-center">
                  <span className="inline-block truncate">
                    <span style={{ ...homeStyle, ...homePill }}>
                      {homeDot}
                      {simplify(m.home?.team_name)}
                    </span>{' '}
                    <span className="text-gray-400">vs</span>{' '}
                    <span style={{ ...awayStyle, ...awayPill }}>
                      {awayDot}
                      {simplify(m.away?.team_name)}
                    </span>
                    <span className="text-gray-400"> (</span>
                    <span className="text-gray-600">{center}</span>
                    <span className="text-gray-400">)</span>
                  </span>
                </div>
                <span className="shrink-0 text-gray-300">•</span>
                <div className="shrink-0 text-[11px] text-gray-500 truncate max-w-[35%] text-right">
                  {seasonStr}
                  {tourLabel ? ` • ${tourLabel}` : ''}
                </div>
              </div>

              {/* Desktop / tablet layout */}
              <div className="hidden sm:grid grid-cols-[1.4fr_120px_1.8fr] items-center gap-3">
                <div className="text-gray-500">
                  <div>{dateStr}</div>
                  <div className="truncate">
                    {seasonStr}
                    {tourLabel ? ` • ${tourLabel}` : ''}
                  </div>
                </div>
                <div className="text-center font-medium truncate">{center}</div>
                <div className="text-right truncate">
                  <span className="block truncate">
                    <span style={{ ...homeStyle, ...homePill }}>
                      {homeDot}
                      {simplify(m.home?.team_name)}
                    </span>{' '}
                    <span className="text-gray-400">vs</span>{' '}
                    <span style={{ ...awayStyle, ...awayPill }}>
                      {awayDot}
                      {simplify(m.away?.team_name)}
                    </span>
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
