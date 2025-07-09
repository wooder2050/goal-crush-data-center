/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from '@tanstack/react-query';

/**
 * 일반 쿼리 훅
 */
export function useGoalQuery<
  TQueryFn extends (...args: any[]) => Promise<any>,
  TParams extends Parameters<TQueryFn>,
  TData = Awaited<ReturnType<TQueryFn>>,
>(
  apiFn: TQueryFn,
  params: TParams,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<TData, Error> {
  return useQuery<TData, Error, TData, QueryKey>({
    queryKey: [apiFn.name, ...params],
    queryFn: () => apiFn(...params),
    ...options,
  });
}

/**
 * Suspense 쿼리 훅
 */
export function useGoalSuspenseQuery<
  TQueryFn extends (...args: any[]) => Promise<any>,
  TParams extends Parameters<TQueryFn>,
  TData = Awaited<ReturnType<TQueryFn>>,
>(
  apiFn: TQueryFn,
  params: TParams,
  options?: Omit<
    UseSuspenseQueryOptions<TData, Error, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >
): UseSuspenseQueryResult<TData, Error> {
  return useSuspenseQuery<TData, Error, TData, QueryKey>({
    queryKey: [apiFn.name, ...params],
    queryFn: () => apiFn(...params),
    ...options,
  });
}
