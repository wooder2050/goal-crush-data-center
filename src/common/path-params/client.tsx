'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { PathParamName, resolvePathParams } from './common';

export function useResolvedPathParams<T extends PathParamName[]>(
  ...pathParamNameList: T
) {
  const params = useParams();
  return useMemo(() => {
    const [data, err] = resolvePathParams(params, ...pathParamNameList);
    if (err) {
      console.debug(
        'Failed to resolve',
        JSON.stringify(params),
        'as',
        JSON.stringify(pathParamNameList),
        'from',
        typeof window === 'undefined' ? 'server-side' : window.location.href
      );
      throw err;
    }
    return data;
  }, [params, pathParamNameList]);
}
