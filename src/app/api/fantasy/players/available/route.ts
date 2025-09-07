import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  FormattedPlayer,
  GetPlayersDataResponse,
  PlayerData,
} from '@/types/fantasy-pages';

// 선수 데이터 포맷팅 함수
const formatPlayer = (player: PlayerData): FormattedPlayer => ({
  player_id: player.player_id,
  name: player.name,
  profile_image_url: player.profile_image_url || undefined,
  jersey_number: player.jersey_number || undefined,
  current_team: player.player_team_history[0]?.team
    ? {
        team_id: player.player_team_history[0].team.team_id,
        team_name: player.player_team_history[0].team.team_name,
        logo: player.player_team_history[0].team.logo || undefined,
        primary_color:
          player.player_team_history[0].team.primary_color || undefined,
        secondary_color:
          player.player_team_history[0].team.secondary_color || undefined,
      }
    : undefined,
  season_stats: player.player_season_stats[0]
    ? {
        goals: player.player_season_stats[0].goals || 0,
        assists: player.player_season_stats[0].assists || 0,
        matches_played: player.player_season_stats[0].matches_played || 0,
      }
    : { goals: 0, assists: 0, matches_played: 0 },
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('season_id');
    const fantasySeasonId = searchParams.get('fantasy_season_id');

    if (!seasonId || !fantasySeasonId) {
      return NextResponse.json(
        { error: 'season_id and fantasy_season_id are required' },
        { status: 400 }
      );
    }

    const seasonIdNum = parseInt(seasonId);
    const fantasySeasonIdNum = parseInt(fantasySeasonId);

    if (isNaN(seasonIdNum) || isNaN(fantasySeasonIdNum)) {
      return NextResponse.json(
        { error: 'Invalid season_id or fantasy_season_id' },
        { status: 400 }
      );
    }

    // 현재 시즌의 활성 선수들 조회
    const availablePlayers = await prisma.player.findMany({
      include: {
        player_team_history: {
          where: {
            season_id: seasonIdNum,
            is_active: true,
          },
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
        },
        player_season_stats: {
          where: { season_id: seasonIdNum },
          select: {
            goals: true,
            assists: true,
            matches_played: true,
          },
        },
      },
    });

    // AI 추천 선수들 조회
    const recommendations = await prisma.fantasyAIRecommendation.findMany({
      where: { fantasy_season_id: fantasySeasonIdNum },
      include: {
        player: {
          include: {
            player_team_history: {
              where: {
                season_id: seasonIdNum,
                is_active: true,
              },
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
            },
            player_season_stats: {
              where: { season_id: seasonIdNum },
              select: {
                goals: true,
                assists: true,
                matches_played: true,
              },
            },
          },
        },
      },
      orderBy: { recommendation_score: 'desc' },
      take: 20,
    });

    const formattedPlayers = availablePlayers
      .filter((player) => player.player_team_history.length > 0) // 현재 팀이 있는 선수만
      .map(formatPlayer);

    const recommendedPlayers = recommendations
      .map((rec) => formatPlayer(rec.player))
      .filter((player) => player.current_team); // 현재 팀이 있는 추천 선수만

    const response: GetPlayersDataResponse = {
      availablePlayers: formattedPlayers,
      recommendedPlayers,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching available players:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
