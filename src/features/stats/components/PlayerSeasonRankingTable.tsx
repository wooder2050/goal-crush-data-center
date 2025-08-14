'use client';

import Image from 'next/image';
import { FC, useMemo } from 'react';

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

const PlayerSeasonRankingTable: FC<PlayerSeasonRankingTableProps> = ({
  seasonId,
  className,
}) => {
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

  const sortedAppearances = useMemo(() => {
    return [...topAppearances].sort((a, b) => {
      const aApps = a.matches_played ?? 0;
      const bApps = b.matches_played ?? 0;
      if (bApps !== aApps) return bApps - aApps;
      // 동률일 때 골 많은 순으로 보조 정렬
      const aGoals = a.goals ?? 0;
      const bGoals = b.goals ?? 0;
      if (bGoals !== aGoals) return bGoals - aGoals;
      // 그래도 동률이면 어시스트 많은 순
      const aAst = a.assists ?? 0;
      const bAst = b.assists ?? 0;
      return bAst - aAst;
    });
  }, [topAppearances]);

  return (
    <div className={className}>
      <h3 className="text-lg font-bold mb-2">개인 순위</h3>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
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
                    <TableRow key={row.player_id ?? idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <a
                          href={`/players/${row.player_id}`}
                          className="hover:underline"
                        >
                          {row.player_name ?? '-'}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {row.team_logo ? (
                            <div className="w-5 h-5 relative flex-shrink-0 rounded-full overflow-hidden">
                              <Image
                                src={row.team_logo}
                                alt={row.team_name ?? 'team'}
                                fill
                                className="object-cover"
                                sizes="20px"
                              />
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-[8px] text-gray-500 font-medium">
                                {row.team_name?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                          <a
                            href={`/teams/${row.team_id}`}
                            className="hover:underline"
                          >
                            {row.team_name ?? '-'}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {row.matches_played ?? 0}
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        {row.goals ?? 0}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-semibold">
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
                <TableHead className="whitespace-nowrap">경기</TableHead>
                <TableHead className="hidden sm:table-cell whitespace-nowrap">
                  골
                </TableHead>
                <TableHead className="hidden sm:table-cell whitespace-nowrap">
                  도움
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAppearances.length === 0 ? (
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
                    <TableRow key={row.player_id ?? idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <a
                          href={`/players/${row.player_id}`}
                          className="hover:underline"
                        >
                          {row.player_name ?? '-'}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {row.team_logo ? (
                            <div className="w-5 h-5 relative flex-shrink-0 rounded-full overflow-hidden">
                              <Image
                                src={row.team_logo}
                                alt={row.team_name ?? 'team'}
                                fill
                                className="object-cover"
                                sizes="20px"
                              />
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-[10px] text-gray-500 font-medium">
                                {row.team_name?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                          <a
                            href={`/teams/${row.team_id}`}
                            className="hover:underline"
                          >
                            {row.team_name ?? '-'}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        {row.matches_played ?? 0}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {row.goals ?? 0}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
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
};

export default PlayerSeasonRankingTable;
