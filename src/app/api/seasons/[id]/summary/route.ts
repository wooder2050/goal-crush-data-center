import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// 타입 정의
type MatchSummary = {
  match_id: number;
  status: string | null;
  penalty_home_score: number | null;
  penalty_away_score: number | null;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seasonId = parseInt(params.id);

    if (isNaN(seasonId)) {
      return NextResponse.json({ error: 'Invalid season ID' }, { status: 400 });
    }

    // Get season details
    const season = await prisma.season.findUnique({
      where: { season_id: seasonId },
      include: {
        matches: {
          select: {
            match_id: true,
            status: true,
            penalty_home_score: true,
            penalty_away_score: true,
          },
        },
        team_seasons: {
          include: {
            team: {
              select: {
                team_id: true,
                team_name: true,
              },
            },
          },
        },
      },
    });

    if (!season) {
      return NextResponse.json({ error: 'Season not found' }, { status: 404 });
    }

    // Calculate summary statistics
    const totalMatches = season.matches.length;
    const completedMatches = season.matches.filter(
      (match: MatchSummary) => match.status === 'completed'
    ).length;
    const penaltyMatches = season.matches.filter(
      (match: MatchSummary) =>
        match.penalty_home_score !== null || match.penalty_away_score !== null
    ).length;
    const participatingTeams = season.team_seasons.length;
    const completionRate =
      totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

    const seasonSummary = {
      season_id: season.season_id,
      season_name: season.season_name,
      year: season.year,
      total_matches: totalMatches,
      participating_teams: participatingTeams,
      completed_matches: completedMatches,
      penalty_matches: penaltyMatches,
      completion_rate: Math.round(completionRate * 100) / 100, // 소수점 2자리까지
    };

    return NextResponse.json([seasonSummary]);
  } catch (error) {
    console.error('Error fetching season summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch season summary' },
      { status: 500 }
    );
  }
}
