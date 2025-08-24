'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { H1, H2 } from '@/components/ui/typography';
import RecentMatchesList from '@/features/admin/components/RecentMatchesList';

export const dynamic = 'force-dynamic';

export default function MatchesAdminPage() {
  return (
    <Container className="py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <H1>경기 관리</H1>
          <Link href="/">
            <Button variant="outline">홈으로</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2 space-y-4">
              <H2>다가오는 경기 등록</H2>
              <p className="text-gray-600">
                새로운 경기를 등록하고 기본 정보(팀, 날짜, 장소 등)를
                설정합니다.
              </p>
              <Link href="/admin/matches/create">
                <Button>경기 등록하기</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2 space-y-4">
              <H2>경기 결과 기록</H2>
              <p className="text-gray-600">
                완료된 경기의 결과와 세부 통계(골, 어시스트, 교체 등)를
                기록합니다.
              </p>
              <Link href="/admin/matches/record">
                <Button>결과 기록하기</Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <H2 className="mb-4">최근 등록된 경기</H2>
            <RecentMatchesList limit={5} />
          </Card>
        </div>
      </div>
    </Container>
  );
}
