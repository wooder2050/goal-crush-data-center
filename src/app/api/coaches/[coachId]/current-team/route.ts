import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type CurrentTeamRow = {
  team_id: number;
  team_name: string;
  logo: string | null;
  coach_id: number;
  coach_name: string;
  nationality: string | null;
  profile_image_url: string | null;
  last_match_date: Date;
};

export async function GET(
  _request: Request,
  { params }: { params: { coachId: string } }
) {
  const coachIdNum = Number(params.coachId);
  if (Number.isNaN(coachIdNum)) {
    return NextResponse.json({ error: 'Invalid coachId' }, { status: 400 });
  }

  const rows = await prisma.$queryRaw<CurrentTeamRow[]>`
		SELECT team_id, team_name, logo, coach_id, coach_name, nationality, profile_image_url, last_match_date
		FROM public.team_current_head_coach
		WHERE coach_id = ${coachIdNum}
		LIMIT 1
	`;

  const current = rows[0] ?? null;
  return NextResponse.json(current);
}
