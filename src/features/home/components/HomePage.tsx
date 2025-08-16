'use client';

import {
  BarChart3,
  Database,
  List,
  PlayCircle,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { GoalWrapper } from '@/common/GoalWrapper';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  H1,
  Section,
} from '@/components/ui';
import UpcomingMatches from '@/features/matches/components/UpcomingMatches';
import UpcomingMatchesSkeleton from '@/features/matches/components/UpcomingMatchesSkeleton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Section padding="sm">
        {/* Hero */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 mb-8 sm:mb-12">
          <div className="flex flex-col justify-center order-2 sm:order-1">
            <Badge variant="emphasisOutline" className="w-fit mb-3 sm:mb-4">
              골 때리는 그녀들 · 데이터 아카이브
            </Badge>
            <H1 className="mb-2 sm:mb-3 text-xl sm:text-3xl leading-tight">
              경기 결과, 선수/팀 기록을 한 곳에서
            </H1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              시즌별 경기, 선수·팀 통계를 구조화하여 누구나 쉽게 탐색할 수
              있도록 제공합니다.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/seasons">
                <Button>시즌 기록 보기</Button>
              </Link>
              <Link href="/players">
                <Button variant="outline">선수 정보 보기</Button>
              </Link>
            </div>
          </div>
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden shadow-sm border order-1 sm:order-2">
            <Image
              src="https://ppqctvmpsmlagsmmmdee.supabase.co/storage/v1/object/sign/playerprofile/mwE1721003437663.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZWM2YjcyNS1hYWJjLTQzOGUtODkzMi00NDU1ZmM1ZGEyY2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGF5ZXJwcm9maWxlL213RTE3MjEwMDM0Mzc2NjMuanBnIiwiaWF0IjoxNzU1MTY2Njk5LCJleHAiOjIwNzA1MjY2OTl9.c0a4K6VimPMfItbZq1rjL5TEWhcC_319UMgLRRSj9sI"
              alt="데이터 센터 미리보기"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* 다가오는 경기 */}
        <div className="mb-8 sm:mb-10">
          <GoalWrapper fallback={<UpcomingMatchesSkeleton items={1} />}>
            <UpcomingMatches />
          </GoalWrapper>
        </div>

        {/* 핵심 특징 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 sm:mb-10">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4" />
                정돈된 기록
              </CardTitle>
              <CardDescription>
                시즌/리그 체계에 맞춘 일관된 데이터 구조
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                빠른 탐색
              </CardTitle>
              <CardDescription>
                시즌, 선수, 팀 단위로 즉시 비교/조회
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <PlayCircle className="h-4 w-4" />
                하이라이트 링크
              </CardTitle>
              <CardDescription>
                경기 카드에서 바로 영상으로 이동
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />
                통계 확대 예정
              </CardTitle>
              <CardDescription>
                세부 지표/시각화 기능을 지속 확장
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 바로가기 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:scale-105 transition-transform border-l-4 border-[#ff4800] h-full">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
                시즌별 기록 보기
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                시즌별 경기 결과와 순위를 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/seasons">
                <Button className="w-full">시즌 목록 보기</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform h-full">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                선수 정보 보기
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                선수 프로필과 시즌별 기록을 조회합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/players">
                <Button className="w-full">선수 정보 보기</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform h-full">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />팀 정보 보기
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                팀 스쿼드, 시즌 성적, 우승 기록을 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/teams">
                <Button className="w-full">팀 정보 보기</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform h-full">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                통계 분석
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                선수/팀 통계 시각화 (개발 예정)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                개발 예정
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform h-full">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                데이터베이스
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                데이터 백업/관리 (개발 예정)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                개발 예정
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
