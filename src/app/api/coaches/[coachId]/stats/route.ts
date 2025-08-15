import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const { coachId } = await params;
    const coachIdNum = parseInt(coachId);

    if (isNaN(coachIdNum)) {
      return NextResponse.json({ error: 'Invalid coach ID' }, { status: 400 });
    }

    // 코치의 모든 매치 데이터 가져오기 (헤드코치만 집계)
    const matchCoaches = await prisma.matchCoach.findMany({
      where: { coach_id: coachIdNum, role: 'head' },
      include: {
        match: {
          include: {
            home_team: true,
            away_team: true,
            season: true,
          },
        },
        team: true,
      },
      orderBy: {
        match: {
          match_date: 'asc',
        },
      },
    });

    // 시즌별 통계 계산
    const seasonStats = new Map<
      number,
      {
        season_id: number;
        season_name: string;
        matches_played: number;
        wins: number;
        draws: number;
        losses: number;
        goals_for: number;
        goals_against: number;
        teams: Set<string>;
        teamIds: Set<number>;
        position?: number | null;
      }
    >();
    const uniqueMatchIds = new Set<number>();

    for (const matchCoach of matchCoaches) {
      const { match, team } = matchCoach;
      if (match?.match_id) uniqueMatchIds.add(match.match_id);
      const seasonId = match.season_id;
      const seasonName = match.season?.season_name || 'Unknown';

      // 시즌 ID가 없으면 건너뛴다
      if (seasonId == null) {
        continue;
      }

      if (!seasonStats.has(seasonId)) {
        seasonStats.set(seasonId, {
          season_id: seasonId,
          season_name: seasonName,
          matches_played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goals_for: 0,
          goals_against: 0,
          teams: new Set(),
          teamIds: new Set<number>(),
          position: null,
        });
      }

      const stats = seasonStats.get(seasonId)!;
      stats.matches_played++;

      // 승패 계산 (무승부 없음: 동점이면 승부차기 결과로 승/패 결정)
      const isHomeTeam = match.home_team_id === team.team_id;
      const teamScore = isHomeTeam ? match.home_score : match.away_score;
      const opponentScore = isHomeTeam ? match.away_score : match.home_score;
      const pkTeam = isHomeTeam
        ? match.penalty_home_score
        : match.penalty_away_score;
      const pkOpp = isHomeTeam
        ? match.penalty_away_score
        : match.penalty_home_score;

      if (teamScore !== null && opponentScore !== null) {
        if (teamScore > opponentScore) {
          stats.wins++;
        } else if (teamScore < opponentScore) {
          stats.losses++;
        } else {
          // 정규시간 동점 → 승부차기 결과로 승/패 판단
          if (pkTeam !== null && pkOpp !== null) {
            if (pkTeam > pkOpp) {
              stats.wins++;
            } else if (pkTeam < pkOpp) {
              stats.losses++;
            } else {
              // 이론상 발생하지 않지만, 방어적으로 무시
            }
          } else {
            // 데이터 누락 시에는 보수적으로 무시 (draws 증가하지 않음)
          }
        }

        stats.goals_for += teamScore;
        stats.goals_against += opponentScore;
      }

      stats.teams.add(team.team_name);
      if (team.team_id != null) {
        stats.teamIds.add(team.team_id);
      }
    }

    // 통계 정리
    const statsArray = Array.from(seasonStats.values()).map((stats) => ({
      ...stats,
      teams: Array.from(stats.teams),
      points: stats.wins * 3 + stats.draws,
      win_rate:
        stats.matches_played > 0
          ? Math.round((stats.wins / stats.matches_played) * 100)
          : 0,
      goal_difference: stats.goals_for - stats.goals_against,
    }));

    // 시즌별 순위 계산: 해당 시즌에 코치가 지휘한 팀들의 standings 중 가장 높은 순위(숫자 최소)
    await Promise.all(
      statsArray.map(async (s) => {
        const teamIds = Array.from(s.teamIds);
        if (teamIds.length === 0) {
          s.position = null;
          return;
        }
        const rows = await prisma.standing.findMany({
          where: {
            season_id: s.season_id,
            team_id: { in: teamIds },
          },
          select: { position: true },
        });
        const positions = rows
          .map((r) => r.position)
          .filter((p): p is number => typeof p === 'number');
        s.position = positions.length > 0 ? Math.min(...positions) : null;
      })
    );

    // 시즌별로 정렬: season_id 기준 (오름차순)
    statsArray.sort((a, b) => a.season_id - b.season_id);

    // 총 경기 수는 안전하게 고유 match_id 기준으로 계산
    const total_matches = uniqueMatchIds.size;

    return NextResponse.json({
      coach_id: coachIdNum,
      season_stats: statsArray,
      total_matches,
    });
  } catch (error) {
    console.error('Error fetching coach stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coach stats' },
      { status: 500 }
    );
  }
}
