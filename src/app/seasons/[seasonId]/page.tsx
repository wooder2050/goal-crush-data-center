'use client';

import { useMemo } from 'react';

import { useResolvedPathParams } from '@/common/path-params/client';
import { Section } from '@/components/ui';
import ChallengeResults from '@/features/matches/components/ChallengeResults';
import GLeagueTournamentResults from '@/features/matches/components/GLeagueTournamentResults';
import OtherLeagueResults from '@/features/matches/components/OtherLeagueResults';
import PlayoffResults from '@/features/matches/components/PlayoffResults';
import SbsCupResults from '@/features/matches/components/SbsCupResults';
import SuperResults from '@/features/matches/components/SuperResults';
import { getAllSeasonsPrisma } from '@/features/seasons/api-prisma';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import type { Season } from '@/lib/types';

const categoryToComponent = {
  G_LEAGUE: GLeagueTournamentResults,
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
      <Section padding="sm" className="pt-2 sm:pt-3">
        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse mb-4" />
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </Section>
    );
  }

  if (!matchedSeason || !matchedSeason.season_id) {
    return (
      <Section padding="sm" className="pt-2 sm:pt-3">
        <div className="text-center">
          <p className="text-lg text-gray-700">
            해당 시즌 페이지를 찾을 수 없습니다.
          </p>
        </div>
      </Section>
    );
  }

  const category = (matchedSeason.category ??
    'OTHER') as keyof typeof categoryToComponent;
  console.log(category);
  const Component = categoryToComponent[category] ?? OtherLeagueResults;

  return (
    <Section padding="sm" className="pt-2 sm:pt-3">
      <Component
        seasonId={matchedSeason.season_id}
        title={matchedSeason.season_name}
      />
    </Section>
  );
}
