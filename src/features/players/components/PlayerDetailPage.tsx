'use client';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Card, CardContent, Grid, Section } from '@/components/ui';
import PlayerDetailContent from '@/features/players/components/PlayerDetailContent';

export default function PlayerDetailPage({
  playerId,
}: {
  playerId: number | null;
}) {
  const isPending = playerId == null;

  const Skeleton = (
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
  );

  return (
    <Section padding="sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">선수 상세 정보</h1>
      </div>
      {isPending ? (
        Skeleton
      ) : (
        <GoalWrapper fallback={Skeleton}>
          <PlayerDetailContent playerId={playerId!} />
        </GoalWrapper>
      )}
    </Section>
  );
}
