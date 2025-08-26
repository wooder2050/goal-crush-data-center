import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/seasons/simple - 간단한 시즌 목록 조회
export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      select: {
        season_id: true,
        season_name: true,
        year: true,
      },
      orderBy: {
        season_id: 'desc',
      },
    });

    return NextResponse.json({ data: seasons });
  } catch (error) {
    console.error('Error fetching simple seasons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seasons' },
      { status: 500 }
    );
  }
}
