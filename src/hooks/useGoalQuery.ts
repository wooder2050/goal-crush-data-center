/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from '@tanstack/react-query';

/**
 * Standard query hook
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
 * Suspense-enabled query hook
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

/**
 * Infinite query hook (returns fixed InfiniteData)
 */
export type UseGoalInfiniteQueryOptions<
  TQueryFn extends (...args: any[]) => Promise<any>,
  TPageParam,
> = Omit<
  UseInfiniteQueryOptions<
    Awaited<ReturnType<TQueryFn>>,
    Error,
    InfiniteData<Awaited<ReturnType<TQueryFn>>, TPageParam>,
    readonly unknown[],
    TPageParam
  >,
  'queryKey' | 'queryFn'
>;

export function useGoalInfiniteQuery<
  TQueryFn extends (...args: any[]) => Promise<any>,
  TPageParam,
>(
  apiFn: TQueryFn,
  getParams: (arg: { pageParam: TPageParam }) => Parameters<TQueryFn>,
  options: UseGoalInfiniteQueryOptions<TQueryFn, TPageParam>
): UseInfiniteQueryResult<
  InfiniteData<Awaited<ReturnType<TQueryFn>>, TPageParam>,
  Error
> {
  const typed = options as UseInfiniteQueryOptions<
    Awaited<ReturnType<TQueryFn>>,
    Error,
    InfiniteData<Awaited<ReturnType<TQueryFn>>, TPageParam>,
    readonly unknown[],
    TPageParam
  >;
  const { initialPageParam, getNextPageParam, ...rest } = typed;
  const paramsForKey = getParams({ pageParam: initialPageParam as TPageParam });
  const safeName =
    (typeof apiFn === 'function' && (apiFn as { name?: string }).name) ||
    'anonymous';
  const keyParams = JSON.stringify(paramsForKey);

  // Remove forbidden keys without introducing unused vars
  const sanitizedRestObj = { ...(rest as Record<string, unknown>) };
  delete (sanitizedRestObj as Record<string, unknown>).queryKey;
  delete (sanitizedRestObj as Record<string, unknown>).queryFn;

  return useInfiniteQuery<
    Awaited<ReturnType<TQueryFn>>,
    Error,
    InfiniteData<Awaited<ReturnType<TQueryFn>>, TPageParam>,
    readonly unknown[],
    TPageParam
  >({
    queryKey: [safeName, keyParams, 'infinite'],
    initialPageParam: initialPageParam as TPageParam,
    getNextPageParam: getNextPageParam as NonNullable<typeof getNextPageParam>,
    queryFn: ({ pageParam }) =>
      apiFn(
        ...(getParams({
          pageParam: pageParam as TPageParam,
        }) as Parameters<TQueryFn>)
      ),
    ...(sanitizedRestObj as Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<TQueryFn>>,
        Error,
        InfiniteData<Awaited<ReturnType<TQueryFn>>, TPageParam>,
        readonly unknown[],
        TPageParam
      >
    >),
  });
}
