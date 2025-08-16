'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import { shortenSeasonName } from '@/lib/utils';

import { getUpcomingMatchesPrisma } from '../api-prisma';

interface Props {
  title?: string;
  teamId?: number;
  seasonId?: number;
  limit?: number;
  className?: string;
}

export default function UpcomingMatches({
  title = '다가오는 경기',
  teamId,
  seasonId,
  limit = 6,
  className = '',
}: Props) {
  const router = useRouter();
  const { data } = useGoalSuspenseQuery(getUpcomingMatchesPrisma, [
    { teamId, seasonId, limit },
  ]);

  if (!data || data.items.length === 0) return null;

  return (
    <Card
      className={`${className} transition-shadow hover:shadow-md border-l-4 border-[#ff4800] bg-gradient-to-b from-[#fff7f3] to-white ring-1 ring-[#ff4800]/10`}
    >
      <CardHeader className="space-y-0 p-0 sm:p-0 md:p-0">
        <CardTitle className="text-base p-0 sm:p-0 md:p-0 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#ff4800]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 sm:py-0 md:py-0">
        <ul className="divide-y divide-gray-100">
          {data.items.map((m) => {
            const dateStr = format(
              new Date(m.match_date),
              'yy.MM.dd (EEE) HH:mm',
              { locale: ko }
            );
            const season = shortenSeasonName(m.season?.season_name ?? '');
            return (
              <li key={m.match_id} className="py-2 sm:py-2.5">
                <div
                  role="link"
                  tabIndex={0}
                  aria-label={`경기 상세 보기 ${m.match_id}`}
                  onClick={() => router.push(`/matches/${m.match_id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/matches/${m.match_id}`);
                    }
                  }}
                  className="cursor-pointer rounded px-2 -mx-2 transition-colors"
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden w-full space-y-1 py-1">
                    <div className="flex items-center justify-center gap-2">
                      {m.home?.logo ? (
                        <span className="relative h-5 w-5 overflow-hidden rounded-full flex-shrink-0">
                          <Image
                            src={m.home.logo}
                            alt={m.home.team_name}
                            fill
                            sizes="20px"
                            className="object-cover"
                          />
                        </span>
                      ) : (
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                      )}
                      <span className="text-sm">
                        {m.home?.team_name ?? '미정'}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        vs
                      </Badge>
                      {m.away?.logo ? (
                        <span className="relative h-5 w-5 overflow-hidden rounded-full flex-shrink-0">
                          <Image
                            src={m.away.logo}
                            alt={m.away.team_name}
                            fill
                            sizes="20px"
                            className="object-cover"
                          />
                        </span>
                      ) : (
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                      )}
                      <span className="text-sm">
                        {m.away?.team_name ?? '미정'}
                      </span>
                    </div>
                    <div className="text-center text-[11px] text-gray-600">
                      {dateStr}{' '}
                      <span className="text-gray-400">• {season}</span>
                    </div>
                  </div>

                  {/* Desktop / Tablet layout */}
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {m.home?.logo ? (
                        <span className="relative h-5 w-5 overflow-hidden rounded-full flex-shrink-0">
                          <Image
                            src={m.home.logo}
                            alt={m.home.team_name}
                            fill
                            sizes="20px"
                            className="object-cover"
                          />
                        </span>
                      ) : (
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                      )}
                      <span className="truncate text-sm">
                        {m.home?.team_name ?? '미정'}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[11px]">
                      vs
                    </Badge>
                    <div className="flex items-center gap-2 min-w-0">
                      {m.away?.logo ? (
                        <span className="relative h-5 w-5 overflow-hidden rounded-full flex-shrink-0">
                          <Image
                            src={m.away.logo}
                            alt={m.away.team_name}
                            fill
                            sizes="20px"
                            className="object-cover"
                          />
                        </span>
                      ) : (
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                      )}
                      <span className="truncate text-sm">
                        {m.away?.team_name ?? '미정'}
                      </span>
                    </div>
                    <div className="ml-auto text-xs sm:text-sm text-gray-600 text-right">
                      <div>{dateStr}</div>
                      <div className="text-gray-400">{season}</div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
