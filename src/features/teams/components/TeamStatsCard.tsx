'use client';

import { Card, CardContent } from '@/components/ui/card';

export type SimpleTeamStats = {
  matches: number;
  wins: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  win_rate: number; // 0-100
};

interface TeamStatsCardProps {
  stats: SimpleTeamStats;
}

export default function TeamStatsCard({ stats }: TeamStatsCardProps) {
  const { matches, wins, losses, goals_for, goals_against, win_rate } = stats;

  return (
    <Card>
      {/* 상단 KPI 3개 */}
      <CardContent className="p-4 grid grid-cols-3 divide-x">
        <Kpi label="경기" value={matches} />
        <Kpi label="승" value={wins} />
        <Kpi label="패" value={losses} />
      </CardContent>

      {/* 득점 / 실점 / 승률 - 동일 스타일, 한 줄 */}
      <CardContent className="pt-0 px-4 pb-4">
        <div className="flex flex-nowrap items-center justify-center gap-3 overflow-x-auto">
          <BadgeStat label="득점" value={`${goals_for}`} />
          <BadgeStat label="실점" value={`${goals_against}`} />
          <BadgeStat label="승률" value={`${win_rate}%`} />
        </div>
      </CardContent>
    </Card>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function BadgeStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </span>
  );
}
