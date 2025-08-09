'use client';

import { match } from 'ts-pattern';

import { Badge } from '@/components/ui/badge';

interface PositionBadgeProps {
  position: number;
}

export default function PositionBadge({ position }: PositionBadgeProps) {
  const medal = match(position)
    .with(1, () => '🥇')
    .with(2, () => '🥈')
    .with(3, () => '🥉')
    .otherwise(() => null as string | null);

  const colorClass = match(position)
    .with(1, () => 'bg-yellow-100 text-yellow-800')
    .with(2, () => 'bg-gray-100 text-gray-800')
    .with(3, () => 'bg-orange-100 text-orange-800')
    .otherwise(() => 'bg-gray-100 text-gray-700');

  return (
    <Badge
      variant="secondary"
      className={`px-2 py-0 text-xs ${colorClass}`}
      title={`${position}위`}
    >
      {medal ? `${medal} ${position}위` : `${position}위`}
    </Badge>
  );
}
