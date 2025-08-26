import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// Supabase 서버 클라이언트 생성 (Vercel 배포 안정성을 위한 직접 구현)
// 현재 API에서는 사용하지 않지만 향후 사용자 인증이 필요할 수 있음
// function createClient() {
//   const cookieStore = cookies();
//   return createServerClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll();
//         },
//         setAll(cookiesToSet) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             );
//           } catch {
//             // Server Component에서 호출된 경우 무시
//           }
//         },
//       },
//     }
//   );
// }

// GET /api/community/stats - 커뮤니티 전체 통계 조회
export async function GET() {
  try {
    // 총 게시글 수
    const totalPosts = await prisma.communityPost.count({
      where: {
        is_deleted: false,
      },
    });

    // 총 활성 사용자 수
    const totalUsers = await prisma.user.count({
      where: {
        is_active: true,
      },
    });

    // 총 댓글 수
    const totalComments = await prisma.postComment.count({
      where: {
        is_deleted: false,
      },
    });

    // 총 좋아요 수 (게시글 + 댓글)
    const [postLikes, commentLikes] = await Promise.all([
      prisma.postLike.count(),
      prisma.commentLike.count(),
    ]);

    const totalLikes = postLikes + commentLikes;

    // 총 MVP 투표 수 (모든 시즌)
    const totalVotes = await prisma.mvpVote.count({
      where: {
        vote_type: 'season',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalPosts,
        totalUsers,
        totalComments,
        totalLikes,
        totalVotes,
      },
    });
  } catch (error) {
    console.error('커뮤니티 통계 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '커뮤니티 통계를 조회하는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
