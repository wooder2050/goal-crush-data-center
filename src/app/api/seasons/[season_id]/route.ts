import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/seasons/:season_id - 단일 시즌 조회
export async function GET(
  _request: NextRequest,
  context: { params: { season_id?: string } }
) {
  try {
    const idParam = context.params?.season_id;
    const seasonId = idParam ? Number(idParam) : NaN;
    if (!idParam || Number.isNaN(seasonId)) {
      return NextResponse.json({ error: 'Invalid season_id' }, { status: 400 });
    }

    const season = await prisma.season.findUnique({
      where: { season_id: seasonId },
    });

    if (!season) {
      return NextResponse.json({ error: 'Season not found' }, { status: 404 });
    }

    return NextResponse.json(season);
  } catch (error) {
    console.error('Error fetching season by id:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch season',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
