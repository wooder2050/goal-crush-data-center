import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/players - 모든 선수 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    const players = await prisma.player.findMany({
      select: {
        player_id: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
      where: name
        ? {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          }
        : undefined,
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch players',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
