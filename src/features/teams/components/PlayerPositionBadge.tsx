'use client';

import { Badge } from '@/components/ui/badge';
import { getPositionColor } from '@/features/matches/lib/matchUtils';

interface PlayerPositionBadgeProps {
  position: string;
}

export default function PlayerPositionBadge({
  position,
}: PlayerPositionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`${getPositionColor(position)} text-xs px-2 py-0`}
      title={position}
    >
      {position}
    </Badge>
  );
}
