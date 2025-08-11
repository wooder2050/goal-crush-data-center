'use client';

import { isAfter, isBefore, parseISO, startOfDay } from 'date-fns';
import { Calendar, ChevronRight, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

import {
  Badge,
  Body,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  H1,
  Section,
} from '@/components/ui';
import { getAllSeasonsPrisma } from '@/features/seasons/api-prisma';
import { useGoalQuery } from '@/hooks/useGoalQuery';

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
          {seasons.map((season) => (
            <Card
              key={season.season_id}
              className="hover:scale-105 transition-transform cursor-pointer"
            >
              <Link href={`/seasons/${season.season_id}`}>
                <CardHeader className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                      {season.season_name}
                    </CardTitle>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm sm:text-base">
                    <Calendar className="h-4 w-4" />
                    {season.year}년
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    {getStatusBadge(season.start_date, season.end_date)}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {season.match_count || 0}경기
                    </div>
                  </div>
                  <Button className="w-full">경기 결과 보기</Button>
                </CardContent>
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
