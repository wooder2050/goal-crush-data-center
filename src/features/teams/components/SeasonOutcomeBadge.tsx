'use client';

import { match, P } from 'ts-pattern';

import { Badge } from '@/components/ui/badge';

type League = 'super' | 'challenge' | 'playoff' | 'cup' | 'other';

interface SeasonOutcomeBadgeProps {
  league: League;
  position: number | null | undefined;
  seasonName: string | null | undefined;
}

function getSeasonIndex(seasonName: string | null | undefined): number | null {
  if (!seasonName) return null;
  const mKo = seasonName.match(/시즌\s*(\d+)/);
  if (mKo && mKo[1]) return parseInt(mKo[1], 10);
  const mEn = seasonName.toLowerCase().match(/season\s*(\d+)/);
  if (mEn && mEn[1]) return parseInt(mEn[1], 10);
  return null;
}

export default function SeasonOutcomeBadge({
  league,
  position,
  seasonName,
}: SeasonOutcomeBadgeProps) {
  const seasonIndex = getSeasonIndex(seasonName) ?? 0;

  const outcome = match({ league, position, seasonIndex })
    .with({ league: 'super', position: 1 }, () => ({
      label: '우승',
      emoji: '🏆',
      variant: 'emphasisOutline' as const,
      className:
        'border-2 border-[#ff4800] text-[#ff4800] bg-white font-semibold',
    }))
    .with({ league: 'super', position: 6 }, () => ({
      label: '강등',
      emoji: '⬇️',
      variant: 'secondary' as const,
      className: 'bg-red-100 text-red-800',
    }))
    .with({ league: 'super', position: 5 }, () => ({
      label: '승강 PO',
      emoji: '↕️',
      variant: 'secondary' as const,
      className: 'bg-blue-100 text-blue-800',
    }))
    .with({ league: 'challenge', position: 1 }, () => ({
      label: '승격',
      emoji: '⬆️',
      variant: 'secondary' as const,
      className: 'bg-green-100 text-green-800',
    }))
    .with({ league: 'challenge', position: 2 }, () => ({
      label: '승강 PO',
      emoji: '↕️',
      variant: 'secondary' as const,
      className: 'bg-blue-100 text-blue-800',
    }))
    .with(
      {
        league: 'challenge',
        position: 4,
        seasonIndex: P.when((v) => v >= 3),
      },
      () => ({
        label: '방출',
        emoji: '❌',
        variant: 'secondary' as const,
        className: 'bg-red-100 text-red-800',
      })
    )
    .with({ league: 'cup', position: 1 }, () => ({
      label: '우승',
      emoji: '🏆',
      variant: 'emphasisOutline' as const,
      className:
        'border-2 border-[#ff4800] text-[#ff4800] bg-white font-semibold',
    }))
    .with({ league: 'playoff', position: 1 }, () => ({
      label: '슈퍼리그행',
      emoji: '⬆️',
      variant: 'secondary' as const,
      className: 'bg-violet-100 text-violet-800',
    }))
    .with({ league: 'playoff', position: 2 }, () => ({
      label: '챌린지리그행',
      emoji: '➡️',
      variant: 'secondary' as const,
      className: 'bg-indigo-100 text-indigo-800',
    }))
    .otherwise(() => null);

  return outcome ? (
    <Badge
      variant={outcome.variant}
      className={`px-2.5 py-0.5 text-[11px] shadow-sm ${outcome.className}`}
    >
      {outcome.emoji} {outcome.label}
    </Badge>
  ) : null;
}
