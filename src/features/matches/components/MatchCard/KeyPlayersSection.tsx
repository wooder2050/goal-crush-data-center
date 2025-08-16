'use client';

import Link from 'next/link';
import React from 'react';

import { Badge, Card } from '@/components/ui';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

import { getKeyPlayersByMatchIdPrisma } from '../../api-prisma';

export default function KeyPlayersSection({ matchId }: { matchId: number }) {
  const { data } = useGoalSuspenseQuery(getKeyPlayersByMatchIdPrisma, [
    matchId,
  ]);
  if (!data) return null;

  const renderList = (items: typeof data.home) => (
    <ul className="space-y-1">
      {items.map((p) => (
        <li key={p.player_id} className="flex items-center justify-between">
          <div className="min-w-0">
            <Link
              href={`/players/${p.player_id}`}
              className="font-medium text-gray-900 hover:underline truncate"
            >
              {p.player_name}
            </Link>
            <span className="ml-2 text-xs text-gray-500">
              {p.position ?? ''}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {p.goals > 0 && (
              <Badge
                variant="secondary"
                className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800"
              >
                ⚽ {p.goals}
              </Badge>
            )}
            {p.assists > 0 && (
              <Badge
                variant="secondary"
                className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
              >
                🎯 {p.assists}
              </Badge>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <Card className="p-3 sm:p-4">
      <div className="mb-2">
        <div className="text-sm font-semibold text-gray-800">🌟 주요 선수</div>
        <div className="mt-0.5 text-[11px] text-gray-500">최근 경기 기준</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-gray-600 mb-1">홈팀</div>
          {renderList(data.home)}
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">원정팀</div>
          {renderList(data.away)}
        </div>
      </div>
    </Card>
  );
}
