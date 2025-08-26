import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/teams - 모든 팀 조회
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { team_name: 'asc' },
      select: {
        team_id: true,
        team_name: true,
        logo: true,
      },
    });

    return NextResponse.json({ data: teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
