import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { match_id: string } }
) {
  try {
    const matchId = parseInt(params.match_id);

    if (isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const penaltyDetails = await prisma.penaltyShootoutDetail.findMany({
      where: { match_id: matchId },
      include: {
        kicker: {
          select: {
            player_id: true,
            name: true,
            jersey_number: true,
          },
        },
        goalkeeper: {
          select: {
            player_id: true,
            name: true,
            jersey_number: true,
          },
        },
        team: {
          select: {
            team_id: true,
            team_name: true,
          },
        },
      },
      orderBy: {
        kicker_order: 'asc',
      },
    });

    return NextResponse.json(penaltyDetails);
  } catch (error) {
    console.error('Failed to fetch penalty shootout details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch penalty shootout details' },
      { status: 500 }
    );
  }
}
