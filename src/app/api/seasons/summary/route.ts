import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const seasonSummaries = await prisma.teamSeasonStats.findMany({
      include: {
        team: {
          select: {
            team_id: true,
            team_name: true,
          },
        },
        season: {
          select: {
            season_id: true,
            season_name: true,
            year: true,
          },
        },
      },
      orderBy: [{ season_id: 'asc' }, { points: 'desc' }],
    });

    return NextResponse.json(seasonSummaries);
  } catch (error) {
    console.error('Failed to fetch season summaries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch season summaries' },
      { status: 500 }
    );
  }
}
