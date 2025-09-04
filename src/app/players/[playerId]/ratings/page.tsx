'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { GoalWrapper } from '@/common/GoalWrapper';
import { useResolvedPathParams } from '@/common/path-params/client';
import { Button, Card, CardContent, Section } from '@/components/ui';
import { PlayerRatingsPage } from '@/features/player-ratings/components/PlayerRatingsPage';

export default function Page() {
  const [playerIdStr] = useResolvedPathParams('playerId');
  const idNum = Number(playerIdStr);
  const resolvedId = Number.isFinite(idNum) ? idNum : null;

  const Skeleton = (
    <div className="space-y-6">
      {/* 헤더 스켈레톤 */}
      <div className="h-8 w-48 rounded bg-gray-100 animate-pulse" />

      {/* 종합 평가 스켈레톤 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-40 rounded bg-gray-100 animate-pulse" />
            <div className="h-10 w-24 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 h-64 rounded bg-gray-100 animate-pulse" />
            <div className="space-y-4">
              <div className="h-16 w-full rounded bg-gray-100 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 평가 목록 스켈레톤 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-32 rounded bg-gray-100 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 w-20 rounded bg-gray-100 animate-pulse" />
              <div className="h-8 w-20 rounded bg-gray-100 animate-pulse" />
              <div className="h-8 w-24 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
                        <div className="h-3 w-32 rounded bg-gray-100 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-8 w-16 rounded bg-gray-100 animate-pulse" />
                      <div className="h-3 w-12 rounded bg-gray-100 animate-pulse mt-1" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-20 w-full rounded bg-gray-100 animate-pulse" />
                    <div className="h-16 w-full rounded bg-gray-100 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!resolvedId) {
    return (
      <Section padding="sm">
        <div className="text-center py-8">
          <p className="text-red-600">잘못된 선수 ID입니다.</p>
          <Link href="/players">
            <Button variant="outline" className="mt-4">
              선수 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <Section padding="sm">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/players/${resolvedId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              선수 정보로 돌아가기
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold">선수 평가</h1>
        <p className="text-gray-600 mt-1">
          선수에 대한 다양한 평가와 댓글을 확인하고 참여해보세요
        </p>
      </div>

      <GoalWrapper fallback={Skeleton}>
        <PlayerRatingsPage playerId={resolvedId} />
      </GoalWrapper>
    </Section>
  );
}
