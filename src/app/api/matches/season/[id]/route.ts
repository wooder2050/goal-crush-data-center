import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seasonId = parseInt(params.id);

    if (isNaN(seasonId)) {
      return NextResponse.json({ error: 'Invalid season ID' }, { status: 400 });
    }

    const matches = await prisma.match.findMany({
      where: { season_id: seasonId },
      include: {
        home_team: true,
        away_team: true,
        season: true,
      },
      orderBy: {
        match_date: 'asc',
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Failed to fetch matches by season:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches by season' },
      { status: 500 }
    );
  }
}
