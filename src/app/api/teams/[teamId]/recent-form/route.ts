import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const teamId = parseInt(params.teamId);
    const { searchParams } = new URL(request.url);
    const beforeDate = searchParams.get('before');

    if (isNaN(teamId)) {
      return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 });
    }

    if (!beforeDate) {
      return NextResponse.json(
        { error: 'before date is required' },
        { status: 400 }
      );
    }

    // 해당 팀이 참여한 최근 5경기를 가져옴 (beforeDate 이전)
    const recentMatches = await prisma.match.findMany({
      where: {
        OR: [{ home_team_id: teamId }, { away_team_id: teamId }],
        match_date: {
          lt: beforeDate,
        },
        home_score: {
          not: null,
        },
        away_score: {
          not: null,
        },
      },
      select: {
        match_id: true,
        match_date: true,
        home_team_id: true,
        away_team_id: true,
        home_score: true,
        away_score: true,
        penalty_home_score: true,
        penalty_away_score: true,
        home_team: {
          select: {
            team_id: true,
            team_name: true,
          },
        },
        away_team: {
          select: {
            team_id: true,
            team_name: true,
          },
        },
      },
      orderBy: {
        match_date: 'desc',
      },
      take: 5,
    });

    // 응답 데이터를 명시적으로 변환하여 타입 일치
    const formattedMatches = recentMatches.map((match) => ({
      match_id: match.match_id,
      match_date: match.match_date.toISOString(),
      home_team_id: match.home_team_id,
      away_team_id: match.away_team_id,
      home_score: match.home_score,
      away_score: match.away_score,
      penalty_home_score: match.penalty_home_score,
      penalty_away_score: match.penalty_away_score,
      home_team: match.home_team,
      away_team: match.away_team,
    }));

    return NextResponse.json(formattedMatches);
  } catch (error) {
    console.error('Failed to fetch team recent form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team recent form' },
      { status: 500 }
    );
  }
}
