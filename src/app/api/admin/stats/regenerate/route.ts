import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/admin/stats/regenerate - 모든 통계 데이터 재생성
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('season_id');
    const statsType = searchParams.get('type'); // 'all', 'standings', 'player_stats', 'team_stats', 'h2h'

    console.log('통계 재생성 시작:', { seasonId, statsType });

    // 시즌 필터 조건
    const seasonFilter = seasonId ? { season_id: parseInt(seasonId) } : {};

    const results = {
      standings: 0,
      player_season_stats: 0,
      team_season_stats: 0,
      team_seasons: 0,
      h2h_pair_stats: 0,
    };

    // 1. 순위표 (standings) 재생성
    if (statsType === 'all' || statsType === 'standings') {
      console.log('순위표 재생성 중...');

      // 기존 standings 삭제
      await prisma.standing.deleteMany({ where: seasonFilter });

      // 완료된 경기들로부터 순위표 계산
      const matches = await prisma.match.findMany({
        where: {
          ...seasonFilter,
          status: 'completed',
          home_score: { not: null },
          away_score: { not: null },
        },
        include: {
          home_team: true,
          away_team: true,
          season: true,
        },
      });

      // 팀별 통계 계산
      const teamStats = new Map<
        string,
        {
          season_id: number;
          team_id: number;
          matches_played: number;
          wins: number;
          losses: number;
          draws: number;
          goals_for: number;
          goals_against: number;
          goal_difference: number;
          points: number;
        }
      >();

      matches.forEach((match) => {
        // season_id, home_team_id, away_team_id가 null인 경우 건너뛰기
        if (!match.season_id || !match.home_team_id || !match.away_team_id) {
          console.log(
            `Skipping match ${match.match_id} - missing required data: season_id=${match.season_id}, home_team_id=${match.home_team_id}, away_team_id=${match.away_team_id}`
          );
          return;
        }

        const homeKey = `${match.season_id}-${match.home_team_id}`;
        const awayKey = `${match.season_id}-${match.away_team_id}`;

        if (!teamStats.has(homeKey)) {
          teamStats.set(homeKey, {
            season_id: match.season_id,
            team_id: match.home_team_id,
            matches_played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goals_for: 0,
            goals_against: 0,
            goal_difference: 0,
            points: 0,
          });
        }

        if (!teamStats.has(awayKey)) {
          teamStats.set(awayKey, {
            season_id: match.season_id,
            team_id: match.away_team_id,
            matches_played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goals_for: 0,
            goals_against: 0,
            goal_difference: 0,
            points: 0,
          });
        }

        const homeStats = teamStats.get(homeKey);
        const awayStats = teamStats.get(awayKey);

        // homeStats와 awayStats가 undefined일 수 없음을 보장
        if (!homeStats || !awayStats) {
          console.log(`Stats not found for match ${match.match_id}`);
          return;
        }

        // 경기 수 증가
        homeStats.matches_played++;
        awayStats.matches_played++;

        // 득점/실점
        homeStats.goals_for += match.home_score || 0;
        homeStats.goals_against += match.away_score || 0;
        awayStats.goals_for += match.away_score || 0;
        awayStats.goals_against += match.home_score || 0;

        // 승부 판정
        if ((match.home_score || 0) > (match.away_score || 0)) {
          homeStats.wins++;
          homeStats.points += 3;
          awayStats.losses++;
        } else if ((match.home_score || 0) < (match.away_score || 0)) {
          awayStats.wins++;
          awayStats.points += 3;
          homeStats.losses++;
        } else {
          homeStats.draws++;
          awayStats.draws++;
          homeStats.points += 1;
          awayStats.points += 1;
        }

        // 골차 계산
        homeStats.goal_difference =
          homeStats.goals_for - homeStats.goals_against;
        awayStats.goal_difference =
          awayStats.goals_for - awayStats.goals_against;
      });

      // standings 테이블에 저장
      for (const [, stats] of Array.from(teamStats.entries())) {
        await prisma.standing.create({
          data: {
            season_id: stats.season_id,
            team_id: stats.team_id,
            position: 1, // 임시값, 나중에 정렬 후 업데이트
            matches_played: stats.matches_played,
            wins: stats.wins,
            draws: stats.draws,
            losses: stats.losses,
            goals_for: stats.goals_for,
            goals_against: stats.goals_against,
            goal_difference: stats.goal_difference,
            points: stats.points,
          },
        });
      }

      // 순위 계산 및 업데이트
      const seasons = await prisma.season.findMany({
        where: seasonFilter,
      });

      for (const season of seasons) {
        const standings = await prisma.standing.findMany({
          where: { season_id: season.season_id },
          orderBy: [
            { points: 'desc' },
            { goal_difference: 'desc' },
            { goals_for: 'desc' },
          ],
        });

        for (let i = 0; i < standings.length; i++) {
          const seasonId = standings[i].season_id;
          const teamId = standings[i].team_id;
          if (seasonId && teamId) {
            await prisma.standing.update({
              where: {
                season_id_team_id: {
                  season_id: seasonId,
                  team_id: teamId,
                },
              },
              data: { position: i + 1 },
            });
          }
        }
      }

      results.standings = teamStats.size;
    }

    // 2. 선수 시즌 통계 재생성
    if (statsType === 'all' || statsType === 'player_stats') {
      console.log('선수 시즌 통계 재생성 중...');

      // 기존 playerSeasonStats 삭제
      await prisma.playerSeasonStats.deleteMany({ where: seasonFilter });

      // 간단한 선수 통계 생성 (기본값으로)
      const playerStats = await prisma.playerSeasonStats.findMany({
        where: seasonFilter,
      });

      // 기존 데이터 삭제 후 기본 데이터 생성
      for (const stat of playerStats) {
        await prisma.playerSeasonStats.create({
          data: {
            season_id: stat.season_id,
            player_id: stat.player_id,
            team_id: stat.team_id,
            matches_played: 0,
            goals: 0,
            assists: 0,
            yellow_cards: 0,
            red_cards: 0,
          },
        });
      }

      results.player_season_stats = playerStats.length;
    }

    // 3. 팀 시즌 통계 재생성
    if (statsType === 'all' || statsType === 'team_stats') {
      console.log('팀 시즌 통계 재생성 중...');

      // 기존 teamSeasonStats 삭제
      await prisma.teamSeasonStats.deleteMany({ where: seasonFilter });

      // 팀별 시즌 통계 계산 (standings 기반)
      const standings = await prisma.standing.findMany({
        where: seasonFilter,
      });

      for (const standing of standings) {
        await prisma.teamSeasonStats.create({
          data: {
            season_id: standing.season_id,
            team_id: standing.team_id,
            matches_played: standing.matches_played,
            wins: standing.wins,
            draws: standing.draws,
            losses: standing.losses,
            goals_for: standing.goals_for,
            goals_against: standing.goals_against,
            points: standing.points,
          },
        });
      }

      results.team_season_stats = standings.length;
    }

    // 4. 팀-시즌 관계 재생성
    if (statsType === 'all' || statsType === 'team_seasons') {
      console.log('팀-시즌 관계 재생성 중...');

      // 기존 teamSeason 삭제
      await prisma.teamSeason.deleteMany({ where: seasonFilter });

      // 팀별 시즌 참가 정보 생성
      const teamSeasons = new Set<string>();

      const matches = await prisma.match.findMany({
        where: {
          ...seasonFilter,
          home_team_id: { not: null },
          away_team_id: { not: null },
        },
        select: {
          season_id: true,
          home_team_id: true,
          away_team_id: true,
        },
      });

      matches.forEach((match) => {
        if (match.season_id && match.home_team_id && match.away_team_id) {
          teamSeasons.add(`${match.season_id}-${match.home_team_id}`);
          teamSeasons.add(`${match.season_id}-${match.away_team_id}`);
        }
      });

      for (const teamSeasonKey of Array.from(teamSeasons)) {
        const [seasonId, teamId] = teamSeasonKey.split('-').map(Number);
        await prisma.teamSeason.create({
          data: {
            season_id: seasonId,
            team_id: teamId,
          },
        });
      }

      results.team_seasons = teamSeasons.size;
    }

    // 5. 상대전적 통계 재생성
    if (statsType === 'all' || statsType === 'h2h') {
      console.log('상대전적 통계 재생성 중...');

      // 기존 h2hPairStats 삭제
      await prisma.h2hPairStats.deleteMany();

      // 완료된 경기들로부터 상대전적 계산
      const matches = await prisma.match.findMany({
        where: {
          ...seasonFilter,
          status: 'completed',
          home_score: { not: null },
          away_score: { not: null },
        },
      });

      const h2hStats = new Map<
        string,
        {
          season_id: number;
          team1_id: number;
          team2_id: number;
          team1_wins: number;
          team2_wins: number;
          draws: number;
          team1_goals: number;
          team2_goals: number;
        }
      >();

      matches.forEach((match) => {
        // season_id, home_team_id, away_team_id가 null인 경우 건너뛰기
        if (!match.season_id || !match.home_team_id || !match.away_team_id) {
          console.log(
            `Skipping match ${match.match_id} for h2h stats - missing required data: season_id=${match.season_id}, home_team_id=${match.home_team_id}, away_team_id=${match.away_team_id}`
          );
          return;
        }

        const team1 = Math.min(match.home_team_id, match.away_team_id);
        const team2 = Math.max(match.home_team_id, match.away_team_id);
        const key = `${match.season_id}-${team1}-${team2}`;

        if (!h2hStats.has(key)) {
          h2hStats.set(key, {
            season_id: match.season_id,
            team1_id: team1,
            team2_id: team2,
            team1_wins: 0,
            team2_wins: 0,
            draws: 0,
            team1_goals: 0,
            team2_goals: 0,
          });
        }

        const stats = h2hStats.get(key);
        if (!stats) return;

        let team1Score, team2Score;
        if (match.home_team_id === team1) {
          team1Score = match.home_score || 0;
          team2Score = match.away_score || 0;
        } else {
          team1Score = match.away_score || 0;
          team2Score = match.home_score || 0;
        }

        stats.team1_goals += team1Score;
        stats.team2_goals += team2Score;

        if (team1Score > team2Score) {
          stats.team1_wins++;
        } else if (team1Score < team2Score) {
          stats.team2_wins++;
        } else {
          stats.draws++;
        }
      });

      for (const [, stats] of Array.from(h2hStats.entries())) {
        await prisma.h2hPairStats.create({
          data: {
            team_small_id: stats.team1_id,
            team_large_id: stats.team2_id,
            total_matches: stats.team1_wins + stats.team2_wins + stats.draws,
            small_wins: stats.team1_wins,
            large_wins: stats.team2_wins,
            draws: stats.draws,
            small_goals: stats.team1_goals,
            large_goals: stats.team2_goals,
          },
        });
      }

      results.h2h_pair_stats = h2hStats.size;
    }

    console.log('통계 재생성 완료:', results);

    return NextResponse.json({
      message: '통계 재생성이 완료되었습니다.',
      results,
      season_id: seasonId ? parseInt(seasonId) : null,
      type: statsType,
    });
  } catch (error) {
    console.error('통계 재생성 실패:', error);
    return NextResponse.json(
      {
        error: '통계 재생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
