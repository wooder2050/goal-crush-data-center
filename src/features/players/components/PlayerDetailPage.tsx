'use client';

import { Card, CardContent, Grid, Section } from '@/components/ui';
import BackLink from '@/components/ui/back-link';

export default function PlayerDetailPage({
  playerId,
}: {
  playerId: number | null;
}) {
  const isPending = playerId == null;

  if (isPending) {
    return (
      <Section padding="sm">
        <div className="mb-6">
          <BackLink href="/players" label="선수 목록으로 돌아가기" />
        </div>
        <div className="space-y-6">
          <div className="h-7 w-44 rounded bg-gray-100" />
          <Grid cols={4} gap="lg">
            <Card className="col-span-4 md:col-span-2 overflow-hidden">
              <div className="h-64 w-full animate-pulse bg-gray-100" />
              <CardContent>
                <div className="mt-3 h-5 w-1/2 rounded bg-gray-100" />
                <div className="mt-2 h-4 w-1/3 rounded bg-gray-100" />
              </CardContent>
            </Card>
            <Card className="col-span-4 md:col-span-2">
              <CardContent>
                <div className="mt-3 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                  <div className="h-4 w-1/2 rounded bg-gray-100" />
                  <div className="h-4 w-3/4 rounded bg-gray-100" />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </div>
      </Section>
    );
  }

  return (
    <Section padding="sm">
      <div className="mb-6">
        <BackLink href="/players" label="선수 목록으로 돌아가기" />
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">선수 상세 정보</h1>
      </div>
      <Grid cols={4} gap="lg">
        <Card className="col-span-4 md:col-span-2 overflow-hidden">
          {/* placeholder deterministic image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/id/1005/800/600"
            alt="프로필 이미지"
            className="h-64 w-full object-cover md:h-80"
          />
          <CardContent>
            <div className="mt-3 text-lg font-semibold">
              플레이어 #{playerId}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              프로필 이미지와 상세 정보가 여기 표시됩니다.
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-2">
          <CardContent>
            <div className="py-3 text-sm text-gray-700">
              추후 통합 스탯, 시즌별 기록, 포지션, 소속팀 등의 상세 정보를 이
              영역에 배치합니다.
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Section>
  );
}
