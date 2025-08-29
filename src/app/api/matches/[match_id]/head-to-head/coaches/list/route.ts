import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { match_id: string } }
) {
  try {
    const url = new URL(_request.url);
    const scope = (url.searchParams.get('scope') || 'prev') as 'prev' | 'next';
    const matchId = Number(params.match_id);
    if (Number.isNaN(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const match = await prisma.match.findUnique({
      where: { match_id: matchId },
      select: {
        match_id: true,
        match_date: true,
        home_team_id: true,
        away_team_id: true,
        home_coach_id: true,
        away_coach_id: true,
        home_coach: { select: { coach_id: true, name: true } },
        away_coach: { select: { coach_id: true, name: true } },
      },
    });

    // match 테이블에 감독 ID가 없는 경우 match_coach 테이블에서 가져오기
    let homeCoachId = match?.home_coach_id;
    let awayCoachId = match?.away_coach_id;
    let homeCoachName = match?.home_coach?.name;
    let awayCoachName = match?.away_coach?.name;

    if (!homeCoachId || !awayCoachId) {
      const matchCoaches = await prisma.matchCoach.findMany({
        where: { match_id: matchId, role: 'head' },
        include: { coach: true, team: true },
      });

      // 홈팀과 원정팀의 감독 찾기
      if (!match) {
        return NextResponse.json({
          total: 0,
          items: [],
          current: {
            home_coach_id: null,
            away_coach_id: null,
            home_coach_name: null,
            away_coach_name: null,
          },
        });
      }

      const homeTeamId = match.home_team_id;
      const awayTeamId = match.away_team_id;

      const homeCoach = matchCoaches.find((mc) => mc.team_id === homeTeamId);
      const awayCoach = matchCoaches.find((mc) => mc.team_id === awayTeamId);

      if (homeCoach && awayCoach) {
        homeCoachId = homeCoach.coach_id;
        awayCoachId = awayCoach.coach_id;
        homeCoachName = homeCoach.coach.name;
        awayCoachName = awayCoach.coach.name;
      }
    }

    if (!homeCoachId || !awayCoachId) {
      return NextResponse.json({
        total: 0,
        items: [],
        current: {
          home_coach_id: null,
          away_coach_id: null,
          home_coach_name: null,
          away_coach_name: null,
        },
      });
    }

    const a = homeCoachId;
    const b = awayCoachId;
    const currentDate = match?.match_date ? new Date(match.match_date) : null;

    const rows = await prisma.match.findMany({
      where: {
        match_id: { not: matchId },
        OR: [
          { home_coach_id: a, away_coach_id: b },
          { home_coach_id: b, away_coach_id: a },
        ],
        ...(currentDate
          ? scope === 'next'
            ? { match_date: { gt: currentDate.toISOString() } }
            : { match_date: { lt: currentDate.toISOString() } }
          : {}),
      },
      include: {
        season: true,
        home_team: true,
        away_team: true,
        home_coach: true,
        away_coach: true,
      },
      orderBy: [{ match_date: 'desc' }],
    });
    const items = rows.map((m) => {
      const usePenalty =
        m.penalty_home_score !== null && m.penalty_away_score !== null;
      return {
        match_id: m.match_id,
        match_date: m.match_date,
        season: m.season
          ? {
              season_id: m.season.season_id,
              season_name: m.season.season_name,
              category: m.season.category,
            }
          : null,
        home: {
          team_id: m.home_team?.team_id ?? null,
          team_name: m.home_team?.team_name ?? null,
          primary_color: m.home_team?.primary_color ?? null,
          secondary_color: m.home_team?.secondary_color ?? null,
          coach_id: m.home_coach?.coach_id ?? null,
          coach_name: m.home_coach?.name ?? null,
        },
        away: {
          team_id: m.away_team?.team_id ?? null,
          team_name: m.away_team?.team_name ?? null,
          primary_color: m.away_team?.primary_color ?? null,
          secondary_color: m.away_team?.secondary_color ?? null,
          coach_id: m.away_coach?.coach_id ?? null,
          coach_name: m.away_coach?.name ?? null,
        },
        score: { home: m.home_score, away: m.away_score },
        penalty: usePenalty
          ? { home: m.penalty_home_score, away: m.penalty_away_score }
          : null,
      };
    });
    return NextResponse.json({
      total: items.length,
      items,
      current: {
        home_coach_id: homeCoachId,
        away_coach_id: awayCoachId,
        home_coach_name: homeCoachName,
        away_coach_name: awayCoachName,
      },
    });
  } catch (error) {
    console.error('Failed to fetch coach head-to-head list', error);
    return NextResponse.json(
      { error: 'Failed to fetch coach head-to-head list' },
      { status: 500 }
    );
  }
}
