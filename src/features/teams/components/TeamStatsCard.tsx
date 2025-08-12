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
      <CardContent className="p-0 sm:p-4 grid grid-cols-3 divide-y-0 sm:divide-x gap-2 sm:gap-3">
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
      <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
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
    <div className="flex flex-col items-center sm:flex-row sm:justify-center gap-1.5 sm:gap-3 py-1.5 sm:py-2">
      <span
        className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full ${bg} ${color}`}
      >
        {icon}
      </span>
      <div className="text-center sm:text-center">
        <div className="text-[11px] sm:text-xs text-gray-500">{label}</div>
        <div className="text-lg sm:text-2xl font-semibold text-gray-900">
          {value}
        </div>
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
      className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 text-[12px] sm:text-sm ${s.chip}`}
    >
      <span
        className={`inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full ${s.icon}`}
      >
        {icon}
      </span>
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </span>
  );
}
