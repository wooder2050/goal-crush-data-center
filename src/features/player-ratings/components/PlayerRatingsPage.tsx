'use client';

import { MessageCircle, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

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
import type { PlayerAbilityRating } from '@/features/player-ratings/types';
import { useGoalMutation } from '@/hooks/useGoalMutation';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

import { PlayerAbilityRadar } from './PlayerAbilityRadar';
import { PlayerRatingCard } from './PlayerRatingCard';

interface PlayerRatingsPageProps {
  playerId: number;
  seasonId?: number;
}

export function PlayerRatingsPage({
  playerId,
  seasonId,
}: PlayerRatingsPageProps) {
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const ratingsPerPage = 5;

  // 선수 능력치 데이터 조회
  const { data, refetch } = useGoalSuspenseQuery(getPlayerRatings, [
    {
      playerId,
      seasonId,
      includeReviews: true,
      topRatingsLimit: 20, // 더 많은 평가 표시
      userRatingsLimit: 20,
    },
  ]);

  // 리뷰 제출 Mutation
  const reviewMutation = useGoalMutation(createRatingReview, {
    onSuccess: () => {
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

  const handleRatePlayer = () => {
    window.location.href = `/players/${playerId}/rate`;
  };

  // 평가가 없는 경우
  if (
    !data?.aggregate &&
    (!data?.user_ratings || data.user_ratings.length === 0) &&
    (!data?.top_ratings || data.top_ratings.length === 0)
  ) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{data.player.name}</h2>
              <p className="text-gray-600 mb-6">
                아직 이 선수에 대한 평가가 없습니다.
                <br />첫 번째 평가자가 되어 다른 팬들과 의견을 나눠보세요!
              </p>
              <Button
                onClick={handleRatePlayer}
                size="lg"
                className="gap-2"
                disabled={data.has_user_rated}
                variant={data.has_user_rated ? 'outline' : 'default'}
              >
                <TrendingUp className="w-5 h-5" />
                {data.has_user_rated ? '평가 완료' : '첫 번째 평가 작성하기'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 모든 평가를 통합하고 중복 제거
  const ratingsMap = new Map<number, PlayerAbilityRating>();
  data.user_ratings.forEach((r) => ratingsMap.set(r.rating_id, r));
  data.top_ratings.forEach((r) => ratingsMap.set(r.rating_id, r));
  const allUniqueRatings = Array.from(ratingsMap.values());

  const hasRatings = allUniqueRatings.length > 0;

  // 탭에 따른 정렬 적용
  const sortedRatings = [...allUniqueRatings].sort((a, b) => {
    if (activeTab === 'popular') {
      // 인기순: 도움됨 수 -> 총 리뷰 수 -> 평점 -> 최신순
      if ((a.helpful_count || 0) !== (b.helpful_count || 0)) {
        return (b.helpful_count || 0) - (a.helpful_count || 0);
      }
      if ((a.total_reviews || 0) !== (b.total_reviews || 0)) {
        return (b.total_reviews || 0) - (a.total_reviews || 0);
      }
      if ((a.overall_rating || 50) !== (b.overall_rating || 50)) {
        return (b.overall_rating || 50) - (a.overall_rating || 50);
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      // 최신순
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  });

  // 페이지네이션 적용
  const totalPages = Math.ceil(sortedRatings.length / ratingsPerPage);
  const startIndex = (currentPage - 1) * ratingsPerPage;
  const paginatedRatings = sortedRatings.slice(
    startIndex,
    startIndex + ratingsPerPage
  );

  // 탭 변경 시 페이지 초기화
  const handleTabChange = (tab: 'popular' | 'recent') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 선수 능력치 요약 */}
      {data.aggregate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {data.player.name} 종합 평가
              </CardTitle>

              <Button
                onClick={handleRatePlayer}
                className="gap-2"
                disabled={data.has_user_rated}
                variant={data.has_user_rated ? 'outline' : 'default'}
              >
                <TrendingUp className="w-4 h-4" />
                {data.has_user_rated ? '평가 완료' : '평가 작성하기'}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* 레이더 차트 */}
              <div className="md:col-span-2">
                <PlayerAbilityRadar aggregate={data.aggregate} />
              </div>

              {/* 전체 통계 */}
              <div className="space-y-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {Math.round(data.aggregate.avg_overall_rating || 50)}
                  </div>
                  <div className="text-sm text-gray-600">전체 평점 / 99</div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <Users className="w-4 h-4" />
                  {data.aggregate.total_ratings}명이 평가
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>공격 평점</span>
                    <span className="font-semibold text-red-600">
                      {Math.round(
                        ((data.aggregate.avg_finishing || 50) +
                          (data.aggregate.avg_shot_power || 50)) /
                          2
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>패스 평점</span>
                    <span className="font-semibold text-green-600">
                      {Math.round(
                        ((data.aggregate.avg_short_passing || 50) +
                          (data.aggregate.avg_long_passing || 50)) /
                          2
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>수비 평점</span>
                    <span className="font-semibold text-blue-600">
                      {Math.round(
                        ((data.aggregate.avg_marking || 50) +
                          (data.aggregate.avg_tackling || 50)) /
                          2
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>피지컬 평점</span>
                    <span className="font-semibold text-purple-600">
                      {Math.round(
                        ((data.aggregate.avg_speed || 50) +
                          (data.aggregate.avg_strength || 50)) /
                          2
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 평가 목록 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              팬들의 평가 (
              {(data.user_ratings?.length || 0) +
                (data.top_ratings?.length || 0)}
              개)
            </CardTitle>

            <div className="flex flex-wrap gap-2">
              {/* 탭 선택 */}
              <div className="flex gap-1">
                <Button
                  variant={activeTab === 'popular' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTabChange('popular')}
                >
                  인기 평가 (
                  {
                    allUniqueRatings.filter(
                      (r) =>
                        (r.helpful_count || 0) > 0 || (r.total_reviews || 0) > 0
                    ).length
                  }
                  )
                </Button>
                <Button
                  variant={activeTab === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTabChange('recent')}
                >
                  최신 평가 ({allUniqueRatings.length})
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {hasRatings ? (
            <div className="space-y-6">
              {/* 현재 페이지 정보 */}
              <div className="flex items-center justify-between text-sm text-gray-600 px-1">
                <p>
                  총 {sortedRatings.length}개 평가 중 {startIndex + 1}-
                  {Math.min(startIndex + ratingsPerPage, sortedRatings.length)}
                  번째 표시
                </p>
                {totalPages > 1 && (
                  <p className="text-xs">
                    {currentPage} / {totalPages} 페이지
                  </p>
                )}
              </div>

              {/* 평가 카드들 */}
              {paginatedRatings.map((rating) => (
                <PlayerRatingCard
                  key={rating.rating_id}
                  rating={rating}
                  onReview={handleReview}
                  isReviewLoading={reviewMutation.isPending}
                  showReviews={true}
                  showDetailedStats={true} // 상세 능력치 표시
                />
              ))}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="text-xs"
                  >
                    처음
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-xs"
                  >
                    이전
                  </Button>

                  {/* 페이지 번호들 */}
                  <div className="flex gap-1">
                    {(() => {
                      const maxPageButtons = 5;
                      const startPage = Math.max(
                        1,
                        currentPage - Math.floor(maxPageButtons / 2)
                      );
                      const endPage = Math.min(
                        totalPages,
                        startPage + maxPageButtons - 1
                      );
                      const adjustedStartPage = Math.max(
                        1,
                        endPage - maxPageButtons + 1
                      );

                      return Array.from(
                        { length: endPage - adjustedStartPage + 1 },
                        (_, i) => adjustedStartPage + i
                      ).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0 text-xs"
                        >
                          {page}
                        </Button>
                      ));
                    })()}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-xs"
                  >
                    다음
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="text-xs"
                  >
                    마지막
                  </Button>
                </div>
              )}

              {paginatedRatings.length === 0 && sortedRatings.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    이 페이지에 표시할 평가가 없습니다.
                  </p>
                  <Button variant="outline" onClick={() => setCurrentPage(1)}>
                    첫 페이지로 이동
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">평가가 없습니다</h3>
              <p className="text-gray-600 mb-6">
                이 선수에 대한 첫 번째 평가를 작성해보세요!
              </p>
              <Button
                onClick={handleRatePlayer}
                size="lg"
                className="gap-2"
                disabled={data.has_user_rated}
                variant={data.has_user_rated ? 'outline' : 'default'}
              >
                <TrendingUp className="w-5 h-5" />
                {data.has_user_rated ? '평가 완료' : '평가 작성하기'}
              </Button>
            </div>
          )}

          {/* 무한 스크롤 또는 페이지네이션 (향후 구현) */}
          {hasRatings && sortedRatings.length >= 10 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                평가 더 보기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
