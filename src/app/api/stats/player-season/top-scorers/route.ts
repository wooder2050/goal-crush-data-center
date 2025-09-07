import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/stats/player-season/top-scorers - 전체 커리어 누적 득점왕 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // 모든 선수의 시즌별 통계를 가져와서 커리어 합계 계산
    const stats = await prisma.playerSeasonStats.findMany({
      include: {
        player: {
          select: {
            player_id: true,
            name: true,
          },
        },
        team: {
          select: {
            team_id: true,
            team_name: true,
            logo: true,
          },
        },
        season: {
          select: {
            season_id: true,
            season_name: true,
          },
        },
      },
    });

    // 선수별로 커리어 통계 집계
    const playerCareerStats = new Map();

    stats.forEach((stat) => {
      const playerId = stat.player?.player_id;
      if (!playerId) return;

      if (!playerCareerStats.has(playerId)) {
        playerCareerStats.set(playerId, {
          player_id: playerId,
          player_name: stat.player?.name || '',
          total_goals: 0,
          total_assists: 0,
          total_matches_played: 0,
          teams: new Set(),
          team_logos: new Set(),
          seasons: new Set(),
          latest_team_name: '',
          latest_team_logo: '',
        });
      }

      const playerStats = playerCareerStats.get(playerId);
      playerStats.total_goals += stat.goals || 0;
      playerStats.total_assists += stat.assists || 0;
      playerStats.total_matches_played += stat.matches_played || 0;

      if (stat.team?.team_name) {
        playerStats.teams.add(stat.team.team_name);
        playerStats.latest_team_name = stat.team.team_name; // 마지막 팀을 대표 팀으로
      }

      if (stat.team?.logo) {
        playerStats.team_logos.add(stat.team.logo);
        playerStats.latest_team_logo = stat.team.logo;
      }

      if (stat.season?.season_name) {
        playerStats.seasons.add(stat.season.season_name);
      }
    });

    // 득점 순으로 정렬하고 상위 N명만 선택
    const topScorers = Array.from(playerCareerStats.values())
      .sort((a, b) => b.total_goals - a.total_goals)
      .slice(0, limit)
      .map((player) => ({
        player_id: player.player_id,
        player_name: player.player_name,
        team_name: player.latest_team_name,
        team_logo: player.latest_team_logo,
        goals: player.total_goals,
        assists: player.total_assists,
        matches_played: player.total_matches_played,
        total_teams: Array.from(player.teams).length,
        total_seasons: Array.from(player.seasons).length,
      }));

    return NextResponse.json(topScorers);
  } catch (error) {
    console.error('Error fetching career top scorers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career top scorers' },
      { status: 500 }
    );
  }
}
