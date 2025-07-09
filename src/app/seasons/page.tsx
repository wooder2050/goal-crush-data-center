'use client';

import Link from 'next/link';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight, Trophy, Users, ArrowLeft } from 'lucide-react';
import { getAllSeasons, getSeasonRoute } from '@/features/seasons/api';
import { DEFAULT_STALE_TIME } from '@/constants/query';

export default function SeasonsPage() {
  const {
    data: seasons = [],
    isLoading: loading,
    error,
  } = useGoalQuery(getAllSeasons, []);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">완료</Badge>;
      case 'ongoing':
        return <Badge variant="destructive">진행중</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">예정</Badge>;
      default:
        return <Badge variant="outline">미정</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">시즌 목록</h1>
          <p className="text-xl text-gray-600">시즌 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">시즌 목록</h1>
          <p className="text-xl text-red-600">
            {error instanceof Error
              ? error.message
              : '시즌 목록을 불러오는데 실패했습니다.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            메인 페이지로 돌아가기
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">시즌 목록</h1>
        <p className="text-xl text-gray-600 mb-6">
          골때리는 그녀들 시즌별 경기 결과
        </p>
        <Badge variant="outline" className="text-lg px-4 py-2">
          SBS 예능 프로그램
        </Badge>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasons.map((season) => (
            <Card
              key={season.season_id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
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
                    {getStatusBadge(season.status)}
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
      </div>

      {seasons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">등록된 시즌이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
