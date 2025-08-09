'use client';

import { useQueries } from '@tanstack/react-query';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPositionColor } from '@/features/matches/lib/matchUtils';
import { getPlayerSummaryPrisma } from '@/features/players';
import type { Player } from '@/lib/types';

interface TeamSquadTableProps {
  players: Player[];
}

export default function TeamSquadTable({ players }: TeamSquadTableProps) {
  const playersArray = Array.isArray(players) ? players : [];

  const summaryResults = useQueries({
    queries: playersArray.map((p) => ({
      queryKey: ['getPlayerSummaryPrisma', p.player_id],
      queryFn: () => getPlayerSummaryPrisma(p.player_id),
      staleTime: 5 * 60 * 1000,
      retry: 1,
      enabled: Boolean(p.player_id),
    })),
  });

  const isAnyLoading = summaryResults.some((q) => q.isLoading);

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">스쿼드</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>선수명</TableHead>
              <TableHead className="text-right">포지션</TableHead>
              <TableHead className="text-left">참여 시즌</TableHead>
              <TableHead className="text-right">출전</TableHead>
              <TableHead className="text-right">골</TableHead>
              <TableHead className="text-right">도움</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playersArray.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 py-6"
                >
                  등록된 선수가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              playersArray.map((p, idx) => {
                const q = summaryResults[idx];
                const data = q?.data;

                const primaryPosition = data?.primary_position ?? '-';
                const appearances = data?.totals?.appearances ?? 0;
                const goals = data?.totals?.goals ?? 0;
                const assists = data?.totals?.assists ?? 0;
                const seasonLabels = (data?.seasons ?? [])
                  .map(
                    (s) => s.season_name || (s.year ? `시즌 ${s.year}` : null)
                  )
                  .filter((x): x is string => Boolean(x));

                return (
                  <TableRow key={p.player_id}>
                    <TableCell className="w-20">
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
                    <TableCell className="text-right">
                      {q?.isLoading ? (
                        '…'
                      ) : (
                        <Badge
                          variant="outline"
                          className={`${getPositionColor(primaryPosition)} text-xs px-2 py-0`}
                          title={primaryPosition}
                        >
                          {primaryPosition}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-left">
                      {q?.isLoading ? (
                        '…'
                      ) : seasonLabels.length === 0 ? (
                        '-'
                      ) : (
                        <div className="flex flex-wrap justify-start gap-1">
                          {(() => {
                            const maxBadges = 3;
                            const visible = seasonLabels.slice(0, maxBadges);
                            const remaining =
                              seasonLabels.length - visible.length;
                            return (
                              <>
                                {visible.map((label, i) => (
                                  <Badge
                                    key={`${p.player_id}-season-${i}`}
                                    variant="secondary"
                                  >
                                    {label}
                                  </Badge>
                                ))}
                                {remaining > 0 && (
                                  <Badge variant="secondary">
                                    +{remaining}
                                  </Badge>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {q?.isLoading ? '…' : appearances}
                    </TableCell>
                    <TableCell className="text-right">
                      {q?.isLoading ? '…' : goals}
                    </TableCell>
                    <TableCell className="text-right">
                      {q?.isLoading ? '…' : assists}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {isAnyLoading && (
          <p className="text-xs text-gray-500 mt-2">선수 요약 불러오는 중…</p>
        )}
      </CardContent>
    </Card>
  );
}
