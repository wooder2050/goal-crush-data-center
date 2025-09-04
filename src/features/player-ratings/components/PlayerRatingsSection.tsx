'use client';

import { TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/components/AuthProvider';
import { LoginModal } from '@/components/LoginModal';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import {
  createRatingReview,
  getPlayerRatings,
} from '@/features/player-ratings/api';
import { useGoalMutation } from '@/hooks/useGoalMutation';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { PlayerAbilityRadar } from './PlayerAbilityRadar';
import { PlayerRatingCard } from './PlayerRatingCard';

interface PlayerRatingsSectionProps {
  playerId: number;
  seasonId?: number;
  onRatePlayer?: () => void;
}

export function PlayerRatingsSection({
  playerId,
  seasonId,
  onRatePlayer,
}: PlayerRatingsSectionProps) {
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  // 선수 능력치 데이터 조회
  const { data, isLoading, error, refetch } = useGoalQuery(getPlayerRatings, [
    { playerId, seasonId, includeReviews: true },
  ]);

  // 리뷰 제출 Mutation
  const reviewMutation = useGoalMutation(createRatingReview, {
    onSuccess: () => {
      // 데이터 새로고침
      refetch();
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
      alert(error.message || '리뷰 제출에 실패했습니다.');
    },
  });

  const handleReview = (
    ratingId: number,
    reviewType: 'helpful' | 'not_helpful' | 'comment',
    comment?: string
  ) => {
    reviewMutation.mutate({ ratingId, reviewType, comment });
  };

  // 평가하기 버튼 클릭 핸들러
  const handleRatePlayerClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    onRatePlayer?.();
  };
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">
                능력치 데이터를 불러오고 있습니다...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-2">에러 발생</p>
          <p className="text-gray-600 mb-4">
            {error.message || '능력치 데이터를 불러올 수 없습니다.'}
          </p>
          <Button onClick={() => refetch()}>다시 시도</Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 mb-4">
            능력치 데이터를 불러올 수 없습니다.
          </p>
          <Button onClick={() => refetch()}>다시 시도</Button>
        </CardContent>
      </Card>
    );
  }

  // 데이터가 있지만 비어 있는 경우 처리
  if (
    data &&
    !data.aggregate &&
    (!data.user_ratings || data.user_ratings.length === 0) &&
    (!data.top_ratings || data.top_ratings.length === 0)
  ) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <p className="text-lg font-semibold mb-2">{data.player.name}</p>
            <p className="text-gray-600 mb-4">
              아직 이 선수에 대한 능력치 평가가 없습니다.
            </p>
            {onRatePlayer && (
              <Button onClick={handleRatePlayerClick} className="mb-2">
                첫 번째 평가자가 되어보세요!
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            평가 데이터가 없어 기본 화면을 보여드립니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasRatings =
    data.user_ratings.length > 0 || data.top_ratings.length > 0;

  return (
    <div className="space-y-6">
      {/* 평가 요약 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {data.player.name} 능력치 평가
            </CardTitle>

            {onRatePlayer && (
              <Button
                onClick={handleRatePlayerClick}
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                평가하기
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {data.aggregate ? (
            <div className="grid gap-6 md:grid-cols-2">
              <PlayerAbilityRadar aggregate={data.aggregate} />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />총 {data.aggregate.total_ratings}
                  명이 평가
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">전체 평점</span>
                    <span className="font-semibold">
                      {Math.round(data.aggregate.avg_overall_rating || 50)}/99
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm">공격 평점</span>
                    <span className="font-semibold text-red-600">
                      {Math.round(
                        ((data.aggregate.avg_finishing || 50) +
                          (data.aggregate.avg_shot_power || 50)) /
                          2
                      )}
                      /99
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm">수비 평점</span>
                    <span className="font-semibold text-yellow-600">
                      {Math.round(
                        ((data.aggregate.avg_marking || 50) +
                          (data.aggregate.avg_tackling || 50)) /
                          2
                      )}
                      /99
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm">피지컬 평점</span>
                    <span className="font-semibold text-purple-600">
                      {Math.round(
                        ((data.aggregate.avg_speed || 50) +
                          (data.aggregate.avg_strength || 50)) /
                          2
                      )}
                      /99
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                아직 이 선수에 대한 평가가 없습니다.
              </p>
              {onRatePlayer && (
                <Button onClick={handleRatePlayerClick}>
                  첫 번째 평가자가 되어보세요!
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 평가 목록 */}
      {hasRatings && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>사용자 평가</CardTitle>

              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'popular' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('popular')}
                >
                  인기순
                </Button>
                <Button
                  variant={activeTab === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('recent')}
                >
                  최신순
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {activeTab === 'popular' ? (
                data.top_ratings.length > 0 ? (
                  data.top_ratings.map((rating) => (
                    <PlayerRatingCard
                      key={rating.rating_id}
                      rating={rating}
                      onReview={handleReview}
                      isReviewLoading={reviewMutation.isPending}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    인기 평가가 없습니다.
                  </div>
                )
              ) : data.user_ratings.length > 0 ? (
                data.user_ratings.map((rating) => (
                  <PlayerRatingCard
                    key={rating.rating_id}
                    rating={rating}
                    onReview={handleReview}
                    isReviewLoading={reviewMutation.isPending}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-600">
                  사용자 평가가 없습니다.
                </div>
              )}
            </div>

            {/* 더 보기 버튼 (향후 페이지네이션 구현시 사용) */}
            <div className="text-center mt-6">
              <Button variant="outline">평가 더 보기</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 로그인 모달 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          // 로그인 성공 후 평가 페이지로 이동
          onRatePlayer?.();
        }}
        redirectUrl={`/players/${playerId}/rate`}
      />
    </div>
  );
}
