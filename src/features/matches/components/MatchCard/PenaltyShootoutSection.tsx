'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MatchWithTeams } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPenaltyShootoutDetails } from '../../api';
import { hasPenaltyShootout } from '../../lib/matchUtils';

interface PenaltyShootoutSectionProps {
  match: MatchWithTeams;
  className?: string;
}

const PenaltyShootoutSection: React.FC<PenaltyShootoutSectionProps> = ({
  match,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 승부차기가 없는 경우 렌더링하지 않음
  if (!hasPenaltyShootout(match)) {
    return null;
  }

  // 승부차기 상세 기록을 React Query로 호출
  const {
    data: penaltyRecords = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['match', 'penalty', match.match_id],
    queryFn: () => getPenaltyShootoutDetails(match.match_id),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    enabled: hasPenaltyShootout(match), // 승부차기가 있을 때만 호출
  });

  const homeRecords = penaltyRecords.filter(
    (record: any) => record.team?.team_id === match.home_team_id
  );
  const awayRecords = penaltyRecords.filter(
    (record: any) => record.team?.team_id === match.away_team_id
  );

  // 성공률 계산
  const getSuccessRate = (records: any[]) => {
    const total = records.length;
    const success = records.filter((r: any) => r.is_successful).length;
    return `${success}/${total}`;
  };

  // 승자 결정
  const homeScore = match.penalty_home_score || 0;
  const awayScore = match.penalty_away_score || 0;
  const winner = homeScore > awayScore ? 'home' : 'away';

  return (
    <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-gray-700">
          🎯 승부차기 상세 기록
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? '숨기기' : '보기'}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="text-gray-500 text-sm">
                승부차기 기록을 불러오는 중...
              </div>
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="text-center py-4">
              <div className="text-red-500 text-sm">
                승부차기 기록을 불러올 수 없습니다:{' '}
                {error instanceof Error ? error.message : 'Unknown error'}
              </div>
            </div>
          )}

          {/* 데이터가 있을 때 */}
          {!isLoading && !error && penaltyRecords.length > 0 && (
            <>
              {/* 최종 결과 강조 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-800 mb-2">
                    🏆 승부차기 최종 결과
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div
                      className={`text-xl font-bold ${
                        winner === 'home' ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      {match.home_team?.team_name} {homeScore}
                    </div>
                    <div className="text-xl font-bold text-gray-400">:</div>
                    <div
                      className={`text-xl font-bold ${
                        winner === 'away' ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      {awayScore} {match.away_team?.team_name}
                    </div>
                  </div>
                  {winner && (
                    <div className="mt-2">
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        🏆{' '}
                        {winner === 'home'
                          ? match.home_team?.team_name
                          : match.away_team?.team_name}{' '}
                        승리
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* 상세 기록 */}
              <div className="grid grid-cols-2 gap-4">
                {/* Home Team Records */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-blue-800 mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      {match.home_team?.team_name}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-800"
                    >
                      {getSuccessRate(homeRecords)} 성공
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {homeRecords
                      .sort((a: any, b: any) => a.kicker_order - b.kicker_order)
                      .map((record: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white rounded p-2 border border-blue-100"
                        >
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0 bg-blue-600 text-white border-blue-600"
                            >
                              {record.kicker_order}
                            </Badge>
                            <span className="text-sm font-medium text-gray-900">
                              {record.kicker?.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              vs {record.goalkeeper?.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {record.is_successful ? (
                              <Badge className="text-xs bg-green-100 text-green-800 border-green-300">
                                ⚽ 성공
                              </Badge>
                            ) : (
                              <Badge className="text-xs bg-red-100 text-red-800 border-red-300">
                                ❌ 실패
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Away Team Records */}
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-red-800 mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                      {match.away_team?.team_name}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-red-100 text-red-800"
                    >
                      {getSuccessRate(awayRecords)} 성공
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {awayRecords
                      .sort((a: any, b: any) => a.kicker_order - b.kicker_order)
                      .map((record: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white rounded p-2 border border-red-100"
                        >
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0 bg-red-600 text-white border-red-600"
                            >
                              {record.kicker_order}
                            </Badge>
                            <span className="text-sm font-medium text-gray-900">
                              {record.kicker?.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              vs {record.goalkeeper?.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {record.is_successful ? (
                              <Badge className="text-xs bg-green-100 text-green-800 border-green-300">
                                ⚽ 성공
                              </Badge>
                            ) : (
                              <Badge className="text-xs bg-red-100 text-red-800 border-red-300">
                                ❌ 실패
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 데이터가 없을 때 */}
          {!isLoading && !error && penaltyRecords.length === 0 && (
            <div className="text-center py-4">
              <div className="text-gray-500 text-sm">
                승부차기 상세 기록이 없습니다.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PenaltyShootoutSection;
