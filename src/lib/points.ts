import { checkAndAwardBadges } from './badges';
import { prisma } from './prisma';

export interface PointTransaction {
  user_id: string;
  points_change: number;
  point_type: string;
  reference_id?: number;
  description?: string;
}

/**
 * 사용자에게 포인트를 지급/차감하는 함수
 */
export async function addUserPoints(
  transaction: PointTransaction
): Promise<void> {
  try {
    await prisma.userPoint.create({
      data: {
        user_id: transaction.user_id,
        points_change: transaction.points_change,
        point_type: transaction.point_type,
        reference_id: transaction.reference_id,
        description: transaction.description,
      },
    });

    console.log(
      `포인트 ${transaction.points_change > 0 ? '지급' : '차감'} 완료:`,
      {
        user_id: transaction.user_id,
        points: transaction.points_change,
        type: transaction.point_type,
      }
    );
  } catch (error) {
    console.error('포인트 처리 실패:', error);
    throw new Error('포인트 처리에 실패했습니다.');
  }
}

/**
 * 게시글 작성 포인트 (+10pt)
 */
export async function addPostCreatePoints(
  userId: string,
  postId: number
): Promise<void> {
  await addUserPoints({
    user_id: userId,
    points_change: 10,
    point_type: 'post_create',
    reference_id: postId,
    description: '게시글 작성',
  });

  // 배지 확인 및 부여
  await checkAndAwardBadges(userId);
}

/**
 * 댓글 작성 포인트 (+5pt)
 */
export async function addCommentCreatePoints(
  userId: string,
  commentId: number
): Promise<void> {
  await addUserPoints({
    user_id: userId,
    points_change: 5,
    point_type: 'comment_create',
    reference_id: commentId,
    description: '댓글 작성',
  });

  // 배지 확인 및 부여
  await checkAndAwardBadges(userId);
}

/**
 * 좋아요 받기 포인트 (+2pt)
 */
export async function addLikeReceivedPoints(
  userId: string,
  postId: number
): Promise<void> {
  await addUserPoints({
    user_id: userId,
    points_change: 2,
    point_type: 'like_received',
    description: '좋아요 받기',
    reference_id: postId,
  });

  // 배지 확인 및 부여
  await checkAndAwardBadges(userId);
}

/**
 * MVP 투표 포인트 (+5pt)
 */
export async function addMvpVotePoints(
  userId: string,
  voteId: number
): Promise<void> {
  await addUserPoints({
    user_id: userId,
    points_change: 5,
    point_type: 'mvp_vote',
    reference_id: voteId,
    description: 'MVP 투표',
  });

  // 배지 확인 및 부여
  await checkAndAwardBadges(userId);
}

/**
 * 사용자의 총 포인트 조회
 */
export async function getUserTotalPoints(userId: string): Promise<number> {
  const result = await prisma.userPoint.aggregate({
    where: { user_id: userId },
    _sum: { points_change: true },
  });

  return result._sum.points_change || 0;
}

/**
 * 사용자의 포인트 히스토리 조회
 */
export async function getUserPointHistory(
  userId: string,
  limit: number = 20
): Promise<
  Array<{
    point_id: number;
    points_change: number;
    point_type: string;
    reference_id: number | null;
    description: string | null;
    created_at: Date;
  }>
> {
  return await prisma.userPoint.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: limit,
    select: {
      point_id: true,
      points_change: true,
      point_type: true,
      reference_id: true,
      description: true,
      created_at: true,
    },
  });
}
