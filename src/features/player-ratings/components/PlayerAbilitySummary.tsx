'use client';

import { TrendingUp, Users } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { getPlayerRatings } from '@/features/player-ratings/api';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

import { PlayerAbilityRadar } from './PlayerAbilityRadar';

interface PlayerAbilitySummaryProps {
  playerId: number;
  seasonId?: number;
  onRatePlayer?: () => void;
  onViewAllRatings?: () => void;
}

export function PlayerAbilitySummary({
  playerId,
  seasonId,
  onRatePlayer,
  onViewAllRatings,
}: PlayerAbilitySummaryProps) {
  const { data } = useGoalSuspenseQuery(getPlayerRatings, [
    {
      playerId,
      seasonId,
      includeReviews: false,
      topRatingsLimit: 3,
      userRatingsLimit: 0,
    },
  ]);

  if (!data?.aggregate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {data.player.name} 능력치 평가
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              아직 이 선수에 대한 평가가 없습니다.
            </p>
            <div className="space-y-2">
              {onRatePlayer && (
                <Button
                  onClick={onRatePlayer}
                  className="mr-2"
                  disabled={data.has_user_rated}
                >
                  {data.has_user_rated
                    ? '이미 평가했습니다'
                    : '첫 번째 평가자가 되어보세요!'}
                </Button>
              )}
              {onViewAllRatings && (
                <Button variant="outline" onClick={onViewAllRatings}>
                  평가 페이지 보기
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {data.player.name} 능력치 평가
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-2">
            {onRatePlayer && (
              <Button
                onClick={onRatePlayer}
                size="sm"
                disabled={data.has_user_rated}
                variant={data.has_user_rated ? 'outline' : 'default'}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {data.has_user_rated ? '평가 완료' : '평가하기'}
              </Button>
            )}
            {onViewAllRatings && (
              <Button
                variant="outline"
                onClick={onViewAllRatings}
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                모든 평가 보기
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* 평가 기본 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              {data.aggregate.total_ratings}명이 평가
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {Math.round(data.aggregate.avg_overall_rating || 50)}
                <span className="text-sm text-gray-500 font-normal">/99</span>
              </div>
              <p className="text-xs text-gray-500">전체 평점</p>
            </div>
          </div>

          {/* 레이더 차트만 표시 */}
          <div>
            <PlayerAbilityRadar
              aggregate={data.aggregate}
              title="평균 능력치"
            />
          </div>

          {/* 최근 평가 미리보기 */}
          {data.top_ratings.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">
                최근 평가 미리보기
              </p>
              <div className="space-y-2">
                {data.top_ratings.slice(0, 2).map((rating) => (
                  <div
                    key={rating.rating_id}
                    className="p-2 bg-gray-50 rounded text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {rating.user?.korean_nickname}
                      </span>
                      <span className="font-medium">
                        {Math.round(rating.overall_rating || 50)}/99
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-500 mt-1 truncate">
                        &ldquo;{rating.comment}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
                {data.top_ratings.length > 2 && (
                  <div className="text-xs text-gray-400 text-center pt-2">
                    +{data.top_ratings.length - 2}개 더 있습니다
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
