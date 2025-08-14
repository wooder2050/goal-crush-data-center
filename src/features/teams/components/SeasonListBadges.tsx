'use client';

import { Badge } from '@/components/ui/badge';
import { shortenSeasonName } from '@/lib/utils';

interface SeasonListBadgesProps {
  labels: string[];
  max?: number;
  align?: 'start' | 'end';
}

export default function SeasonListBadges({
  labels,
  max = 3,
  align = 'start',
}: SeasonListBadgesProps) {
  if (!labels || labels.length === 0)
    return <span className="text-gray-400">-</span>;

  const visible = labels.slice(0, max);
  const remaining = labels.length - visible.length;

  return (
    <div
      className={`flex flex-wrap ${align === 'end' ? 'justify-end' : 'justify-start'} gap-1`}
    >
      {visible.map((label, i) => (
        <Badge key={`${label}-${i}`} variant="secondary">
          {shortenSeasonName(label)}
        </Badge>
      ))}
      {remaining > 0 && <Badge variant="secondary">+{remaining}</Badge>}
    </div>
  );
}
