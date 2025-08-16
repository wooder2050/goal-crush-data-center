'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { ScrollTrigger } from '@/common/ScrollTrigger';
import {
  type CoachesPageItem,
  getCoachesPagePrisma,
} from '@/features/coaches/api-prisma';
import { useGoalInfiniteQuery } from '@/hooks/useGoalQuery';

import CoachCard from './CoachCard';
import CoachCardSkeleton from './CoachCardSkeleton';

export default function CoachInfiniteList({
  onTotalChange,
}: {
  onTotalChange?: (n: number) => void;
}) {
  const PAGE_SIZE = 6;
  const [order, setOrder] = useState<'total' | 'wins' | 'win_rate' | undefined>(
    'total'
  );
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGoalInfiniteQuery<typeof getCoachesPagePrisma, number>(
    getCoachesPagePrisma,
    ({ pageParam }) => [pageParam, PAGE_SIZE, { order }],
    { initialPageParam: 1, getNextPageParam: (last) => last.nextPage }
  );

  const typedData = infiniteData;
  const allItems: CoachesPageItem[] = useMemo(
    () => (infiniteData?.pages ?? []).flatMap((p) => p.items),
    [infiniteData]
  );
  const isLoading =
    status === 'pending' && (typedData?.pages?.length ?? 0) === 0;
  const [prevItems, setPrevItems] = useState<CoachesPageItem[]>([]);
  useEffect(() => {
    if (isLoading) return;
    if (allItems.length > 0) {
      setPrevItems((prev) => (prev !== allItems ? allItems : prev));
    }
  }, [isLoading, allItems]);
  const totalCount = typedData?.pages?.[0]?.totalCount ?? allItems.length;

  useEffect(() => {
    if (typeof onTotalChange === 'function') onTotalChange(totalCount);
  }, [onTotalChange, totalCount]);

  // 최초 로딩일 때만 전체 스켈레톤 노출
  const showInitialSkeleton = isLoading && prevItems.length === 0;
  // 정렬(필터) 변경 등으로 재요청 중인 상태에서는 카드 영역만 스켈레톤 노출
  const isRefetching = isLoading && prevItems.length > 0;
  const showFillers = hasNextPage || isFetchingNextPage;
  const canFetchNext = hasNextPage && !isFetchingNextPage && !isLoading;
  const handleFetchNext = useCallback(() => {
    if (!canFetchNext) return;
    void fetchNextPage();
  }, [canFetchNext, fetchNextPage]);

  if (showInitialSkeleton) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="mt-2 h-4 w-64 rounded bg-gray-200 animate-pulse" />
        </div>

        {/* Filters skeleton */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="h-8 w-28 rounded-full bg-gray-200 animate-pulse" />
          <span className="h-8 w-28 rounded-full bg-gray-200 animate-pulse" />
          <span className="h-8 w-32 rounded-full bg-gray-200 animate-pulse" />
        </div>
        {/* Cards skeleton: 동일한 그리드 레이아웃으로 고정 폭 유지 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CoachCardSkeleton key={`init-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">감독 목록</h1>
        <p className="text-gray-600">
          모든 감독의 정보와 팀 이력을 확인할 수 있습니다.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FilterButtons order={order} setOrder={setOrder} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isRefetching
          ? Array.from({ length: 6 }).map((_, i) => (
              <CoachCardSkeleton key={`ref-${i}`} />
            ))
          : (allItems.length > 0 ? allItems : prevItems).map((coach) => (
              <GoalWrapper
                key={coach.coach_id}
                fallback={<CoachCardSkeleton />}
              >
                <CoachCard coach={coach} />
              </GoalWrapper>
            ))}
        {!isRefetching && showFillers && (
          <>
            {/* Mobile fillers: 1개 */}
            <div className="contents sm:hidden">
              {Array.from({ length: 1 }).map((_, i) => (
                <CoachCardSkeleton key={`mf-${i}`} />
              ))}
            </div>
            {/* Small screens fillers: 2개 (>= sm, < md) */}
            <div className="hidden sm:contents md:hidden">
              {Array.from({ length: 2 }).map((_, i) => (
                <CoachCardSkeleton key={`sf-${i}`} />
              ))}
            </div>
            {/* Medium and up fillers: 3개 (>= md) */}
            <div className="hidden md:contents">
              {Array.from({ length: 3 }).map((_, i) => (
                <CoachCardSkeleton key={`df-${i}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {allItems.length > 0 && hasNextPage && (
        <ScrollTrigger updateOptions={handleFetchNext} />
      )}

      {isFetchingNextPage && (
        <div className="mt-6 flex items-center justify-center">
          <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
            aria-label="로딩 중"
          />
        </div>
      )}
    </div>
  );
}

function FilterButtons({
  order,
  setOrder,
}: {
  order: 'total' | 'wins' | 'win_rate' | undefined;
  setOrder: React.Dispatch<
    React.SetStateAction<'total' | 'wins' | 'win_rate' | undefined>
  >;
}) {
  const btn = (key: 'total' | 'wins' | 'win_rate', label: string) => (
    <button
      type="button"
      onClick={() => setOrder((prev) => (prev === key ? undefined : key))}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        order === key
          ? 'border-black bg-black text-white'
          : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-100'
      }`}
      aria-pressed={order === key}
    >
      {label}
    </button>
  );
  return (
    <div className="flex flex-wrap items-center gap-2">
      {btn('total', '경기 많은 순')}
      {btn('wins', '승리 많은 순')}
      {btn('win_rate', '승률 높은 순')}
    </div>
  );
}
