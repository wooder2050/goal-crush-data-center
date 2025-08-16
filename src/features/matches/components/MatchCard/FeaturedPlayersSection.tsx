'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react';

import { Badge, Card } from '@/components/ui';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import { MatchWithTeams } from '@/lib/types/database';

import {
  getKeyPlayersByMatchIdPrisma,
  getMatchLineupsPrisma,
} from '../../api-prisma';

interface Props {
  match: MatchWithTeams;
}

export default function FeaturedPlayersSection({ match }: Props) {
  const isScheduled = match.home_score == null && match.away_score == null;

  const { data: predicted } = useGoalSuspenseQuery(
    getKeyPlayersByMatchIdPrisma,
    [match.match_id]
  );

  const { data: lineups } = useGoalSuspenseQuery(getMatchLineupsPrisma, [
    match.match_id,
  ]);

  const homeKey = `${match.match_id}_${match.home_team_id}`;
  const awayKey = `${match.match_id}_${match.away_team_id}`;

  const [homePick, awayPick] = useMemo(() => {
    if (isScheduled) {
      const home = predicted?.home?.[0] ?? null;
      const away = predicted?.away?.[0] ?? null;
      return [
        home
          ? {
              player_id: home.player_id,
              name: home.player_name,
              goals: home.goals,
              assists: home.assists,
              jersey_number:
                typeof (home as { jersey_number?: unknown }).jersey_number ===
                'number'
                  ? ((home as { jersey_number: number })
                      .jersey_number as number)
                  : null,
              profile_image_url:
                typeof (home as { profile_image_url?: unknown })
                  .profile_image_url === 'string'
                  ? ((home as { profile_image_url: string })
                      .profile_image_url as string)
                  : null,
              position:
                typeof (home as { position?: unknown }).position === 'string'
                  ? ((home as { position: string }).position as string)
                  : null,
            }
          : null,
        away
          ? {
              player_id: away.player_id,
              name: away.player_name,
              goals: away.goals,
              assists: away.assists,
              jersey_number:
                typeof (away as { jersey_number?: unknown }).jersey_number ===
                'number'
                  ? ((away as { jersey_number: number })
                      .jersey_number as number)
                  : null,
              profile_image_url:
                typeof (away as { profile_image_url?: unknown })
                  .profile_image_url === 'string'
                  ? ((away as { profile_image_url: string })
                      .profile_image_url as string)
                  : null,
              position:
                typeof (away as { position?: unknown }).position === 'string'
                  ? ((away as { position: string }).position as string)
                  : null,
            }
          : null,
      ] as const;
    }

    type LineupRow = {
      player_id: number;
      player_name: string;
      goals?: number | null;
      assists?: number | null;
      minutes_played?: number | null;
      jersey_number?: number | null;
      profile_image_url?: string | null;
      position?: string | null;
    };
    const selectBest = (arr: unknown, concededGoals: number) => {
      if (!Array.isArray(arr) || arr.length === 0) return null;
      const rows = arr as LineupRow[];
      const hasAnyContribution = rows.some(
        (r) =>
          (typeof r.goals === 'number' && r.goals > 0) ||
          (typeof r.assists === 'number' && r.assists > 0)
      );
      const sorted = [...rows].sort((a, b) => {
        const g = (x: LineupRow) => (typeof x.goals === 'number' ? x.goals : 0);
        const as = (x: LineupRow) =>
          typeof x.assists === 'number' ? x.assists : 0;
        const min = (x: LineupRow) =>
          typeof x.minutes_played === 'number' ? x.minutes_played : 0;
        if (g(b) !== g(a)) return g(b) - g(a);
        if (as(b) !== as(a)) return as(b) - as(a);
        return min(b) - min(a);
      });
      if (hasAnyContribution) {
        const p = sorted[0];
        return p
          ? {
              player_id: p.player_id,
              name: p.player_name,
              goals: p.goals ?? 0,
              assists: p.assists ?? 0,
              jersey_number: p.jersey_number ?? null,
              profile_image_url: p.profile_image_url ?? null,
              position: p.position ?? null,
            }
          : null;
      }

      // No goals/assists from any player: if clean sheet, select goalkeeper; else none
      if (concededGoals === 0) {
        const goalkeepers = rows.filter(
          (r) =>
            (r.position || '').toLowerCase() === 'goalkeeper' ||
            (r.position || '').toLowerCase() === 'gk'
        );
        if (goalkeepers.length > 0) {
          const gkSorted = [...goalkeepers].sort(
            (a, b) => (b.minutes_played || 0) - (a.minutes_played || 0)
          );
          const gk = gkSorted[0];
          return gk
            ? {
                player_id: gk.player_id,
                name: gk.player_name,
                goals: gk.goals ?? 0,
                assists: gk.assists ?? 0,
                jersey_number: gk.jersey_number ?? null,
                profile_image_url: gk.profile_image_url ?? null,
                position: gk.position ?? 'Goalkeeper',
              }
            : null;
        }
      }

      return null;
    };

    const concededHome =
      typeof match.away_score === 'number' ? match.away_score : 0;
    const concededAway =
      typeof match.home_score === 'number' ? match.home_score : 0;

    const home = selectBest(
      (lineups as Record<string, unknown> | undefined)?.[homeKey],
      concededHome
    );
    const away = selectBest(
      (lineups as Record<string, unknown> | undefined)?.[awayKey],
      concededAway
    );
    return [home, away] as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScheduled, predicted, lineups, homeKey, awayKey]);

  if (!homePick && !awayPick) return null;

  const FullImage = ({ name, url }: { name: string; url: string | null }) => {
    if (!url) return null;
    return (
      <span className="relative block w-full h-56 sm:h-72 rounded-md overflow-hidden bg-transparent">
        <Image
          src={url}
          alt={name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-contain"
        />
      </span>
    );
  };

  return (
    <Card className="p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800">
          {isScheduled ? '🌟 핵심 선수 (예상)' : '🌟 베스트 플레이어'}
        </div>
        <div className="text-[11px] text-gray-500">
          {isScheduled ? '최근 경기 기준' : '이 경기 기준'}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-gray-600 mb-1">홈팀</div>
          {homePick ? (
            <div className="flex flex-col gap-2">
              <FullImage
                name={homePick.name}
                url={
                  (homePick as { profile_image_url?: string | null })
                    .profile_image_url ?? null
                }
              />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Link
                    href={`/players/${homePick.player_id}`}
                    className="font-medium text-gray-900 hover:underline truncate"
                  >
                    {homePick.name}
                  </Link>
                  {typeof homePick.jersey_number === 'number' && (
                    <span className="text-[11px] text-gray-500">
                      #{homePick.jersey_number}
                    </span>
                  )}
                </div>
                {((homePick as { position?: string | null }).position ??
                  null) && (
                  <div className="text-[11px] text-gray-500">
                    포지션:{' '}
                    {(homePick as { position?: string | null }).position}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  {homePick.goals > 0 && (
                    <Badge className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800">
                      ⚽ {homePick.goals}
                    </Badge>
                  )}
                  {homePick.assists > 0 && (
                    <Badge className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800">
                      🎯 {homePick.assists}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500">선수 정보 없음</div>
          )}
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">원정팀</div>
          {awayPick ? (
            <div className="flex flex-col gap-2">
              <FullImage
                name={awayPick.name}
                url={
                  (awayPick as { profile_image_url?: string | null })
                    .profile_image_url ?? null
                }
              />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Link
                    href={`/players/${awayPick.player_id}`}
                    className="font-medium text-gray-900 hover:underline truncate"
                  >
                    {awayPick.name}
                  </Link>
                  {typeof awayPick.jersey_number === 'number' && (
                    <span className="text-[11px] text-gray-500">
                      #{awayPick.jersey_number}
                    </span>
                  )}
                </div>
                {((awayPick as { position?: string | null }).position ??
                  null) && (
                  <div className="text-[11px] text-gray-500">
                    포지션:{' '}
                    {(awayPick as { position?: string | null }).position}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  {awayPick.goals > 0 && (
                    <Badge className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800">
                      ⚽ {awayPick.goals}
                    </Badge>
                  )}
                  {awayPick.assists > 0 && (
                    <Badge className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800">
                      🎯 {awayPick.assists}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500">선수 정보 없음</div>
          )}
        </div>
      </div>
    </Card>
  );
}
