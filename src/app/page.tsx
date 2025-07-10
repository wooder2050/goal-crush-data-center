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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">골 크러시 데이터 센터</h1>
        <p className="text-xl text-gray-600 mb-6">
          골때리는 그녀들 데이터 관리 시스템
        </p>
        <Badge variant="outline" className="text-lg px-4 py-2">
          SBS 예능 프로그램 데이터 분석
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 시즌별 기록 보기 - 메인 기능 */}
        <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
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
        <Card className="hover:shadow-lg transition-shadow">
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
            <Button variant="outline" className="w-full" disabled>
              개발 예정
            </Button>
          </CardContent>
        </Card>

        {/* 팀 관리 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />팀 관리
            </CardTitle>
            <CardDescription>
              팀 정보 및 팀 구성 관리 기능입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              개발 예정
            </Button>
          </CardContent>
        </Card>

        {/* 통계 분석 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              통계 분석
            </CardTitle>
            <CardDescription>선수 및 팀 통계 분석 기능입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              개발 예정
            </Button>
          </CardContent>
        </Card>

        {/* 데이터베이스 */}
        <Card className="hover:shadow-lg transition-shadow">
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
            <Button variant="outline" className="w-full" disabled>
              개발 예정
            </Button>
          </CardContent>
        </Card>

        {/* 빠른 접근 - 최신 시즌 */}
        <Card className="hover:shadow-lg transition-shadow border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Calendar className="h-5 w-5" />
              빠른 접근
            </CardTitle>
            <CardDescription>최신 시즌 결과에 바로 접근합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
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
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">프로젝트 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">기술 스택</h3>
            <p>Next.js, TypeScript, Supabase</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">아키텍처</h3>
            <p>Feature Sliced Design</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2">데이터 관리</h3>
            <p>수동 입력 및 관리</p>
          </div>
        </div>
      </div>
    </div>
  );
}
