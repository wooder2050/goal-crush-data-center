/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

/**
 * 타입이 명확한 쿼리 훅
 *
 * 기존 useGoalQuery와 동일하지만 TData 타입을 명시적으로 지정하여
 * 타입스크립트 추론 문제를 해결합니다.
 */
export function useGoalQueryTyped<
  TData,
  TQueryFn extends (...args: any[]) => Promise<any>,
  TParams extends Parameters<TQueryFn>,
>(
  apiFn: TQueryFn,
  params: TParams,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<TData, Error> {
  const customKey = (apiFn as any)?.queryKey as string | undefined;
  const safeName =
    customKey ||
    (typeof apiFn === 'function' && (apiFn as { name?: string }).name) ||
    'anonymous';

  return useQuery<TData, Error, TData, QueryKey>({
    queryKey: [safeName, JSON.stringify(params)],
    queryFn: () => apiFn(...params) as Promise<TData>,
    ...options,
  });
}
