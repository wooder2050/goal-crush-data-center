import { NextRequest, NextResponse } from 'next/server';

import { getCoachSeasonStatsCached } from '@/features/coaches/api-prisma';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const { coachId } = await params;
    const coachIdNum = parseInt(coachId);

    if (isNaN(coachIdNum)) {
      return NextResponse.json({ error: 'Invalid coach ID' }, { status: 400 });
    }

    const season_stats = await getCoachSeasonStatsCached(prisma, coachIdNum);

    return NextResponse.json({
      coach_id: coachIdNum,
      season_stats,
      total_matches: season_stats.reduce(
        (acc, s) => acc + (s.matches_played ?? 0),
        0
      ),
    });
  } catch (error) {
    console.error('Error fetching coach stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coach stats' },
      { status: 500 }
    );
  }
}
