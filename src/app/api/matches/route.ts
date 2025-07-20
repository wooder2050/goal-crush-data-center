import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        home_team: true,
        away_team: true,
        season: true,
      },
      orderBy: {
        match_date: 'desc',
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
