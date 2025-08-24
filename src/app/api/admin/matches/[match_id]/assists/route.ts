import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/admin/matches/[match_id]/assists - 특정 경기의 어시스트 목록 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: { match_id: string } }
) {
  try {
    const matchId = parseInt(params.match_id);

    if (isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    // 어시스트 목록 조회
    const assists = await prisma.assist.findMany({
      where: { goal: { match_id: matchId } },
      include: {
        player: {
          select: {
            player_id: true,
            name: true,
            jersey_number: true,
          },
        },
        goal: {
          select: {
            goal_id: true,
            goal_time: true,
            goal_type: true,
            player: {
              select: {
                player_id: true,
                name: true,
                jersey_number: true,
              },
            },
          },
        },
      },
      orderBy: { goal: { goal_time: 'asc' } },
    });

    return NextResponse.json(assists);
  } catch (error) {
    console.error('Failed to fetch assists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assists' },
      { status: 500 }
    );
  }
}

// POST /api/admin/matches/[match_id]/assists - 어시스트 추가
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
    const { player_id, goal_id, description } = data;

    // 필수 필드 검증
    if (!player_id || !goal_id) {
      return NextResponse.json(
        { error: 'player_id and goal_id are required' },
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

    // 골이 존재하고 해당 경기의 골인지 확인
    const goal = await prisma.goal.findFirst({
      where: {
        goal_id,
        match_id: matchId,
      },
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found in this match' },
        { status: 404 }
      );
    }

    // 어시스트 생성
    const assist = await prisma.assist.create({
      data: {
        match_id: matchId,
        player_id,
        goal_id,
        description: description || null,
      },
      include: {
        player: {
          select: {
            player_id: true,
            name: true,
            jersey_number: true,
          },
        },
        goal: {
          select: {
            goal_id: true,
            goal_time: true,
            goal_type: true,
            player: {
              select: {
                player_id: true,
                name: true,
                jersey_number: true,
              },
            },
          },
        },
      },
    });

    // 선수의 경기 통계 업데이트 (어시스트 추가)
    const playerStats = await prisma.playerMatchStats.findFirst({
      where: {
        match_id: matchId,
        player_id,
      },
    });

    if (playerStats) {
      await prisma.playerMatchStats.update({
        where: { stat_id: playerStats.stat_id },
        data: {
          assists: (playerStats.assists || 0) + 1,
        },
      });
    } else {
      // 선수의 경기 통계가 없는 경우 생성
      await prisma.playerMatchStats.create({
        data: {
          match_id: matchId,
          player_id,
          goals: 0,
          assists: 1,
          minutes_played: 0, // 기본값
        },
      });
    }

    // 시즌 통계 업데이트
    const match = await prisma.match.findUnique({
      where: { match_id: matchId },
    });

    if (match && match.season_id) {
      const seasonStats = await prisma.playerSeasonStats.findFirst({
        where: {
          player_id,
          season_id: match.season_id,
        },
      });

      if (seasonStats) {
        await prisma.playerSeasonStats.update({
          where: {
            stat_id: seasonStats.stat_id,
          },
          data: {
            assists: (seasonStats.assists || 0) + 1,
          },
        });
      }
    }

    return NextResponse.json(assist, { status: 201 });
  } catch (error) {
    console.error('Failed to create assist:', error);
    return NextResponse.json(
      { error: 'Failed to create assist' },
      { status: 500 }
    );
  }
}
