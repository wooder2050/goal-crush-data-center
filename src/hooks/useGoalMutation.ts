'use client';

import {
  MutateOptions,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';

/**
 * 에러 처리를 위한 기본 핸들러
 */
const fallbackErrorHandler = (err: Error) => {
  // 프로젝트에 맞는 토스트 알림 사용
  console.error('Mutation error:', err);
};

/**
 * 기본 GoalMutation 훅
 *
 * @param mutationFn - 실행할 mutation 함수
 * @param options - mutation 옵션
 */
export function useGoalMutation<
  TData = unknown,
  TError extends Error = Error,
  TVariables = void,
  TContext = unknown,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  >
): UseMutationResult<TData, TError, TVariables, TContext> {
  const isErrorHandled = useRef(false);
  const { onError } = options ?? {};

  const mutation = useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    ...options,
    onError: async (err, variables, context) => {
      if (onError) {
        const result = await onError(err, variables, context);
        isErrorHandled.current = Boolean(result);
      }
    },
  });

  const { mutate, mutateAsync } = mutation;

  // 에러 핸들링이 포함된 mutate 함수
  const mutatePatched = useCallback(
    (
      variables: TVariables,
      opts?: MutateOptions<TData, TError, TVariables, TContext>
    ) => {
      const { onError: onErrorOpt } = opts ?? {};
      return mutate(variables, {
        ...opts,
        onError: async (err, vars, ctx) => {
          let handled = false;
          if (onErrorOpt) {
            const result = await onErrorOpt(err, vars, ctx);
            handled = Boolean(result);
          }

          if (!handled && !isErrorHandled.current) {
            fallbackErrorHandler(err);
          }
          isErrorHandled.current = false; // 기본값으로 리셋
        },
      });
    },
    [mutate]
  );

  // 에러 핸들링이 포함된 mutateAsync 함수
  const mutateAsyncPatched = useCallback(
    (
      variables: TVariables,
      opts?: MutateOptions<TData, TError, TVariables, TContext>
    ) => {
      const { onError: onErrorOpt } = opts ?? {};
      return mutateAsync(variables, {
        ...opts,
        onError: async (err, vars, ctx) => {
          let handled = false;
          if (onErrorOpt) {
            const result = await onErrorOpt(err, vars, ctx);
            handled = Boolean(result);
          }

          if (!handled && !isErrorHandled.current) {
            fallbackErrorHandler(err);
          }
          isErrorHandled.current = false; // 기본값으로 리셋
        },
      });
    },
    [mutateAsync]
  );

  const mutationPatched = useMemo(
    () => ({
      ...mutation,
      mutate: mutatePatched,
      mutateAsync: mutateAsyncPatched,
    }),
    [mutation, mutatePatched, mutateAsyncPatched]
  );

  return mutationPatched;
}

// 낙관적 업데이트 컨텍스트 타입 (내부 참조용)
// type OptimisticContextType = Record<string, unknown> & {
//   previousData?: unknown;
// }

/**
 * 낙관적 업데이트를 지원하는 mutation 훅
 *
 * @param mutationFn - 실행할 mutation 함수
 * @param queryKey - 낙관적 업데이트할 쿼리 키
 * @param updateFn - 낙관적 업데이트를 위한 함수
 * @param options - mutation 옵션
 */
export function useGoalOptimisticMutation<
  TData = unknown,
  TError extends Error = Error,
  TVariables = void,
  TQueryData = unknown,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  queryKey: unknown[],
  updateFn: (
    oldData: TQueryData | undefined,
    variables: TVariables
  ) => TQueryData,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, Record<string, unknown>>,
    'mutationFn'
  >
): UseMutationResult<TData, TError, TVariables, Record<string, unknown>> {
  const queryClient = useQueryClient();

  return useGoalMutation<TData, TError, TVariables, Record<string, unknown>>(
    mutationFn,
    {
      ...options,
      onMutate: async (variables) => {
        // 사용자 콜백 호출
        let context: Record<string, unknown> = {};
        if (options?.onMutate) {
          const result = await options.onMutate(variables);
          if (result && typeof result === 'object') {
            context = result as Record<string, unknown>;
          }
        }

        // 진행 중인 쿼리 취소
        await queryClient.cancelQueries({ queryKey });

        // 이전 데이터 저장
        const previousData = queryClient.getQueryData<TQueryData>(queryKey);

        // 낙관적 업데이트
        if (previousData !== undefined) {
          queryClient.setQueryData(queryKey, updateFn(previousData, variables));
        }

        // 컨텍스트 반환
        return {
          ...context,
          previousData,
        };
      },
      onError: (err, variables, context) => {
        // 오류 발생 시 이전 데이터로 복원
        if (
          context &&
          typeof context === 'object' &&
          'previousData' in context
        ) {
          const previousData = context.previousData as TQueryData | undefined;
          if (previousData !== undefined) {
            queryClient.setQueryData(queryKey, previousData);
          }
        }

        // 사용자 콜백 호출
        if (options?.onError) {
          return options.onError(err, variables, context);
        }
        return undefined;
      },
      onSettled: (data, error, variables, context) => {
        // 쿼리 무효화
        queryClient.invalidateQueries({ queryKey });

        // 사용자 콜백 호출
        if (options?.onSettled) {
          return options.onSettled(data, error, variables, context);
        }
        return undefined;
      },
    }
  );
}

