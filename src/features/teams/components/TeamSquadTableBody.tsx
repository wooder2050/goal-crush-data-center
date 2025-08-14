'use client';

import Link from 'next/link';

import { GoalWrapper } from '@/common/GoalWrapper';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getPlayerSummaryPrisma } from '@/features/players';
import PlayerPositionBadge from '@/features/teams/components/PlayerPositionBadge';
import SeasonListBadges from '@/features/teams/components/SeasonListBadges';
import TeamSquadTableRowSkeleton from '@/features/teams/components/TeamSquadTableRowSkeleton';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import type { Player } from '@/lib/types';

interface TeamSquadTableBodyProps {
  players: Player[];
  teamId: number;
}

type SeasonSummary = {
  season_id: number | null;
  season_name: string | null;
  year: number | null;
};

export default function TeamSquadTableBody({
  players,
  teamId,
}: TeamSquadTableBodyProps) {
  const playersArray = Array.isArray(players) ? players : [];

  return (
    <TableBody>
      {playersArray.length === 0 ? (
        <TableRow>
          <TableCell colSpan={7} className="text-center text-gray-500 py-6">
            등록된 선수가 없습니다.
          </TableCell>
        </TableRow>
      ) : (
        <GoalWrapper
          fallback={
            <>
              {Array.from({
                length: Math.min(playersArray.length || 6, 6),
              }).map((_, i) => (
                <TeamSquadTableRowSkeleton key={i} />
              ))}
            </>
          }
        >
          {playersArray.map((p) => (
            <TeamSquadTableRow key={p.player_id} player={p} teamId={teamId} />
          ))}
        </GoalWrapper>
      )}
    </TableBody>
  );
}

function TeamSquadTableRow({
  player,
  teamId,
}: {
  player: Player;
  teamId: number;
}) {
  const { data } = useGoalSuspenseQuery(getPlayerSummaryPrisma, [
    player.player_id,
    teamId,
  ]);
  const isLoading = false;

  const primaryPosition = data?.primary_position ?? '-';
  const appearances =
    data?.totals_for_team?.appearances ?? data?.totals?.appearances ?? 0;
  const goals = data?.totals_for_team?.goals ?? data?.totals?.goals ?? 0;
  const assists = data?.totals_for_team?.assists ?? data?.totals?.assists ?? 0;
  const seasonLabels = (data?.seasons ?? [])
    .map(
      (s: SeasonSummary) => s.season_name || (s.year ? `시즌 ${s.year}` : null)
    )
    .filter((x: unknown): x is string => Boolean(x));

  return (
    <TableRow>
      <TableCell className="w-20">{player.jersey_number ?? '-'}</TableCell>
      <TableCell>
        <Link href={`/players/${player.player_id}`} className="hover:underline">
          {player.name}
        </Link>
      </TableCell>
      <TableCell className="text-right">
        {isLoading ? '…' : <PlayerPositionBadge position={primaryPosition} />}
      </TableCell>
      <TableCell className="text-left">
        {isLoading ? (
          '…'
        ) : (
          <SeasonListBadges labels={seasonLabels} max={3} align="start" />
        )}
      </TableCell>
      <TableCell className="text-right">
        {isLoading ? '…' : appearances}
      </TableCell>
      <TableCell className="text-right">{isLoading ? '…' : goals}</TableCell>
      <TableCell className="text-right">{isLoading ? '…' : assists}</TableCell>
    </TableRow>
  );
}
