import { NextRequest, NextResponse } from 'next/server';

import {
  getCoachSeasonStatsCached,
  getCoachTrophiesCached,
} from '@/features/coaches/api-prisma';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const { coachId } = await params;
    const coachIdNum = Number(coachId);
    if (Number.isNaN(coachIdNum)) {
      return NextResponse.json({ error: 'Invalid coach ID' }, { status: 400 });
    }

    // 1) 시즌별 통계: 공통 유틸 사용
    const season_stats = await getCoachSeasonStatsCached(prisma, coachIdNum);

    const total_matches = season_stats.reduce(
      (acc, s) => acc + (s.matches_played ?? 0),
      0
    );

    // 2) 우승 트로피: 공통 유틸 사용
    const trophies = await getCoachTrophiesCached(prisma, coachIdNum);

    return NextResponse.json({
      coach_id: coachIdNum,
      season_stats,
      total_matches,
      trophies,
    });
  } catch (error) {
    console.error('Failed to fetch coach overview', error);
    return NextResponse.json(
      { error: 'Failed to fetch coach overview' },
      { status: 500 }
    );
  }
}
