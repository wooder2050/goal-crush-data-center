import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/seasons - 모든 시즌 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const year = searchParams.get('year');

    const seasons = await prisma.season.findMany({
      where: {
        ...(name && {
          season_name: {
            contains: name,
            mode: 'insensitive' as const,
          },
        }),
        ...(year &&
          !isNaN(parseInt(year)) && {
            year: parseInt(year),
          }),
      },
      orderBy: {
        year: 'desc',
      },
    });

    return NextResponse.json(seasons);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch seasons',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
