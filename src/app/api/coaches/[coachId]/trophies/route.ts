import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

function isLeague(category: string | null) {
  return (
    category === 'G_LEAGUE' ||
    category === 'SUPER_LEAGUE' ||
    category === 'CHALLENGE_LEAGUE' ||
    category === 'PLAYOFF' ||
    category === 'OTHER'
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const { coachId } = await params;
    const coachIdNum = Number(coachId);
    if (Number.isNaN(coachIdNum)) {
      return NextResponse.json({ error: 'Invalid coach ID' }, { status: 400 });
    }

    // 우승 기록: standings에서 1위, 시즌 카테고리 포함
    const wins = await prisma.standing.findMany({
      where: { position: 1 },
      include: {
        season: true,
        team: true,
      },
    });

    // 코치가 해당 시즌, 해당 팀의 헤드코치였는지 확인 (match_coach 기준)
    const items: Array<{
      season_id: number;
      season_name: string;
      category: string | null;
    }> = [];
    for (const w of wins) {
      const count = await prisma.matchCoach.count({
        where: {
          coach_id: coachIdNum,
          role: 'head',
          team_id: w.team_id ?? undefined,
          match: { season_id: w.season_id ?? undefined },
        },
      });
      if (count > 0) {
        items.push({
          season_id: w.season_id!,
          season_name: w.season?.season_name ?? 'Unknown',
          category:
            (w.season as { category?: string } | null)?.category ?? null,
        });
      }
    }

    // 조별리그(이름에 '조별'), 플레이오프, 챌린지리그 제외
    const filtered = items.filter((it) => {
      if (!it) return false;
      if (it.season_name?.includes('조별')) return false;
      if (it.category === 'PLAYOFF' || it.category === 'CHALLENGE_LEAGUE')
        return false;
      return true;
    });

    const league_wins = filtered.filter((i) => isLeague(i.category)).length;
    const cup_wins = filtered.length - league_wins;

    return NextResponse.json({
      coach_id: coachIdNum,
      total: filtered.length,
      league_wins,
      cup_wins,
      items: filtered,
    });
  } catch (error) {
    console.error('Failed to fetch trophies', error);
    return NextResponse.json(
      { error: 'Failed to fetch trophies' },
      { status: 500 }
    );
  }
}
