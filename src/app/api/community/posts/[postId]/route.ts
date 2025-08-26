import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/community/posts/[postId] - 게시글 상세 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;

    if (!postId) {
      return NextResponse.json(
        {
          success: false,
          error: '게시글 ID가 필요합니다.',
        },
        { status: 400 }
      );
    }

    // 게시글 정보 조회
    const post = await prisma.communityPost.findUnique({
      where: {
        post_id: parseInt(postId),
        is_deleted: false,
      },
      include: {
        user: {
          select: {
            korean_nickname: true,
            profile_image_url: true,
          },
        },
        team: {
          select: {
            team_name: true,
          },
        },
        _count: {
          select: {
            comments: {
              where: {
                is_deleted: false,
              },
            },
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: '게시글을 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    // 댓글 조회
    const comments = await prisma.postComment.findMany({
      where: {
        post_id: parseInt(postId),
        is_deleted: false,
      },
      include: {
        user: {
          select: {
            korean_nickname: true,
            profile_image_url: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    // 응답 데이터 구성
    const postData = {
      post_id: post.post_id,
      title: post.title,
      content: post.content,
      category: post.category,
      team_id: post.team_id,
      team_name: post.team?.team_name,
      created_at: post.created_at.toISOString(),
      updated_at: post.updated_at.toISOString(),
      user_nickname: post.user.korean_nickname,
      user_profile_image: post.user.profile_image_url,
      comment_count: post._count.comments,
      like_count: post._count.likes,
      is_liked: false, // TODO: 현재 사용자의 좋아요 여부 확인
    };

    const commentsData = comments.map((comment) => ({
      comment_id: comment.comment_id,
      content: comment.content,
      created_at: comment.created_at.toISOString(),
      user_nickname: comment.user.korean_nickname,
      user_profile_image: comment.user.profile_image_url,
      is_deleted: comment.is_deleted,
    }));

    return NextResponse.json({
      success: true,
      data: {
        post: postData,
        comments: commentsData,
      },
    });
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '게시글을 조회하는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