// 다중 낙관적 업데이트 컨텍스트 타입 (내부 참조용)
// type MultiOptimisticContextType = Record<string, unknown> & {
//   previousDataMap?: Map<string, unknown>;
// }

/**
 * 여러 쿼리에 대한 낙관적 업데이트를 지원하는 mutation 훅
 *
 * @param mutationFn - 실행할 mutation 함수
 * @param optimisticQueries - 낙관적 업데이트할 쿼리 정보 배열
 * @param options - mutation 옵션
 */
export function useGoalMultiOptimisticMutation<
  TData = unknown,
  TError extends Error = Error,
  TVariables = void,
  TQueryData = unknown,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  optimisticQueries: Array<{
    queryKey: unknown[];
    updateFn: (
      oldData: TQueryData | undefined,
      variables: TVariables
    ) => TQueryData;
  }>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, Record<string, unknown>>,
    'mutationFn'
  >
): UseMutationResult<TData, TError, TVariables, Record<string, unknown>> {
  const queryClient = useQueryClient();

  return useGoalMutation<TData, TError, TVariables, Record<string, unknown>>(
    mutationFn,
    {
      ...options,
      onMutate: async (variables) => {
        // 사용자 콜백 호출
        let context: Record<string, unknown> = {};
        if (options?.onMutate) {
          const result = await options.onMutate(variables);
          if (result && typeof result === 'object') {
            context = result as Record<string, unknown>;
          }
        }

        // 모든 쿼리 취소
        await Promise.all(
          optimisticQueries.map(({ queryKey }) =>
            queryClient.cancelQueries({ queryKey })
          )
        );

        // 이전 데이터 저장 및 낙관적 업데이트 적용
        const previousDataMap = new Map<string, TQueryData | undefined>();

        optimisticQueries.forEach(({ queryKey, updateFn }) => {
          const queryKeyStr = JSON.stringify(queryKey);
          const previousData = queryClient.getQueryData<TQueryData>(queryKey);
          previousDataMap.set(queryKeyStr, previousData);

          if (previousData !== undefined) {
            queryClient.setQueryData(
              queryKey,
              updateFn(previousData, variables)
            );
          }
        });

        // 컨텍스트 반환
        return {
          ...context,
          previousDataMap,
        };
      },
      onError: (err, variables, context) => {
        // 오류 발생 시 이전 데이터로 복원
        if (
          context &&
          typeof context === 'object' &&
          'previousDataMap' in context
        ) {
          const previousDataMap = context.previousDataMap as Map<
            string,
            TQueryData | undefined
          >;

          optimisticQueries.forEach(({ queryKey }) => {
            const queryKeyStr = JSON.stringify(queryKey);
            const previousData = previousDataMap.get(queryKeyStr);

            if (previousData !== undefined) {
              queryClient.setQueryData(queryKey, previousData);
            }
          });
        }

        // 사용자 콜백 호출
        if (options?.onError) {
          return options.onError(err, variables, context);
        }
        return undefined;
      },
      onSettled: (data, error, variables, context) => {
        // 모든 쿼리 무효화
        optimisticQueries.forEach(({ queryKey }) => {
          queryClient.invalidateQueries({ queryKey });
        });

        // 사용자 콜백 호출
        if (options?.onSettled) {
          return options.onSettled(data, error, variables, context);
        }
        return undefined;
      },
    }
  );
}
