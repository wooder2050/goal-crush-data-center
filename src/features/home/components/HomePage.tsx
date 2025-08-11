'use client';

import { BarChart3, Database, List, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Section padding="sm">
        <div className="text-center mb-8 sm:mb-12">
          <H1 className="mb-3 sm:mb-4 text-xl sm:text-3xl">
            골 때리는 그녀들 데이터 센터
          </H1>
          <Badge
            variant="emphasisOutline"
            className="px-4 py-1.5 sm:px-6 sm:py-2"
          >
            매주 수요일 밤 11시 방송 데이터 업데이트
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 시즌별 기록 보기 - 메인 기능 */}
          <Card className="hover:scale-105 transition-transform border-l-4 border-[#ff4800] h-full">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
                시즌별 기록 보기
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                골때리는 그녀들 시즌별 경기 결과를 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/seasons">
                <Button className="w-full">시즌 목록 보기</Button>
              </Link>
            </CardContent>
          </Card>

          {/* 선수 정보 보기 */}
          <Card className="hover:scale-105 transition-transform h-full">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                선수 정보 보기
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                선수 정보 조회 페이지로 이동합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/players">
                <Button className="w-full">선수 정보 보기</Button>
              </Link>
            </CardContent>
          </Card>

          {/* 팀 관리 */}
          <Card className="hover:scale-105 transition-transform h-full">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />팀 정보 보기
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
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
          <Card className="hover:scale-105 transition-transform h-full">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                통계 분석
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
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
          <Card className="hover:scale-105 transition-transform h-full">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                데이터베이스
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                데이터베이스 관리 및 백업 기능입니다.
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
