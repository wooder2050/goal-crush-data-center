'use client';

import React, { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getMatchesBySeasonIdPrisma } from '../api-prisma';
import MatchCard from './MatchCard/MatchCard';
import SeasonSummary from './SeasonSummary';

interface GLeagueTournamentResultsProps {
  className?: string;
}

type TournamentStage = 'all' | 'group_stage' | 'championship' | 'relegation';
type GroupFilter = 'all' | 'A' | 'B';

const GLeagueTournamentResults: React.FC<GLeagueTournamentResultsProps> = ({
  className = '',
}) => {
  const [selectedTournament, setSelectedTournament] =
    useState<TournamentStage>('all');
  const [selectedGroup, setSelectedGroup] = useState<GroupFilter>('all');

  const {
    data: matches = [],
    isLoading,
    error,
  } = useGoalQuery(getMatchesBySeasonIdPrisma, [21]);

  // 토너먼트 스테이지별로 경기 필터링
  const filteredByTournament = matches.filter((match) => {
    if (selectedTournament === 'all') return true;
    return match.tournament_stage === selectedTournament;
  });

  // 조별로 경기 필터링
  const filteredMatches = filteredByTournament.filter((match) => {
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
      <div className={`p-6 ${className}`}>
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
      <div className={`p-6 ${className}`}>
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
    <div className={`p-6 ${className}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          골때리는 그녀들 시즌 7 G리그
        </h1>
        <p className="text-gray-600">2025년 - 조별리그 + 토너먼트</p>
      </div>

      <div className="space-y-8">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              시즌 7 G리그 경기 데이터가 아직 없습니다
            </h3>
            <p className="text-gray-500">
              시즌 7 G리그 경기 데이터가 입력되면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div>
            {/* 토너먼트 스테이지 통계 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>토너먼트 진행 상황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {tournamentStats.group_stage}
                    </div>
                    <div className="text-sm text-gray-600">조별리그</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {tournamentStats.championship}
                    </div>
                    <div className="text-sm text-gray-600">우승 토너먼트</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {tournamentStats.relegation}
                    </div>
                    <div className="text-sm text-gray-600">멸망 토너먼트</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 토너먼트 스테이지 탭 */}
            <Tabs
              value={selectedTournament}
              onValueChange={(value) =>
                setSelectedTournament(value as TournamentStage)
              }
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="group_stage">조별리그</TabsTrigger>
                <TabsTrigger value="championship">우승 토너먼트</TabsTrigger>
                <TabsTrigger value="relegation">멸망 토너먼트</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    전체 경기
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedGroup === 'all' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedGroup('all')}
                    >
                      전체
                    </Button>
                    <Button
                      variant={selectedGroup === 'A' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedGroup('A')}
                    >
                      A조
                    </Button>
                    <Button
                      variant={selectedGroup === 'B' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedGroup('B')}
                    >
                      B조
                    </Button>
                  </div>
                </div>
                <div className="mb-4">
                  <Badge variant="emphasis" className="mb-2">
                    {selectedGroup === 'all' ? '전체 조' : `${selectedGroup}조`}{' '}
                    경기 ({filteredMatches.length}경기)
                  </Badge>
                </div>
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
                          {match.group_stage && (
                            <Badge variant="outline" className="text-xs">
                              {match.group_stage}조
                            </Badge>
                          )}
                          {match.tournament_stage && (
                            <Badge variant="emphasis" className="text-xs">
                              {match.tournament_stage === 'group_stage'
                                ? '조별리그'
                                : match.tournament_stage === 'championship'
                                  ? '우승'
                                  : match.tournament_stage === 'relegation'
                                    ? '멸망'
                                    : match.tournament_stage}
                            </Badge>
                          )}
                        </div>
                        <MatchCard matchId={match.match_id} />
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="group_stage" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    조별리그
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedGroup === 'all' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedGroup('all')}
                    >
                      전체
                    </Button>
                    <Button
                      variant={selectedGroup === 'A' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedGroup('A')}
                    >
                      A조
                    </Button>
                    <Button
                      variant={selectedGroup === 'B' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedGroup('B')}
                    >
                      B조
                    </Button>
                  </div>
                </div>
                <div className="mb-4">
                  <Badge variant="emphasis" className="mb-2">
                    조별리그{' '}
                    {selectedGroup === 'all' ? '전체 조' : `${selectedGroup}조`}{' '}
                    경기 ({filteredMatches.length}경기)
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  {filteredMatches
                    .sort(
                      (a, b) =>
                        new Date(a.match_date).getTime() -
                        new Date(b.match_date).getTime()
                    )
                    .map((match) => (
                      <div key={match.match_id} className="relative">
                        <div className="absolute top-2 right-2 z-10">
                          {match.group_stage && (
                            <Badge variant="outline" className="text-xs">
                              {match.group_stage}조
                            </Badge>
                          )}
                        </div>
                        <MatchCard matchId={match.match_id} />
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="championship" className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    우승 토너먼트
                  </h2>
                  <Badge variant="emphasis" className="mb-2">
                    우승 토너먼트 경기 ({filteredMatches.length}경기)
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  {filteredMatches
                    .sort(
                      (a, b) =>
                        new Date(a.match_date).getTime() -
                        new Date(b.match_date).getTime()
                    )
                    .map((match) => (
                      <div key={match.match_id} className="relative">
                        <MatchCard matchId={match.match_id} />
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="relegation" className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    멸망 토너먼트
                  </h2>
                  <Badge variant="emphasis" className="mb-2">
                    멸망 토너먼트 경기 ({filteredMatches.length}경기)
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  {filteredMatches
                    .sort(
                      (a, b) =>
                        new Date(a.match_date).getTime() -
                        new Date(b.match_date).getTime()
                    )
                    .map((match) => (
                      <div key={match.match_id} className="relative">
                        <MatchCard matchId={match.match_id} />
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>

            {filteredMatches.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  {selectedTournament === 'all'
                    ? '경기 데이터가 없습니다.'
                    : selectedTournament === 'group_stage'
                      ? '조별리그 경기가 없습니다.'
                      : selectedTournament === 'championship'
                        ? '우승 토너먼트 경기가 없습니다.'
                        : '멸망 토너먼트 경기가 없습니다.'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <SeasonSummary seasonId={21} seasonName="시즌 7 G리그" className="mt-8" />
    </div>
  );
};

export default GLeagueTournamentResults;
