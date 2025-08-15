import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ match_id: string }> }
) {
  try {
    const { match_id } = await params;
    const matchIdNum = parseInt(match_id);

    if (isNaN(matchIdNum)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const matchCoaches = await prisma.matchCoach.findMany({
      where: { match_id: matchIdNum },
      include: {
        coach: {
          select: {
            coach_id: true,
            name: true,
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
        role: 'asc',
      },
    });

    if (matchCoaches.length === 0) {
      return NextResponse.json({
        match_id: matchIdNum,
        coaches: [],
        message: 'No coach data available for this match',
      });
    }

    // 매치 정보 가져오기
    const match = await prisma.match.findUnique({
      where: { match_id: matchIdNum },
      select: {
        home_team_id: true,
        away_team_id: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const homeTeamCoaches = matchCoaches.filter(
      (mc) => mc.team_id === match.home_team_id
    );
    const awayTeamCoaches = matchCoaches.filter(
      (mc) => mc.team_id === match.away_team_id
    );

    return NextResponse.json({
      match_id: matchIdNum,
      home_team_coaches: homeTeamCoaches,
      away_team_coaches: awayTeamCoaches,
    });
  } catch (error) {
    console.error('Error fetching match coaches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match coaches' },
      { status: 500 }
    );
  }
}
