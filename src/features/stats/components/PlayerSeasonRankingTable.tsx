'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC, useMemo } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getTopAppearancesPrisma,
  getTopAssistsPrisma,
  getTopScorersPrisma,
} from '@/features/stats/api-prisma';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import type { PlayerSeasonStats } from '@/lib/types';

type PlayerSeasonStatsWithNames = PlayerSeasonStats & {
  player_name: string | null;
  team_name: string | null;
  team_logo?: string | null;
};

interface PlayerSeasonRankingTableProps {
  seasonId: number;
  className?: string;
}

function PlayerSeasonRankingTableSkeleton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-lg font-bold mb-2">개인 순위</h3>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
        <div>
          <h4 className="mb-3 sm:mb-4 font-semibold">득점 TOP 10</h4>
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded animate-pulse"
              >
                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 sm:mb-4 font-semibold">출전 TOP 10</h4>
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded animate-pulse"
              >
                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerSeasonRankingTableInner({
  seasonId,
  className,
}: PlayerSeasonRankingTableProps) {
  const { data: topScorers = [] } = useGoalSuspenseQuery(
    (id) =>
      getTopScorersPrisma(id, 10) as unknown as Promise<
        PlayerSeasonStatsWithNames[]
      >,
    [seasonId]
  );
  const { data: topAppearances = [] } = useGoalSuspenseQuery(
    (id) =>
      getTopAppearancesPrisma(id, 10) as unknown as Promise<
        PlayerSeasonStatsWithNames[]
      >,
    [seasonId]
  );
  const { data: topAssists = [] } = useGoalSuspenseQuery(
    (id) =>
      getTopAssistsPrisma(id, 10) as unknown as Promise<
        PlayerSeasonStatsWithNames[]
      >,
    [seasonId]
  );

  const sortedAppearances = useMemo(() => {
    return [...topAppearances].sort((a, b) => {
      const aApps = a.matches_played ?? 0;
      const bApps = b.matches_played ?? 0;
      if (bApps !== aApps) return bApps - aApps;
      const aGoals = a.goals ?? 0;
      const bGoals = b.goals ?? 0;
      if (bGoals !== aGoals) return bGoals - aGoals;
      const aAst = a.assists ?? 0;
      const bAst = b.assists ?? 0;
      return bAst - aAst;
    });
  }, [topAppearances]);

  const sortedAssists = useMemo(() => {
    return [...topAssists].sort((a, b) => {
      const aAst = a.assists ?? 0;
      const bAst = b.assists ?? 0;
      if (bAst !== aAst) return bAst - aAst;
      const aGoals = a.goals ?? 0;
      const bGoals = b.goals ?? 0;
      if (bGoals !== aGoals) return bGoals - aGoals;
      const aApps = a.matches_played ?? 0;
      const bApps = b.matches_played ?? 0;
      return bApps - aApps;
    });
  }, [topAssists]);

  return (
    <div className={className}>
      <h3 className="text-lg font-bold mb-2">개인 순위</h3>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <h4 className="mb-3 sm:mb-4 font-semibold">득점 TOP 10</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">순위</TableHead>
                <TableHead className="whitespace-nowrap">선수</TableHead>
                <TableHead className="whitespace-nowrap">팀</TableHead>
                <TableHead className="hidden sm:table-cell whitespace-nowrap">
                  경기
                </TableHead>
                <TableHead className="whitespace-nowrap">골</TableHead>
                <TableHead className="hidden sm:table-cell whitespace-nowrap">
                  도움
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topScorers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-6"
                  >
                    개인 순위 데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                topScorers.map(
                  (row: PlayerSeasonStatsWithNames, idx: number) => (
                    <TableRow key={row.stat_id}>
                      <TableCell className="text-center font-medium">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-100">
                            {row.team_logo ? (
                              <Image
                                src={row.team_logo}
                                alt={row.player_name ?? '선수'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                ?
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/players/${row.player_id}`}
                            className="font-medium hover:underline  transition-colors"
                          >
                            {row.player_name ?? '알 수 없음'}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {row.team_name ?? '알 수 없음'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center text-gray-600">
                        {row.matches_played ?? 0}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-blue-600">
                        {row.goals ?? 0}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center text-gray-600">
                        {row.assists ?? 0}
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </div>

        <div>
          <h4 className="mb-3 sm:mb-4 font-semibold">출전 TOP 10</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">순위</TableHead>
                <TableHead className="whitespace-nowrap">선수</TableHead>
                <TableHead className="whitespace-nowrap">팀</TableHead>
                <TableHead className="hidden sm:table-cell whitespace-nowrap">
                  경기
                </TableHead>
                <TableHead className="whitespace-nowrap">골</TableHead>
                <TableHead className="hidden sm:table-cell whitespace-nowrap">
                  도움
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAppearances.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-6"
                  >
                    개인 순위 데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                sortedAppearances.map(
                  (row: PlayerSeasonStatsWithNames, idx: number) => (
                    <TableRow key={row.stat_id}>
                      <TableCell className="text-center font-medium">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-100">
                            {row.team_logo ? (
                              <Image
                                src={row.team_logo}
                                alt={row.player_name ?? '선수'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                ?
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/players/${row.player_id}`}
                            className="font-medium hover:underline transition-colors"
                          >
                            {row.player_name ?? '알 수 없음'}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {row.team_name ?? '알 수 없음'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center text-blue-600">
                        {row.matches_played ?? 0}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gray-600">
                        {row.goals ?? 0}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center text-gray-600">
                        {row.assists ?? 0}
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </div>
        <div>
          <h4 className="mb-3 sm:mb-4 font-semibold">도움 TOP 10</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">순위</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssists.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-6"
                  >
                    개인 순위 데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                sortedAssists.map(
                  (row: PlayerSeasonStatsWithNames, idx: number) => (
                    <TableRow key={row.stat_id}>
                      <TableCell className="text-center font-medium">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-100">
                            {row.team_logo ? (
                              <Image
                                src={row.team_logo}
                                alt={row.player_name ?? '선수'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                ?
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/players/${row.player_id}`}
                            className="font-medium hover:underline transition-colors"
                          >
                            {row.player_name ?? '알 수 없음'}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {row.team_name ?? '알 수 없음'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center text-gray-600">
                        {row.matches_played ?? 0}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gray-600">
                        {row.goals ?? 0}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center text-blue-600">
                        {row.assists ?? 0}
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

const PlayerSeasonRankingTable: FC<PlayerSeasonRankingTableProps> = ({
  seasonId,
  className,
}) => {
  return (
    <GoalWrapper
      fallback={<PlayerSeasonRankingTableSkeleton className={className} />}
    >
      <PlayerSeasonRankingTableInner
        seasonId={seasonId}
        className={className}
      />
    </GoalWrapper>
  );
};

export default PlayerSeasonRankingTable;
