import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Position } from '@/types/fantasy';

export const dynamic = 'force-dynamic';

// GET - 사용자의 판타지 팀 조회 (fantasy_season_id 기반)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = user.userId;

    const { searchParams } = new URL(request.url);
    const fantasySeasonId = searchParams.get('fantasy_season_id');

    if (!fantasySeasonId) {
      return NextResponse.json(
        { error: 'fantasy_season_id가 필요합니다.' },
        { status: 400 }
      );
    }

    const seasonId = parseInt(fantasySeasonId);

    if (isNaN(seasonId)) {
      return NextResponse.json(
        { error: '유효하지 않은 fantasy_season_id입니다.' },
        { status: 400 }
      );
    }

    // 판타지 시즌 조회
    const fantasySeason = await prisma.fantasySeason.findUnique({
      where: { fantasy_season_id: seasonId },
      include: {
        season: {
          select: {
            season_id: true,
            season_name: true,
            category: true,
          },
        },
      },
    });

    if (!fantasySeason) {
      return NextResponse.json(
        { error: '판타지 시즌을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 사용자의 판타지 팀 조회
    const fantasyTeam = await prisma.fantasyTeam.findUnique({
      where: {
        user_id_fantasy_season_id: {
          user_id: userId,
          fantasy_season_id: seasonId,
        },
      },
      include: {
        player_selections: {
          include: {
            player: {
              select: {
                player_id: true,
                name: true,
                profile_image_url: true,
                jersey_number: true,
                player_team_history: {
                  where: { is_active: true },
                  include: {
                    team: {
                      select: {
                        team_id: true,
                        team_name: true,
                        logo: true,
                        primary_color: true,
                        secondary_color: true,
                      },
                    },
                  },
                  take: 1,
                },
                player_season_stats: {
                  where: { season_id: fantasySeason.season.season_id },
                  select: {
                    goals: true,
                    assists: true,
                    matches_played: true,
                  },
                  take: 1,
                },
              },
            },
            match_performances: {
              select: {
                total_points: true,
              },
            },
          },
          orderBy: { selection_order: 'asc' },
        },
      },
    });

    // 팀이 없는 경우
    if (!fantasyTeam) {
      return NextResponse.json(
        { error: '판타지 팀을 찾을 수 없습니다.', hasTeam: false },
        { status: 404 }
      );
    }

    // 편성 마감 확인
    const now = new Date();
    const isLocked = now > new Date(fantasySeason.lock_date);

    // 선수 데이터 포맷팅
    const players = fantasyTeam.player_selections.map((selection) => ({
      player_id: selection.player.player_id,
      name: selection.player.name,
      position: (selection.position as Position) || undefined,
      profile_image_url: selection.player.profile_image_url || undefined,
      jersey_number: selection.player.jersey_number || undefined,
      current_team: selection.player.player_team_history[0]?.team
        ? {
            team_id: selection.player.player_team_history[0].team.team_id,
            team_name: selection.player.player_team_history[0].team.team_name,
            logo:
              selection.player.player_team_history[0].team.logo || undefined,
            primary_color:
              selection.player.player_team_history[0].team.primary_color ||
              undefined,
            secondary_color:
              selection.player.player_team_history[0].team.secondary_color ||
              undefined,
          }
        : undefined,
      season_stats: selection.player.player_season_stats[0]
        ? {
            goals: selection.player.player_season_stats[0].goals || 0,
            assists: selection.player.player_season_stats[0].assists || 0,
            matches_played:
              selection.player.player_season_stats[0].matches_played || 0,
          }
        : { goals: 0, assists: 0, matches_played: 0 },
      points_earned: selection.points_earned,
      match_performances: selection.match_performances,
    }));

    // 응답 데이터 구성
    const responseData = {
      fantasySeason: {
        fantasy_season_id: fantasySeason.fantasy_season_id,
        year: fantasySeason.year,
        month: fantasySeason.month,
        lock_date: fantasySeason.lock_date.toISOString(),
        start_date: fantasySeason.start_date.toISOString(),
        season: {
          season_name: fantasySeason.season.season_name,
          category: fantasySeason.season.category,
        },
      },
      fantasyTeam: {
        fantasy_team_id: fantasyTeam.fantasy_team_id,
        team_name: fantasyTeam.team_name,
        total_points: fantasyTeam.total_points,
      },
      players,
      isLocked,
      hasTeam: true,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('내 팀 조회 중 오류:', error);
    return NextResponse.json(
      { error: '팀 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
