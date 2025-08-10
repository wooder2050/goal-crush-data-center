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
  Grid,
  H1,
  Section,
} from '@/components/ui';
import BackLink from '@/components/ui/back-link';
import {
  getAllSeasonsPrisma,
  getSeasonRoute,
} from '@/features/seasons/api-prisma';
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
        <Section padding="xl">
          <div className="text-center">
            <H1 className="mb-4">시즌 목록</H1>
            <Body className="text-lg">시즌 목록을 불러오는 중...</Body>
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
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <BackLink href="/" label="메인 페이지로 돌아가기" />
        </div>

        <div className="text-center mb-12">
          <H1 className="mb-4">시즌 목록</H1>
          <Body className="text-lg mb-6">골때리는 그녀들 시즌별 경기 결과</Body>
        </div>

        <Grid cols={3} gap="lg">
          {seasons.map((season) => (
            <Card
              key={season.season_id}
              className="hover:scale-105 transition-transform cursor-pointer"
            >
              <Link href={getSeasonRoute(season.season_name)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      {season.season_name}
                    </CardTitle>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {season.year}년
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
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
        </Grid>

        {seasons.length === 0 && (
          <div className="text-center py-12">
            <Body className="text-lg">등록된 시즌이 없습니다.</Body>
          </div>
        )}
      </Section>
    </div>
  );
}
