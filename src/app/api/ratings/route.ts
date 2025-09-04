import { NextRequest, NextResponse } from 'next/server';

import type {
  CreateRatingRequest,
  PlayerAbilityRating,
  RatingListResponse,
} from '@/features/player-ratings/types';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Aggregate 데이터 업데이트 함수
async function updatePlayerAbilityAggregate(
  playerId: number,
  seasonId: number | null
) {
  try {
    // 해당 선수/시즌의 모든 평가 조회
    const ratings = await prisma.playerAbilityRating.findMany({
      where: {
        player_id: playerId,
        season_id: seasonId,
      },
    });

    if (ratings.length === 0) return;

    // 평균 계산
    const abilityFields = [
      'finishing',
      'shot_power',
      'shot_accuracy',
      'heading',
      'short_passing',
      'long_passing',
      'vision',
      'crossing',
      'dribbling',
      'ball_control',
      'agility',
      'balance',
      'marking',
      'tackling',
      'interceptions',
      'defensive_heading',
      'speed',
      'acceleration',
      'stamina',
      'strength',
      'determination',
      'work_rate',
      'leadership',
      'composure',
      'reflexes',
      'diving',
      'handling',
      'kicking',
      'overall_rating',
    ];

    const aggregateData: Record<string, number> = {};

    for (const field of abilityFields) {
      const values = ratings
        .map((r) => r[field as keyof typeof r] as number)
        .filter((v) => v !== null && v !== undefined);

      if (values.length > 0) {
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        aggregateData[`avg_${field}`] = Math.round(avg * 100) / 100; // 소수점 2자리
      }
    }

    // Aggregate 데이터 upsert
    const whereClause = seasonId
      ? { player_id_season_id: { player_id: playerId, season_id: seasonId } }
      : { player_id: playerId };

    await prisma.playerAbilityAggregate.upsert({
      where: whereClause,
      update: {
        ...aggregateData,
        total_ratings: ratings.length,
        last_updated: new Date(),
      },
      create: {
        player_id: playerId,
        season_id: seasonId,
        ...aggregateData,
        total_ratings: ratings.length,
        last_updated: new Date(),
      },
    });

    console.log(
      `✅ Aggregate updated for player ${playerId}, season ${seasonId}`
    );
  } catch (error) {
    console.error('Error updating aggregate:', error);
  }
}

