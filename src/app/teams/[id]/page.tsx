'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getTeamByIdPrisma,
  getTeamPlayersPrisma,
} from '@/features/teams/api-prisma';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import type { Player, Team } from '@/lib/types';

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export default function TeamDetailPage({ params }: ParamsProps) {
  const { data: team } = useGoalQuery(async () => {
    const p = await params;
    const id = Number(p.id);
    if (!id) return null as unknown as Team;
    return (await getTeamByIdPrisma(id)) as Team;
  }, []);

  const { data: players = [] } = useGoalQuery(async () => {
    const p = await params;
    const id = Number(p.id);
    if (!id) return [] as Player[];
    return (await getTeamPlayersPrisma(id)) as unknown as Player[];
  }, []);

  if (!team) {
    return <div className="p-6">팀 정보를 불러오는 중...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 relative rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
          {team.logo ? (
            <Image
              src={team.logo}
              alt={`${team.team_name} 로고`}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <span className="text-xl text-gray-600 font-semibold">
              {team.team_name?.charAt(0) ?? '?'}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{team.team_name}</h1>
          <div className="text-sm text-gray-500">팀 ID: {team.team_id}</div>
        </div>
      </div>

      {/* Squad */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">스쿼드</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>번호</TableHead>
                <TableHead>선수명</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-gray-500 py-6"
                  >
                    등록된 선수가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                players.map((p: Player) => (
                  <TableRow key={p.player_id}>
                    <TableCell className="w-24">
                      {p.jersey_number ?? '-'}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/players/${p.player_id}`}
                        className="hover:underline"
                      >
                        {p.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Matches shortcut */}
      <div className="text-sm text-blue-600">
        <Link href={`/seasons/season-7-gleague`}>시즌 7 G리그 경기 보기</Link>
      </div>
    </div>
  );
}
