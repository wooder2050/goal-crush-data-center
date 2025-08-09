'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TeamSquadTableBody from '@/features/teams/components/TeamSquadTableBody';
import type { Player } from '@/lib/types';

interface TeamSquadTableProps {
  players: Player[];
  teamId: number;
}

export default function TeamSquadTable({
  players,
  teamId,
}: TeamSquadTableProps) {
  const playersArray = Array.isArray(players) ? players : [];

  return (
    <Card>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
