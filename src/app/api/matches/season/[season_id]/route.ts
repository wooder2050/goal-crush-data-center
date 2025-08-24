import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

interface TeamSeasonNameResult {
  team_id: number;
  team_name: string;
}

// Prisma 클라이언트에 teamSeasonName 메서드가 없는 문제를 해결하기 위한 타입 확장
interface ExtendedPrismaClient {
  teamSeasonName: {
    findMany: (args: {
      where: {
        team_id: { in: number[] };
        season_id: number;
      };
      select: {
        team_id: boolean;
        team_name: boolean;
      };
    }) => Promise<TeamSeasonNameResult[]>;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { season_id: string } }
) {
  try {
    const seasonId = parseInt(params.season_id);
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    if (isNaN(seasonId)) {
      return NextResponse.json({ error: 'Invalid season ID' }, { status: 400 });
    }

    // 페이지네이션 파라미터 처리
    const pageNum = page ? parseInt(page) : undefined;
    const limitNum = limit ? parseInt(limit) : undefined;
    const isPaginated = pageNum && limitNum;

    // 페이지네이션이 요청된 경우 총 개수도 조회
    const [matches, totalCount] = await Promise.all([
      prisma.match.findMany({
        where: { season_id: seasonId },
        include: {
          home_team: true,
          away_team: true,
          season: true,
        },
        orderBy: {
          match_date: 'asc',
        },
        ...(isPaginated && {
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
        }),
      }),
      isPaginated
        ? prisma.match.count({ where: { season_id: seasonId } })
        : Promise.resolve(0),
    ]);

    if (matches.length === 0) {
      return NextResponse.json(
        isPaginated
          ? {
              items: [],
              totalCount: 0,
              currentPage: pageNum,
              hasNextPage: false,
              nextPage: null,
            }
          : []
      );
    }

    // 모든 팀 ID 수집
    const teamIds = matches.flatMap((match) => [
      match.home_team_id!,
      match.away_team_id!,
    ]);

    // 시즌별 팀명을 한 번에 조회 - Prisma 관계 쿼리 사용
    const teamSeasonNames = await (
      prisma as unknown as ExtendedPrismaClient
    ).teamSeasonName.findMany({
      where: {
        team_id: { in: teamIds },
        season_id: seasonId,
      },
      select: {
        team_id: true,
        team_name: true,
      },
    });

    // 팀별로 매핑
    const teamNameMap = new Map(
      teamSeasonNames.map((t: TeamSeasonNameResult) => [t.team_id, t.team_name])
    );

    // 각 경기에 대해 시즌별 팀명 적용 (logo는 스프레드로 그대로 유지)
    const updatedMatches = matches.map((match) => {
      const { highlight_url = null, full_video_url = null } = match as {
        highlight_url?: string | null;
        full_video_url?: string | null;
      };
      return {
        ...match,
        highlight_url,
        full_video_url,
        home_team: match.home_team
          ? {
              ...match.home_team,
              team_name:
                teamNameMap.get(match.home_team_id!) ||
                match.home_team.team_name,
            }
          : null,
        away_team: match.away_team
          ? {
              ...match.away_team,
              team_name:
                teamNameMap.get(match.away_team_id!) ||
                match.away_team.team_name,
            }
          : null,
      };
    });

    // 페이지네이션 응답 또는 일반 응답
    if (isPaginated) {
      const hasNextPage = pageNum * limitNum < totalCount;
      const nextPage = hasNextPage ? pageNum + 1 : null;

      return NextResponse.json({
        items: updatedMatches,
        totalCount,
        currentPage: pageNum,
        hasNextPage,
        nextPage,
      });
    } else {
      return NextResponse.json(updatedMatches);
    }
  } catch (error) {
    console.error('Failed to fetch matches by season:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches by season' },
      { status: 500 }
    );
  }
}
