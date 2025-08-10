'use client';

import { useMemo } from 'react';

import { useResolvedPathParams } from '@/common/path-params/client';
import ChallengeResults from '@/features/matches/components/ChallengeResults';
import GLeagueResults from '@/features/matches/components/GLeagueResults';
import OtherLeagueResults from '@/features/matches/components/OtherLeagueResults';
import PlayoffResults from '@/features/matches/components/PlayoffResults';
import SbsCupResults from '@/features/matches/components/SbsCupResults';
import SuperResults from '@/features/matches/components/SuperResults';
import { getAllSeasonsPrisma } from '@/features/seasons/api-prisma';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import type { Season } from '@/lib/types';

const categoryToComponent = {
  G_LEAGUE: GLeagueResults,
  SUPER_LEAGUE: SuperResults,
  CHALLENGE_LEAGUE: ChallengeResults,
  PLAYOFF: PlayoffResults,
  SBS_CUP: SbsCupResults,
  OTHER: OtherLeagueResults,
} as const;

export default function SeasonDynamicPage() {
  const [seasonIdStr] = useResolvedPathParams('seasonId');
  const idNum = Number(seasonIdStr);
  const resolvedId = Number.isFinite(idNum) ? idNum : null;

  const { data: seasons = [], isLoading } = useGoalQuery(
    getAllSeasonsPrisma,
    []
  );

  const matchedSeason: Season | undefined = useMemo(() => {
    return seasons.find((s) => s.season_id === resolvedId);
  }, [seasons, resolvedId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="h-6 w-40 rounded bg-gray-200 animate-pulse mb-4" />
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!matchedSeason || !matchedSeason.season_id) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <p className="text-lg text-gray-700">
            해당 시즌 페이지를 찾을 수 없습니다.
          </p>
        </div>
      </main>
    );
  }

  const category = (matchedSeason.category ??
    'OTHER') as keyof typeof categoryToComponent;
  const Component = categoryToComponent[category] ?? OtherLeagueResults;

  return (
    <main className="min-h-screen bg-white">
      <Component
        seasonId={matchedSeason.season_id}
        title={matchedSeason.season_name}
      />
    </main>
  );
}
