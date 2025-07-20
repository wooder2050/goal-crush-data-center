import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// Season 타입 정의
type SeasonWithMatchCount = {
  season_id: number;
  season_name: string;
  year: number;
  start_date: Date | null;
  end_date: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  _count: {
    matches: number;
  };
  match_count: number;
};

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

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
      include: {
        _count: {
          select: {
            matches: true,
          },
        },
      },
      orderBy: {
        season_id: 'desc',
      },
    });

    // match_count 필드를 추가하여 응답 형식 통일
    const seasonsWithMatchCount: SeasonWithMatchCount[] = seasons.map(
      (season) => ({
        ...season,
        match_count: season._count.matches,
      })
    );

    return NextResponse.json(seasonsWithMatchCount);
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
