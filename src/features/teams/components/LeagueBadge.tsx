'use client';

import { Badge } from '@/components/ui/badge';

export type LeagueType = 'super' | 'challenge' | 'playoff' | 'cup' | 'other';

export default function LeagueBadge({ league }: { league: LeagueType }) {
  const labelMap: Record<LeagueType, string> = {
    super: '슈퍼',
    challenge: '챌린지',
    playoff: '플레이오프',
    cup: '컵',
    other: '기타',
  };

  return (
    <Badge variant="outline" className="px-2 py-0 text-[10px]">
      {labelMap[league]}
    </Badge>
  );
}
