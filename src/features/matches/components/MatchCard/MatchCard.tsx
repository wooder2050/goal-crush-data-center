'use client';

import DetailMatchCard from './DetailMatchCard';
import SeasonMatchCard from './SeasonMatchCard';

export default function MatchCard(props: {
  matchId: number;
  className?: string;
  variant: 'season' | 'detail';
}) {
  const { variant, ...rest } = props;
  if (variant === 'season') return <SeasonMatchCard {...rest} />;
  return <DetailMatchCard {...rest} />;
}
