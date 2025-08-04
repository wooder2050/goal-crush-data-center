'use client';

import {
  BarChart3,
  Calendar,
  Database,
  List,
  Trophy,
  Users,
} from 'lucide-react';
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Section padding="xl">
        <div className="text-center mb-12">
          <H1 className="mb-4">골 크러시 데이터 센터</H1>
          <Body className="text-lg mb-6">
            골때리는 그녀들 데이터 관리 시스템
          </Body>
          <Badge variant="category" className="text-base px-6 py-2">
            SBS 예능 프로그램 데이터 분석
          </Badge>
        </div>

        <Grid cols={3} gap="lg">
          {/* 시즌별 기록 보기 - 메인 기능 */}
          <Card className="hover:scale-105 transition-transform border-l-4 border-black">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                시즌별 기록 보기
              </CardTitle>
              <CardDescription>
                골때리는 그녀들 시즌별 경기 결과를 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/seasons">
                <Button className="w-full">시즌 목록 보기</Button>
              </Link>
            </CardContent>
          </Card>

          {/* 선수 관리 */}
          <Card className="hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                선수 관리
              </CardTitle>
              <CardDescription>
                선수 정보 조회 및 관리 기능입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                개발 예정
              </Button>
            </CardContent>
          </Card>

          {/* 팀 관리 */}
          <Card className="hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />팀 관리
              </CardTitle>
              <CardDescription>
                팀 정보 및 팀 구성 관리 기능입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                개발 예정
              </Button>
            </CardContent>
          </Card>

          {/* 통계 분석 */}
          <Card className="hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                통계 분석
              </CardTitle>
              <CardDescription>
                선수 및 팀 통계 분석 기능입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                개발 예정
              </Button>
            </CardContent>
          </Card>

          {/* 데이터베이스 */}
          <Card className="hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                데이터베이스
              </CardTitle>
              <CardDescription>
                데이터베이스 관리 및 백업 기능입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                개발 예정
              </Button>
            </CardContent>
          </Card>

          {/* 빠른 접근 - 최신 시즌 */}
          <Card className="hover:scale-105 transition-transform border-l-4 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                빠른 접근
              </CardTitle>
              <CardDescription>
                최신 시즌 결과에 바로 접근합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/sbs-cup-2">
                <Button variant="outline" size="sm" className="w-full">
                  제 2 SBS Cup
                </Button>
              </Link>
              <Link href="/season-5-playoff">
                <Button variant="outline" size="sm" className="w-full">
                  시즌 5 플레이오프
                </Button>
              </Link>
              <Link href="/season-5-challenge">
                <Button variant="outline" size="sm" className="w-full">
                  시즌 5 챌린지
                </Button>
              </Link>
              <Link href="/season-2">
                <Button variant="outline" size="sm" className="w-full">
                  시즌 2 결과
                </Button>
              </Link>
              <Link href="/season-1">
                <Button variant="outline" size="sm" className="w-full">
                  시즌 1 결과
                </Button>
              </Link>
              <Link href="/pilot-season">
                <Button variant="outline" size="sm" className="w-full">
                  파일럿 시즌
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        <Section
          title="프로젝트 정보"
          subtitle="기술 스택 및 아키텍처"
          background="gray"
          padding="lg"
        >
          <Grid cols={3} gap="md">
            <Card>
              <CardHeader>
                <CardTitle>기술 스택</CardTitle>
              </CardHeader>
              <CardContent>
                <Body>Next.js, TypeScript, Supabase</Body>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>아키텍처</CardTitle>
              </CardHeader>
              <CardContent>
                <Body>Feature Sliced Design</Body>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>데이터 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <Body>수동 입력 및 관리</Body>
              </CardContent>
            </Card>
          </Grid>
        </Section>
      </Section>
    </div>
  );
}
