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
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x gap-3">
        <Kpi
          icon="📅"
          label="경기"
          value={matches}
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
        <Kpi
          icon="✅"
          label="승"
          value={wins}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <Kpi
          icon="❌"
          label="패"
          value={losses}
          color="text-rose-600"
          bg="bg-rose-50"
        />
      </CardContent>

      {/* 득점 / 실점 / 승률 - 동일 스타일, 한 줄 */}
      <CardContent className="pt-0 px-4 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <BadgeStat
            icon="⚽️"
            label="득점"
            value={`${goals_for}`}
            tint="amber"
          />
          <BadgeStat
            icon="🛡️"
            label="실점"
            value={`${goals_against}`}
            tint="sky"
          />
          <BadgeStat
            icon="📈"
            label="승률"
            value={`${win_rate}%`}
            tint="violet"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Kpi({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-center justify-between sm:justify-center gap-3 py-2">
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${bg} ${color}`}
      >
        {icon}
      </span>
      <div className="text-right sm:text-center">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function BadgeStat({
  icon,
  label,
  value,
  tint,
}: {
  icon: string;
  label: string;
  value: string;
  tint: 'amber' | 'sky' | 'violet';
}) {
  const styles = {
    amber: {
      chip: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: 'bg-amber-100 text-amber-700',
    },
    sky: {
      chip: 'bg-sky-50 text-sky-800 border-sky-200',
      icon: 'bg-sky-100 text-sky-700',
    },
    violet: {
      chip: 'bg-violet-50 text-violet-800 border-violet-200',
      icon: 'bg-violet-100 text-violet-700',
    },
  } as const;

  const s = styles[tint];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${s.chip}`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${s.icon}`}
      >
        {icon}
      </span>
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </span>
  );
}