// GET - 선수 능력치 평가 목록 조회
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const playerId = url.searchParams.get('player_id');
    const userId = url.searchParams.get('user_id');
    const seasonId = url.searchParams.get('season_id');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sortBy = url.searchParams.get('sort_by') || 'created_at';
    const order = url.searchParams.get('order') || 'desc';

    const where: {
      player_id?: number;
      user_id?: string;
      season_id?: number | null;
    } = {};

    if (playerId) {
      where.player_id = parseInt(playerId);
    }

    if (userId) {
      where.user_id = userId;
    }

    if (seasonId && seasonId !== 'all') {
      where.season_id = parseInt(seasonId);
    }

    const [ratings, totalCount] = await Promise.all([
      prisma.playerAbilityRating.findMany({
        where,
        include: {
          player: {
            select: {
              player_id: true,
              name: true,
              profile_image_url: true,
            },
          },
          user: {
            select: {
              user_id: true,
              korean_nickname: true,
              profile_image_url: true,
            },
          },
          season: {
            select: {
              season_id: true,
              season_name: true,
            },
          },
        },
        orderBy: {
          [sortBy]: order as 'asc' | 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.playerAbilityRating.count({ where }),
    ]);

    // Helper function to convert null to undefined
    const convertNullToUndefined = <T>(obj: T): T => {
      if (obj === null) return undefined as T;
      if (typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(convertNullToUndefined) as T;

      const converted: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(
        obj as Record<string, unknown>
      )) {
        converted[key] =
          value === null
            ? undefined
            : typeof value === 'object'
              ? convertNullToUndefined(value)
              : value;
      }
      return converted as T;
    };

    const response: RatingListResponse = {
      ratings: ratings.map(
        (rating) =>
          convertNullToUndefined({
            ...rating,
            player: {
              ...rating.player,
              profile_image_url: rating.player.profile_image_url ?? undefined,
            },
            user: {
              ...rating.user,
              profile_image_url: rating.user.profile_image_url ?? undefined,
            },
            created_at: rating.created_at.toISOString(),
            updated_at: rating.updated_at.toISOString(),
          }) as PlayerAbilityRating
      ),
      total_count: totalCount,
      page,
      per_page: limit,
      total_pages: Math.ceil(totalCount / limit),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching player ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player ratings' },
      { status: 500 }
    );
  }
}

// POST - 새로운 선수 능력치 평가 생성
export async function POST(request: NextRequest) {
  try {
    const data: CreateRatingRequest = await request.json();

    // 기본 검증
    if (!data.player_id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // 사용자 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = user.userId;

    // 동일한 사용자가 같은 선수/시즌에 대해 이미 평가했는지 확인
    const checkSeasonId = data.season_id ?? null;
    const existingRating = checkSeasonId
      ? await prisma.playerAbilityRating.findUnique({
          where: {
            player_id_user_id_season_id: {
              player_id: data.player_id,
              user_id: userId,
              season_id: checkSeasonId,
            },
          },
        })
      : await prisma.playerAbilityRating.findFirst({
          where: {
            player_id: data.player_id,
            user_id: userId,
            season_id: null,
          },
        });

    if (existingRating) {
      return NextResponse.json(
        { error: 'You have already rated this player for this season' },
        { status: 409 }
      );
    }

    // 능력치 값 검증 (1-99 범위)
    const abilityFields = [
      'finishing',
      'shot_power',
      'shot_accuracy',
      'heading',
      'short_passing',
      'long_passing',
      'vision',
      'crossing',
      'dribbling',
      'ball_control',
      'agility',
      'balance',
      'marking',
      'tackling',
      'interceptions',
      'defensive_heading',
      'speed',
      'acceleration',
      'stamina',
      'strength',
      'determination',
      'work_rate',
      'leadership',
      'composure',
      'reflexes',
      'diving',
      'handling',
      'kicking',
      'overall_rating',
    ];

    for (const field of abilityFields) {
      const value = data[field as keyof CreateRatingRequest] as number;
      if (value !== undefined && (value < 1 || value > 99)) {
        return NextResponse.json(
          { error: `${field} must be between 1 and 99` },
          { status: 400 }
        );
      }
    }

    // 선수 존재 확인
    const player = await prisma.player.findUnique({
      where: { player_id: data.player_id },
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // 평가 생성
    const rating = await prisma.playerAbilityRating.create({
      data: {
        ...data,
        user_id: userId,
      },
      include: {
        player: {
          select: {
            player_id: true,
            name: true,
            profile_image_url: true,
          },
        },
        user: {
          select: {
            user_id: true,
            korean_nickname: true,
            profile_image_url: true,
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

    // 평가 제출 후 Aggregate 데이터 자동 업데이트
    await updatePlayerAbilityAggregate(data.player_id, data.season_id ?? null);

    // Helper function to convert null to undefined (reused)
    const convertNullToUndefined = <T>(obj: T): T => {
      if (obj === null) return undefined as T;
      if (typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(convertNullToUndefined) as T;

      const converted: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(
        obj as Record<string, unknown>
      )) {
        converted[key] =
          value === null
            ? undefined
            : typeof value === 'object'
              ? convertNullToUndefined(value)
              : value;
      }
      return converted as T;
    };

    return NextResponse.json(
      convertNullToUndefined({
        ...rating,
        player: {
          ...rating.player,
          profile_image_url: rating.player.profile_image_url ?? undefined,
        },
        user: {
          ...rating.user,
          profile_image_url: rating.user.profile_image_url ?? undefined,
        },
        created_at: rating.created_at.toISOString(),
        updated_at: rating.updated_at.toISOString(),
      })
    );
  } catch (error) {
    console.error('Error creating player rating:', error);
    return NextResponse.json(
      { error: 'Failed to create player rating' },
      { status: 500 }
    );
  }
}
