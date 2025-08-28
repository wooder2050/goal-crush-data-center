import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

// GET /api/community/hot-topics - 인기 토픽 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    // 최근 7일간 인기 게시글 조회 (좋아요 + 댓글 수 + 독립 조회수 기준)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const hotTopics = await prisma.communityPost.findMany({
      where: {
        is_deleted: false,
        created_at: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        post_id: true,
        title: true,
        category: true,
        likes_count: true,
        comments_count: true,
        views_count: true,
        created_at: true,
        _count: {
          select: {
            viewRecords: true, // 독립 조회 기록 수
          },
        },
      },
      orderBy: [
        {
          views_count: 'desc', // 조회수 우선
        },
        {
          likes_count: 'desc', // 좋아요 수
        },
        {
          comments_count: 'desc', // 댓글 수
        },
      ],
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: hotTopics.map((topic) => ({
        id: topic.post_id,
        title: topic.title,
        category: topic.category,
        likes_count: topic.likes_count || 0,
        comments_count: topic.comments_count || 0,
        views_count: topic.views_count || 0,
        unique_views: topic._count.viewRecords || 0, // 독립 조회 기록 수
        created_at: topic.created_at,
      })),
    });
  } catch (error) {
    console.error('인기 토픽 조회 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '인기 토픽을 조회하는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
