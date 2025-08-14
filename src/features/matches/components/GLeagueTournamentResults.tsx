'use client';

import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMatchesBySeasonIdPrisma } from '@/features/matches/api-prisma';
import GroupStandingsTable from '@/features/stats/components/GroupStandingsTable';
import StandingsTable from '@/features/stats/components/StandingsTable';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { SeasonMatchCard } from './MatchCard';

interface GLeagueTournamentResultsProps {
  seasonId?: number;
  title?: string;
  className?: string;
}

type GroupFilter = 'all' | 'A' | 'B';

type TournamentStage = 'all' | 'group_stage' | 'championship' | 'relegation';

const GLeagueTournamentResults: React.FC<GLeagueTournamentResultsProps> = ({
  seasonId: seasonIdProp,
  title,
  className = '',
}) => {
  const [selectedTournament, setSelectedTournament] =
    useState<TournamentStage>('all');
  const [selectedGroup, setSelectedGroup] = useState<GroupFilter>('all');
  const [selectedGroupStandings, setSelectedGroupStandings] = useState<
    'all' | 'A' | 'B'
  >('all');

  const seasonId = seasonIdProp ?? 21;

  const {
    data: matches = [],
    isLoading,
    error,
  } = useGoalQuery(getMatchesBySeasonIdPrisma, [seasonId]);

  // 토너먼트 스테이지별로 경기 필터링
  const filteredByTournament = matches.filter((match) => {
    if (selectedTournament === 'all') return true;
    return match.tournament_stage === selectedTournament;
  });

  // 조별로 경기 필터링 (전체 탭에서는 필터링하지 않음)
  const filteredMatches =
    selectedTournament === 'all'
      ? matches
      : filteredByTournament.filter((match) => {
          if (selectedGroup === 'all') return true;
          return match.group_stage === selectedGroup;
        });

  // 토너먼트 스테이지별 경기 수 계산
  const tournamentStats = {
    group_stage: matches.filter((m) => m.tournament_stage === 'group_stage')
      .length,
    championship: matches.filter((m) => m.tournament_stage === 'championship')
      .length,
    relegation: matches.filter((m) => m.tournament_stage === 'relegation')
      .length,
  };

  if (isLoading) {
    return (
      <div className={`p-4 sm:p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 sm:p-6 ${className}`}>
        <Alert>
          <AlertDescription>
            시즌 7 G리그 데이터를 불러올 수 없습니다:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 ${className}`}>
      <div className="mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
          {title ?? 'G리그 토너먼트'}
        </h1>
        <p className="text-xs sm:text-base text-gray-600">
          조별리그, 우승
          <span className="hidden sm:inline sm:ml-1">토너먼트</span>, 멸망
          <span className="hidden sm:inline sm:ml-1">토너먼트</span>의 경기
          결과를 확인하세요.
        </p>
      </div>

      {/* 토너먼트 스테이지별 통계 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="text-[11px] text-center sm:text-sm text-gray-500">
            전체 경기
          </div>
          <div className="text-base text-center sm:text-xl md:text-2xl font-bold text-gray-900">
            {matches.length}
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="text-[11px] text-center sm:text-sm text-gray-500">
            조별리그
          </div>
          <div className="text-base text-center sm:text-xl md:text-2xl font-bold text-blue-600">
            {tournamentStats.group_stage}
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="text-[11px] text-center sm:text-sm text-gray-500">
            우승<span className="hidden sm:inline sm:ml-1">토너먼트</span>
          </div>
          <div className="text-base text-center sm:text-xl md:text-2xl font-bold text-yellow-600">
            {tournamentStats.championship}
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
          <div className="text-[11px] text-center sm:text-sm text-gray-500">
            멸망<span className="hidden sm:inline sm:ml-1">토너먼트</span>
          </div>
          <div className="text-base text-center sm:text-xl md:text-2xl font-bold text-red-600">
            {tournamentStats.relegation}
          </div>
        </div>
      </div>

      <Tabs
        value={selectedTournament}
        onValueChange={(value) => {
          setSelectedTournament(value as TournamentStage);
          setSelectedGroup('all');
        }}
      >
        <TabsList className="grid w-full grid-cols-4 gap-1 sm:gap-2">
          <TabsTrigger
            value="all"
            className="w-full text-center text-[11px] sm:text-sm"
          >
            전체
          </TabsTrigger>
          <TabsTrigger
            value="group_stage"
            className="w-full text-center text-[11px] sm:text-sm"
          >
            조별리그
          </TabsTrigger>
          <TabsTrigger
            value="championship"
            className="w-full text-center text-[11px] sm:text-sm"
          >
            우승<span className="hidden sm:inline sm:ml-1">토너먼트</span>
          </TabsTrigger>
          <TabsTrigger
            value="relegation"
            className="w-full text-center text-[11px] sm:text-sm"
          >
            멸망<span className="hidden sm:inline sm:ml-1">토너먼트</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-xl font-semibold text-gray-800">
              전체 경기
            </h2>
          </div>
          <div className="mb-4">
            <Badge variant="emphasis" className="mb-2">
              전체 경기 ({filteredMatches.length}경기)
            </Badge>
          </div>
          {filteredMatches.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">
                {selectedGroup === 'all'
                  ? '경기 데이터가 없습니다.'
                  : `${selectedGroup}조 경기 데이터가 없습니다.`}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {filteredMatches
                .sort(
                  (a, b) =>
                    new Date(a.match_date).getTime() -
                    new Date(b.match_date).getTime()
                )
                .map((match) => (
                  <div key={match.match_id} className="relative">
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                      {match.tournament_stage && (
                        <Badge variant="emphasis" className="text-xs">
                          {match.tournament_stage === 'group_stage'
                            ? '조별리그'
                            : match.tournament_stage === 'championship'
                              ? '우승 토너먼트'
                              : match.tournament_stage === 'relegation'
                                ? '멸망 토너먼트'
                                : match.tournament_stage}
                        </Badge>
                      )}
                    </div>
                    <SeasonMatchCard matchId={match.match_id} />
                  </div>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="group_stage" className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-xl font-semibold text-gray-800">
              조별리그 경기
            </h2>
            <div className="flex gap-1.5 sm:gap-2">
              <Button
                variant={selectedGroup === 'all' ? 'primary' : 'outline'}
                className="h-7 px-2.5 py-1 text-[11px] sm:h-8 sm:px-4 sm:py-2 sm:text-xs"
                onClick={() => setSelectedGroup('all')}
              >
                전체
              </Button>
              <Button
                variant={selectedGroup === 'A' ? 'primary' : 'outline'}
                className="h-7 px-2.5 py-1 text-[11px] sm:h-8 sm:px-4 sm:py-2 sm:text-xs"
                onClick={() => setSelectedGroup('A')}
              >
                A조
              </Button>
              <Button
                variant={selectedGroup === 'B' ? 'primary' : 'outline'}
                className="h-7 px-2.5 py-1 text-[11px] sm:h-8 sm:px-4 sm:py-2 sm:text-xs"
                onClick={() => setSelectedGroup('B')}
              >
                B조
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <Badge variant="emphasis" className="mb-2">
              조별리그{' '}
              {selectedGroup === 'all' ? '전체 조' : `${selectedGroup}조`} 경기
              ({filteredMatches.length}경기)
            </Badge>
          </div>
          {filteredMatches.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">
                조별리그{' '}
                {selectedGroup === 'all'
                  ? '경기 데이터가 없습니다.'
                  : `${selectedGroup}조 경기 데이터가 없습니다.`}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {filteredMatches
                .sort(
                  (a, b) =>
                    new Date(a.match_date).getTime() -
                    new Date(b.match_date).getTime()
                )
                .map((match) => (
                  <div key={match.match_id} className="relative">
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                      <Badge variant="emphasis" className="text-xs">
                        조별리그
                      </Badge>
                    </div>
                    <SeasonMatchCard matchId={match.match_id} />
                  </div>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="championship" className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-xl font-semibold text-gray-800">
              우승<span className="hidden sm:inline sm:ml-1">토너먼트</span>{' '}
              경기
            </h2>
          </div>
          <div className="mb-4">
            <Badge variant="emphasis" className="mb-2">
              우승<span className="hidden sm:inline sm:ml-1">토너먼트</span>{' '}
              경기 ({filteredMatches.length}경기)
            </Badge>
          </div>
          {filteredMatches.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">
                아직 우승 토너먼트 경기가 진행되지 않았습니다.
              </div>
              <div className="text-sm text-gray-400 mt-2">
                조별리그가 완료된 후 우승 토너먼트가 진행됩니다.
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {filteredMatches
                .sort(
                  (a, b) =>
                    new Date(a.match_date).getTime() -
                    new Date(b.match_date).getTime()
                )
                .map((match) => (
                  <div key={match.match_id} className="relative">
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                      <Badge variant="emphasis" className="text-xs">
                        우승 토너먼트
                      </Badge>
                    </div>
                    <SeasonMatchCard matchId={match.match_id} />
                  </div>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="relegation" className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-xl font-semibold text-gray-800">
              멸망<span className="hidden sm:inline sm:ml-1">토너먼트</span>{' '}
              경기
            </h2>
          </div>
          <div className="mb-4">
            <Badge variant="emphasis" className="mb-2">
              멸망<span className="hidden sm:inline sm:ml-1">토너먼트</span>{' '}
              경기 ({filteredMatches.length}경기)
            </Badge>
          </div>
          {filteredMatches.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">
                아직 멸망 토너먼트 경기가 진행되지 않았습니다.
              </div>
              <div className="text-sm text-gray-400 mt-2">
                조별리그가 완료된 후 멸망 토너먼트가 진행됩니다.
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {filteredMatches
                .sort(
                  (a, b) =>
                    new Date(a.match_date).getTime() -
                    new Date(b.match_date).getTime()
                )
                .map((match) => (
                  <div key={match.match_id} className="relative">
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                      <Badge variant="emphasis" className="text-xs">
                        멸망 토너먼트
                      </Badge>
                    </div>
                    <SeasonMatchCard matchId={match.match_id} />
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Standings tabs: 전체(standings) / A조 / B조 */}
      <div className="mt-8">
        <div className="mb-3">
          <Tabs
            value={selectedGroupStandings}
            onValueChange={(val) =>
              setSelectedGroupStandings((val as 'all' | 'A' | 'B') ?? 'all')
            }
          >
            <TabsList className="grid w-full grid-cols-3 gap-1 sm:gap-2">
              <TabsTrigger
                value="all"
                className="w-full text-center text-[11px] sm:text-sm"
              >
                전체
              </TabsTrigger>
              <TabsTrigger
                value="A"
                className="w-full text-center text-[11px] sm:text-sm"
              >
                조별리그 A조
              </TabsTrigger>
              <TabsTrigger
                value="B"
                className="w-full text-center text-[11px] sm:text-sm"
              >
                조별리그 B조
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {selectedGroupStandings === 'all' ? (
          <StandingsTable seasonId={seasonId} />
        ) : (
          <GroupStandingsTable
            seasonId={seasonId}
            tournamentStage="group_stage"
            groupStage={selectedGroupStandings}
          />
        )}
      </div>
    </div>
  );
};

export default GLeagueTournamentResults;
