'use client';

import { useMemo } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPositionColor } from '@/features/matches/lib/matchUtils';
import { getPlayerSummaryPrisma } from '@/features/players';
import TeamSquadTableBody from '@/features/teams/components/TeamSquadTableBody';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import type { Player } from '@/lib/types';

// Derived row type to include optional stats fields
type SquadRow = Player & {
  position?: string | null;
  matches_played?: number | null;
  goals?: number | null;
  assists?: number | null;
};

interface TeamSquadTableProps {
  players: Player[];
  teamId: number;
}

export default function TeamSquadTable({
  players,
  teamId,
}: TeamSquadTableProps) {
  const playersArray: SquadRow[] = useMemo(
    () => (Array.isArray(players) ? (players as SquadRow[]) : []),
    [players]
  );

  return (
    <Card>
      <CardContent className="px-0 sm:px-4">
        {/* Mobile list */}
        <div className="sm:hidden space-y-2">
          {playersArray.length === 0 ? (
            <div className="py-6 text-center text-[12px] text-gray-500">
              등록된 선수가 없습니다.
            </div>
          ) : (
            playersArray.map((p) => (
              <TeamSquadMobileRow
                key={p.player_id}
                player={p}
                teamId={teamId}
              />
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">번호</TableHead>
                <TableHead>선수</TableHead>
                <TableHead className="text-right">포지션</TableHead>
                <TableHead className="text-left">참여 시즌</TableHead>
                <TableHead className="text-right">출전</TableHead>
                <TableHead className="text-right">골</TableHead>
                <TableHead className="text-right">도움</TableHead>
              </TableRow>
            </TableHeader>
            <TeamSquadTableBody players={playersArray} teamId={teamId} />
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamSquadMobileRow({
  player,
  teamId,
}: {
  player: SquadRow;
  teamId: number;
}) {
  const { data, isLoading } = useGoalQuery(
    getPlayerSummaryPrisma,
    [player.player_id, teamId],
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      enabled: Boolean(player.player_id),
    }
  );

  const primaryPosition = data?.primary_position ?? '-';
  const appearances =
    data?.totals_for_team?.appearances ?? data?.totals?.appearances ?? 0;
  const goals = data?.totals_for_team?.goals ?? data?.totals?.goals ?? 0;
  const assists = data?.totals_for_team?.assists ?? data?.totals?.assists ?? 0;

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-gray-600">
          #{player.jersey_number ?? '-'}
        </div>
        <div
          className={`text-xs px-1.5 py-0.5 rounded ${isLoading ? 'text-gray-600' : getPositionColor(primaryPosition)}`}
        >
          {isLoading ? '…' : primaryPosition}
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="truncate text-sm font-semibold">{player.name}</div>
        <div className="text-[11px] text-gray-600">
          출전 {isLoading ? '…' : appearances}
        </div>
      </div>
      <div className="mt-1 grid grid-cols-3 gap-2 text-center">
        <div className="rounded bg-gray-50 border px-2 py-1">
          <div className="text-[11px] text-gray-600">골</div>
          <div className="text-sm font-semibold">{isLoading ? '…' : goals}</div>
        </div>
        <div className="rounded bg-gray-50 border px-2 py-1">
          <div className="text-[11px] text-gray-600">도움</div>
          <div className="text-sm font-semibold">
            {isLoading ? '…' : assists}
          </div>
        </div>
        <div className="rounded bg-gray-50 border px-2 py-1">
          <div className="text-[11px] text-gray-600">포지션</div>
          <div
            className={`text-sm font-semibold inline-block px-1.5 py-0.5 rounded ${isLoading ? '' : getPositionColor(primaryPosition)}`}
          >
            {isLoading ? '…' : primaryPosition}
          </div>
        </div>
      </div>
    </div>
  );
}
