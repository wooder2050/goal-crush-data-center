'use client';

import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMatchesBySeasonIdPrisma } from '@/features/matches/api-prisma';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import GroupStandingsTable from '../../stats/components/GroupStandingsTable';
import { MatchCard } from './MatchCard';

interface Season7GLeagueResultsProps {
  className?: string;
}

const Season7GLeagueResults: React.FC<Season7GLeagueResultsProps> = ({
  className = '',
}) => {
  // 경기결과용 상태
  const [selectedGroup, setSelectedGroup] = useState<'A' | 'B' | 'all'>('all');
  const [selectedTournament, setSelectedTournament] = useState<
    'group_stage' | 'championship' | 'relegation' | 'all'
  >('all');

  // 순위표용 상태
  const [standingsSelectedGroup, setStandingsSelectedGroup] = useState<
    'A' | 'B' | 'all'
  >('all');
  const [standingsSelectedTournament, setStandingsSelectedTournament] =
    useState<'group_stage' | 'championship' | 'relegation' | 'all'>('all');

  const {
    data: matches = [],
    isLoading,
    error,
  } = useGoalQuery(getMatchesBySeasonIdPrisma, [21]);

  // 조별 및 토너먼트 스테이지로 경기 필터링
  const filteredMatches = matches.filter((match) => {
    // 조별 필터링
    const groupMatch =
      selectedGroup === 'all' || match.group_stage === selectedGroup;

    // 토너먼트 스테이지 필터링
    const tournamentMatch =
      selectedTournament === 'all' ||
      match.tournament_stage === selectedTournament;

    return groupMatch && tournamentMatch;
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">시즌 7 G리그</h1>
        <p className="text-gray-600">2025년 - 조별리그 + 토너먼트 진행 상황</p>
      </div>

      {/* 토너먼트 스테이지별 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">전체 경기</div>
          <div className="text-2xl font-bold text-gray-900">
            {matches.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">조별리그</div>
          <div className="text-2xl font-bold text-blue-600">
            {tournamentStats.group_stage}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">우승 토너먼트</div>
          <div className="text-2xl font-bold text-yellow-600">
            {tournamentStats.championship}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">멸망 토너먼트</div>
          <div className="text-2xl font-bold text-red-600">
            {tournamentStats.relegation}
          </div>
        </div>
      </div>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches">경기 결과</TabsTrigger>
          <TabsTrigger value="standings">순위표</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">경기 결과</h2>
            <div className="flex gap-2">
              <Button
                variant={selectedTournament === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedTournament('all')}
              >
                전체
              </Button>
              <Button
                variant={
                  selectedTournament === 'group_stage' ? 'primary' : 'outline'
                }
                size="sm"
                onClick={() => setSelectedTournament('group_stage')}
              >
                조별리그
              </Button>
              <Button
                variant={
                  selectedTournament === 'championship' ? 'primary' : 'outline'
                }
                size="sm"
                onClick={() => setSelectedTournament('championship')}
              >
                우승 토너먼트
              </Button>
              <Button
                variant={
                  selectedTournament === 'relegation' ? 'primary' : 'outline'
                }
                size="sm"
                onClick={() => setSelectedTournament('relegation')}
              >
                멸망 토너먼트
              </Button>
            </div>
          </div>

          {selectedTournament === 'group_stage' && (
            <div className="flex items-center justify-between mb-4">
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
          )}

          <div className="mb-4">
            <Badge variant="emphasis" className="mb-2">
              {selectedTournament === 'all'
                ? '전체'
                : selectedTournament === 'group_stage'
                  ? '조별리그'
                  : selectedTournament === 'championship'
                    ? '우승 토너먼트'
                    : '멸망 토너먼트'}{' '}
              {selectedGroup === 'all' ? '전체 조' : `${selectedGroup}조`} 경기
              ({filteredMatches.length}경기)
            </Badge>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">
                {selectedTournament === 'all'
                  ? '경기 데이터가 없습니다.'
                  : selectedTournament === 'group_stage'
                    ? selectedGroup === 'all'
                      ? '조별리그 경기 데이터가 없습니다.'
                      : `조별리그 ${selectedGroup}조 경기 데이터가 없습니다.`
                    : selectedTournament === 'championship'
                      ? '아직 우승 토너먼트 경기가 진행되지 않았습니다.'
                      : '아직 멸망 토너먼트 경기가 진행되지 않았습니다.'}
              </div>
              {(selectedTournament === 'championship' ||
                selectedTournament === 'relegation') && (
                <div className="text-sm text-gray-400 mt-2">
                  조별리그가 완료된 후 토너먼트가 진행됩니다.
                </div>
              )}
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
                    {/* 조 정보 배지와 토너먼트 스테이지 배지 */}
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
          )}
        </TabsContent>

        <TabsContent value="standings" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">순위표</h2>
            <div className="flex gap-2">
              <Button
                variant={
                  standingsSelectedTournament === 'all' ? 'primary' : 'outline'
                }
                size="sm"
                onClick={() => setStandingsSelectedTournament('all')}
              >
                전체
              </Button>
              <Button
                variant={
                  standingsSelectedTournament === 'group_stage'
                    ? 'primary'
                    : 'outline'
                }
                size="sm"
                onClick={() => setStandingsSelectedTournament('group_stage')}
              >
                조별리그
              </Button>
              <Button
                variant={
                  standingsSelectedTournament === 'championship'
                    ? 'primary'
                    : 'outline'
                }
                size="sm"
                onClick={() => setStandingsSelectedTournament('championship')}
              >
                우승 토너먼트
              </Button>
              <Button
                variant={
                  standingsSelectedTournament === 'relegation'
                    ? 'primary'
                    : 'outline'
                }
                size="sm"
                onClick={() => setStandingsSelectedTournament('relegation')}
              >
                멸망 토너먼트
              </Button>
            </div>
          </div>

          {standingsSelectedTournament === 'group_stage' && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button
                  variant={
                    standingsSelectedGroup === 'all' ? 'primary' : 'outline'
                  }
                  size="sm"
                  onClick={() => setStandingsSelectedGroup('all')}
                >
                  전체
                </Button>
                <Button
                  variant={
                    standingsSelectedGroup === 'A' ? 'primary' : 'outline'
                  }
                  size="sm"
                  onClick={() => setStandingsSelectedGroup('A')}
                >
                  A조
                </Button>
                <Button
                  variant={
                    standingsSelectedGroup === 'B' ? 'primary' : 'outline'
                  }
                  size="sm"
                  onClick={() => setStandingsSelectedGroup('B')}
                >
                  B조
                </Button>
              </div>
            </div>
          )}

          <GroupStandingsTable
            seasonId={21}
            tournamentStage={standingsSelectedTournament}
            groupStage={standingsSelectedGroup}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Season7GLeagueResults;
