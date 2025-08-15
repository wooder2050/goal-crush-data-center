import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const name = searchParams.get('name');

    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : 20;

    const whereName = name
      ? {
          name: {
            contains: name,
            mode: 'insensitive' as const,
          },
        }
      : undefined;

    const totalCount = await prisma.player.count({ where: whereName });

    const players = await prisma.player.findMany({
      select: {
        player_id: true,
        name: true,
        jersey_number: true,
        profile_image_url: true,
        player_team_history: {
          select: {
            team: { select: { team_id: true, team_name: true } },
            end_date: true,
            created_at: true,
            season_id: true,
          },
          orderBy: [{ end_date: 'asc' }, { created_at: 'desc' }],
          take: 1,
        },
        playerPosition: {
          select: {
            position: true,
            season_id: true,
            start_date: true,
            end_date: true,
          },
          orderBy: [{ end_date: 'desc' }, { start_date: 'desc' }],
          take: 1,
        },
        created_at: true,
        updated_at: true,
      },
      where: whereName,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const teamIds = Array.from(
      new Set(
        players
          .map((p) => p.player_team_history?.[0]?.team?.team_id)
          .filter((v): v is number => typeof v === 'number')
      )
    );

    const teamLogos = teamIds.length
      ? await prisma.team.findMany({
          where: { team_id: { in: teamIds } },
          select: { team_id: true, logo: true },
        })
      : [];
    const teamLogoMap = new Map<number, string | null>();
    for (let i = 0; i < teamLogos.length; i++) {
      teamLogoMap.set(teamLogos[i].team_id, teamLogos[i].logo ?? null);
    }

    const items = players.map((p) => {
      const baseTeam = p.player_team_history?.[0]?.team ?? null;
      const team = baseTeam
        ? {
            team_id: baseTeam.team_id,
            team_name: baseTeam.team_name,
            logo: teamLogoMap.get(baseTeam.team_id) ?? null,
          }
        : null;
      const latestPosition = p.playerPosition?.[0]?.position ?? null;
      return {
        player_id: p.player_id,
        name: p.name,
        jersey_number: p.jersey_number,
        profile_image_url: p.profile_image_url,
        team,
        position: latestPosition,
        created_at: p.created_at,
        updated_at: p.updated_at,
      };
    });

    const hasMore = page * limit < totalCount;
    const nextPage = hasMore ? page + 1 : null;

    return NextResponse.json({ items, nextPage });
  } catch (error) {
    console.error('Error fetching players page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players page' },
      { status: 500 }
    );
  }
}
