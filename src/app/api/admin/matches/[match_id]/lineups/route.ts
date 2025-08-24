import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/admin/matches/[match_id]/lineups - 특정 경기의 라인업 목록 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: { match_id: string } }
) {
  try {
    const matchId = parseInt(params.match_id);

    if (isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    // 라인업 목록 조회 (PlayerMatchStats를 라인업으로 사용)
    const lineups = await prisma.playerMatchStats.findMany({
      where: { match_id: matchId },
      include: {
        player: {
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
      orderBy: [{ team_id: 'asc' }, { position: 'asc' }],
    });

    return NextResponse.json(lineups);
  } catch (error) {
    console.error('Failed to fetch lineups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lineups' },
      { status: 500 }
    );
  }
}

// POST /api/admin/matches/[match_id]/lineups - 라인업 추가
export async function POST(
  request: NextRequest,
  { params }: { params: { match_id: string } }
) {
  try {
    const matchId = parseInt(params.match_id);

    if (isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const data = await request.json();
    const { player_id, team_id, position, minutes_played } = data;

    // 필수 필드 검증
    if (!player_id || !team_id || !position) {
      return NextResponse.json(
        { error: 'player_id, team_id, and position are required' },
        { status: 400 }
      );
    }

    // 선수가 존재하는지 확인
    const player = await prisma.player.findUnique({
      where: { player_id },
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // 팀이 존재하는지 확인
    const team = await prisma.team.findUnique({
      where: { team_id },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // 경기가 존재하는지 확인
    const match = await prisma.match.findUnique({
      where: { match_id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // 해당 경기에 이미 같은 선수가 라인업에 있는지 확인
    const existingLineup = await prisma.playerMatchStats.findFirst({
      where: {
        match_id: matchId,
        player_id,
      },
    });

    if (existingLineup) {
      return NextResponse.json(
        { error: 'Player already in lineup for this match' },
        { status: 409 }
      );
    }

    // 라인업 생성 (PlayerMatchStats에 기록)
    const lineup = await prisma.playerMatchStats.create({
      data: {
        match_id: matchId,
        player_id,
        team_id,
        position,
        goals: 0,
        assists: 0,
        minutes_played: minutes_played || 0, // 전달받은 출전 시간 또는 기본값 0
      },
      include: {
        player: {
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
    });

    // PlayerMatchStats가 이미 생성되었으므로 추가 작업 불필요

    return NextResponse.json(lineup, { status: 201 });
  } catch (error) {
    console.error('Failed to create lineup:', error);
    return NextResponse.json(
      { error: 'Failed to create lineup' },
      { status: 500 }
    );
  }
}
