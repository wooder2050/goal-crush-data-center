'use client';

import { BarChart3, Database, List, Trophy, Users } from 'lucide-react';
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
          <Card className="hover:scale-105 transition-transform border-l-4 border-[#ff4800]">
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
                <Trophy className="h-5 w-5" />팀 정보 보기
              </CardTitle>
              <CardDescription>
                팀 정보 및 팀 구성 정보를 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/teams">
                <Button className="w-full">팀 정보 보기</Button>
              </Link>
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
        </Grid>
      </Section>
    </div>
  );
}
