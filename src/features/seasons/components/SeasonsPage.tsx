'use client';

import { isAfter, isBefore, parseISO, startOfDay } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import {
  Badge,
  Body,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  H1,
  Section,
} from '@/components/ui';
import {
  getAllSeasonsPrisma,
  type SeasonWithStats,
} from '@/features/seasons/api-prisma';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import { shortenSeasonName } from '@/lib/utils';

export default function SeasonsPage() {
  const {
    data: seasons = [],
    isLoading: loading,
    error,
  } = useGoalQuery(getAllSeasonsPrisma, []);

  const getStatusBadge = (
    startDate?: string | Date | null,
    endDate?: string | Date | null
  ) => {
    if (!startDate && !endDate) return <Badge variant="outline">미정</Badge>;
    const today = startOfDay(new Date());
    const toDate = (d?: string | Date | null) => {
      if (!d) return undefined;
      if (typeof d === 'string') return startOfDay(parseISO(d));
      return startOfDay(d);
    };
    const start = toDate(startDate);
    const end = toDate(endDate);
    if (end && isBefore(end, today)) {
      return <Badge variant="emphasisOutline">완료</Badge>;
    }
    if (start && isAfter(start, today)) {
      return <Badge variant="secondary">예정</Badge>;
    }
    return <Badge variant="default">진행중</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Section padding="sm">
          <div className="text-center">
            <H1 className="mb-3 sm:mb-4 text-xl sm:text-3xl">시즌 목록</H1>
            <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
              <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-64 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-md border p-4">
                  <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
                  <div className="mt-3 h-20 rounded bg-gray-100 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Section padding="xl">
          <div className="text-center">
            <H1 className="mb-4">시즌 목록</H1>
            <Body className="text-lg text-gray-600">
              {error instanceof Error
                ? error.message
                : '시즌 목록을 불러오는데 실패했습니다.'}
            </Body>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Section padding="sm">
        <div className="text-center mb-8 sm:mb-12">
          <H1 className="mb-3 sm:mb-4 text-xl sm:text-3xl">시즌 목록</H1>
          <Body className="text-base sm:text-lg mb-4 sm:mb-6">
            골때리는 그녀들 시즌별 경기 결과
          </Body>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {seasons.map((season: SeasonWithStats) => (
            <Card
              key={season.season_id}
              className="group h-full cursor-pointer overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link
                href={`/seasons/${season.season_id}`}
                className="block h-full"
              >
                <div className="flex h-full flex-col">
                  <div className="bg-gradient-to-br from-gray-50 to-white px-4 py-4 sm:px-5 sm:py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                          <span aria-hidden className="text-[14px]">
                            🏆
                          </span>
                        </div>
                        <CardTitle className="truncate text-base sm:text-lg">
                          {shortenSeasonName(season.season_name)}
                        </CardTitle>
                      </div>
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-colors group-hover:text-gray-600" />
                    </div>
                    <CardDescription className="mt-1 flex items-center gap-2 text-sm sm:text-base text-gray-600">
                      <span
                        aria-hidden
                        className="inline-block leading-none text-[14px]"
                      >
                        📅
                      </span>
                      {season.year}년
                    </CardDescription>
                  </div>
                  <CardContent className="flex flex-1 flex-col px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
                    {season.champion_label ? (
                      <div className="mb-3 rounded-md border bg-white p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span aria-hidden className="text-[14px]">
                            🥇
                          </span>
                          <span className="text-gray-600">
                            {season.champion_label ?? '우승팀'}
                          </span>
                          {season.champion_teams &&
                          season.champion_teams.length > 0 ? (
                            <span className="ml-1 inline-flex items-center gap-2 overflow-hidden whitespace-nowrap">
                              {season.champion_teams.map((t, idx) => (
                                <span
                                  key={`${t.team_id ?? 'na'}-${idx}`}
                                  className="inline-flex items-center gap-1"
                                >
                                  {t.logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={t.logo}
                                      alt={t.team_name ?? '팀 로고'}
                                      className="h-5 w-5 rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-700">
                                      {(t.team_name ?? '?').charAt(0)}
                                    </span>
                                  )}
                                  <span className="font-semibold text-gray-900">
                                    {t.team_name ?? '-'}
                                  </span>
                                </span>
                              ))}
                            </span>
                          ) : (
                            <span className="ml-1 inline-flex items-center gap-2 overflow-hidden whitespace-nowrap">
                              {season.champion_team_logo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={season.champion_team_logo}
                                  alt={
                                    season.champion_team_name ?? '우승팀 로고'
                                  }
                                  className="h-5 w-5 rounded-full object-cover"
                                />
                              ) : (
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-700">
                                  {(season.champion_team_name ?? '?').charAt(0)}
                                </span>
                              )}
                              <span className="font-semibold text-gray-900">
                                {season.champion_team_name ?? '-'}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    ) : null}
                    <div className="mb-3 sm:mb-4 flex items-center justify-between">
                      {getStatusBadge(season.start_date, season.end_date)}
                      <div className="inline-flex items-center gap-1 rounded-full border bg-gray-50 px-2.5 py-1 text-xs text-gray-800 font-medium">
                        <span
                          aria-hidden
                          className="inline-block leading-none text-[14px]"
                        >
                          ⚽
                        </span>
                        <span className="whitespace-nowrap">
                          {season.match_count || 0}경기
                        </span>
                      </div>
                    </div>
                    <Button
                      className="mt-auto h-10 w-full text-sm"
                      variant="primary"
                    >
                      시즌 기록 보기
                    </Button>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))}
        </div>
        {seasons.length === 0 && (
          <div className="text-center py-12">
            <Body className="text-base sm:text-lg">
              등록된 시즌이 없습니다.
            </Body>
          </div>
        )}
      </Section>
    </div>
  );
}
