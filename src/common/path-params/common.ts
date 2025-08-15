type DynamicSegment = {
  teamId: string;
  playerId: string;
  matchId: string;
  seasonId: string;
  coachId: string;
};
export type PathParamName = keyof DynamicSegment;

type Either<Data, Err> = [Data, undefined] | [undefined, Err];

const resolverMap = {
  teamId: (value) => {
    if (value === undefined) throw new Error("'teamId' not defined");
    return value;
  },
  playerId: (value) => {
    if (value === undefined) throw new Error("'playerId' not defined");
    return value;
  },
  matchId: (value) => {
    if (value === undefined) throw new Error("'matchId' not defined");
    return value;
  },
  seasonId: (value) => {
    if (value === undefined) throw new Error("'seasonId' not defined");
    return value;
  },
  coachId: (value) => {
    if (value === undefined) throw new Error("'coachId' not defined");
    return value;
  },
} satisfies {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in PathParamName]: (value: Partial<DynamicSegment>[K]) => string;
};
type ResolverMap = typeof resolverMap;

type ResolvedPathParams<T extends PathParamName[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? First extends PathParamName
    ? Rest extends PathParamName[]
      ? [ReturnType<ResolverMap[First]>, ...ResolvedPathParams<Rest>]
      : never
    : never
  : [];

export function resolvePathParams<T extends PathParamName[]>(
  pathParams: Record<string, unknown>,
  ...pathParamNameList: T
): Either<ResolvedPathParams<T>, Error> {
  const ret: unknown[] = [];
  for (const paramName of pathParamNameList) {
    const targetValue = pathParams[paramName];
    if (targetValue === undefined)
      return [
        undefined,
        new Error(`path param object does not have '${paramName}' field.`),
      ];
    try {
      ret.push(resolverMap[paramName](targetValue as string));
    } catch (err) {
      return [undefined, err as Error];
    }
  }
  return [ret as ResolvedPathParams<T>, undefined];
}
