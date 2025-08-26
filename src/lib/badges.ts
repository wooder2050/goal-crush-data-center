import { prisma } from './prisma';

interface BadgeCheckResult {
  newBadges: Array<{
    badge_id: number;
    badge_name: string;
    badge_description: string;
    badge_icon: string;
    badge_color: string;
  }>;
}

/**
 * 사용자의 활동을 확인하고 새로운 배지를 부여합니다.
 */
export async function checkAndAwardBadges(
  userId: string
): Promise<BadgeCheckResult> {
  const newBadges: BadgeCheckResult['newBadges'] = [];

  try {
    // 1. 첫 번째 게시글 작성 배지
    const postCount = await prisma.communityPost.count({
      where: {
        user_id: userId,
        is_deleted: false,
      },
    });

    if (postCount >= 1) {
      const hasFirstPostBadge = await prisma.userBadge.findUnique({
        where: {
          user_id_badge_type: {
            user_id: userId,
            badge_type: 'first_post',
          },
        },
      });

      if (!hasFirstPostBadge) {
        const newBadge = await prisma.userBadge.create({
          data: {
            user_id: userId,
            badge_type: 'first_post',
            badge_name: '첫 번째 게시글',
            badge_description: '커뮤니티에 첫 번째 게시글을 작성했습니다',
            badge_icon: '✍️',
          },
        });

        newBadges.push({
          badge_id: newBadge.badge_id,
          badge_name: newBadge.badge_name,
          badge_description: newBadge.badge_description || '',
          badge_icon: newBadge.badge_icon || '🏆',
          badge_color: '#059669', // 에메랄드 그린
        });
      }
    }

    // 2. 예측 마스터 배지 (MVP 투표 참여)
    const mvpVoteCount = await prisma.mvpVote.count({
      where: {
        user_id: userId,
      },
    });

    if (mvpVoteCount >= 5) {
      const hasPredictionMasterBadge = await prisma.userBadge.findUnique({
        where: {
          user_id_badge_type: {
            user_id: userId,
            badge_type: 'prediction_master',
          },
        },
      });

      if (!hasPredictionMasterBadge) {
        const newBadge = await prisma.userBadge.create({
          data: {
            user_id: userId,
            badge_type: 'prediction_master',
            badge_name: '예측 마스터',
            badge_description: '5회 이상 MVP 투표에 참여했습니다',
            badge_icon: '🔮',
          },
        });

        newBadges.push({
          badge_id: newBadge.badge_id,
          badge_name: newBadge.badge_name,
          badge_description: newBadge.badge_description || '',
          badge_icon: newBadge.badge_icon || '🏆',
          badge_color: '#2563EB', // 파란색
        });
      }
    }

    // 3. 팀 서포터 배지 (팀 관련 게시글 작성)
    const teamPostCount = await prisma.communityPost.count({
      where: {
        user_id: userId,
        is_deleted: false,
        team_id: { not: null },
      },
    });

    if (teamPostCount >= 3) {
      const hasTeamSupporterBadge = await prisma.userBadge.findUnique({
        where: {
          user_id_badge_type: {
            user_id: userId,
            badge_type: 'team_supporter',
          },
        },
      });

      if (!hasTeamSupporterBadge) {
        const newBadge = await prisma.userBadge.create({
          data: {
            user_id: userId,
            badge_type: 'team_supporter',
            badge_name: '팀 서포터',
            badge_description: '팀 관련 게시글을 3개 이상 작성했습니다',
            badge_icon: '⚽',
          },
        });

        newBadges.push({
          badge_id: newBadge.badge_id,
          badge_name: newBadge.badge_name,
          badge_description: newBadge.badge_description || '',
          badge_icon: newBadge.badge_icon || '🏆',
          badge_color: '#EA580C', // 주황색
        });
      }
    }

    // 4. MVP 투표자 배지 (MVP 투표 참여)
    if (mvpVoteCount >= 1) {
      const hasMvpVoterBadge = await prisma.userBadge.findUnique({
        where: {
          user_id_badge_type: {
            user_id: userId,
            badge_type: 'mvp_voter',
          },
        },
      });

      if (!hasMvpVoterBadge) {
        const newBadge = await prisma.userBadge.create({
          data: {
            user_id: userId,
            badge_type: 'mvp_voter',
            badge_name: 'MVP 투표자',
            badge_description: 'MVP 투표에 참여했습니다',
            badge_icon: '🗳️',
          },
        });

        newBadges.push({
          badge_id: newBadge.badge_id,
          badge_name: newBadge.badge_name,
          badge_description: newBadge.badge_description || '',
          badge_icon: newBadge.badge_icon || '🏆',
          badge_color: '#7C3AED', // 보라색
        });
      }
    }

    // 5. 댓글 작성자 배지
    const commentCount = await prisma.postComment.count({
      where: {
        user_id: userId,
        is_deleted: false,
      },
    });

    if (commentCount >= 10) {
      const hasCommentKingBadge = await prisma.userBadge.findUnique({
        where: {
          user_id_badge_type: {
            user_id: userId,
            badge_type: 'comment_king',
          },
        },
      });

      if (!hasCommentKingBadge) {
        const newBadge = await prisma.userBadge.create({
          data: {
            user_id: userId,
            badge_type: 'comment_king',
            badge_name: '댓글 왕',
            badge_description: '10개 이상의 댓글을 작성했습니다',
            badge_icon: '💬',
          },
        });

        newBadges.push({
          badge_id: newBadge.badge_id,
          badge_name: newBadge.badge_name,
          badge_description: newBadge.badge_description || '',
          badge_icon: newBadge.badge_icon || '🏆',
          badge_color: '#0891B2', // 청록색
        });
      }
    }

    // 6. 좋아요 챔피언 배지
    const likeCount = await prisma.postLike.count({
      where: {
        post: {
          user_id: userId,
          is_deleted: false,
        },
      },
    });

    if (likeCount >= 20) {
      const hasLikeChampionBadge = await prisma.userBadge.findUnique({
        where: {
          user_id_badge_type: {
            user_id: userId,
            badge_type: 'like_champion',
          },
        },
      });

      if (!hasLikeChampionBadge) {
        const newBadge = await prisma.userBadge.create({
          data: {
            user_id: userId,
            badge_type: 'like_champion',
            badge_name: '좋아요 챔피언',
            badge_description: '게시글이 20개 이상의 좋아요를 받았습니다',
            badge_icon: '❤️',
          },
        });

        newBadges.push({
          badge_id: newBadge.badge_id,
          badge_name: newBadge.badge_name,
          badge_description: newBadge.badge_description || '',
          badge_icon: newBadge.badge_icon || '🏆',
          badge_color: '#DB2777', // 핑크색
        });
      }
    }

    return { newBadges };
  } catch (error) {
    console.error('배지 확인 및 부여 오류:', error);
    return { newBadges: [] };
  }
}

/**
 * 사용자의 모든 배지를 조회합니다.
 */
export async function getUserBadges(userId: string) {
  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { user_id: userId },
      orderBy: {
        earned_at: 'desc',
      },
    });

    return userBadges;
  } catch (error) {
    console.error('사용자 배지 조회 오류:', error);
    return [];
  }
}
