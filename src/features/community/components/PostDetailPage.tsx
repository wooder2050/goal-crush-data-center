'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, Eye, Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import { usePostViewTracking } from '@/hooks/usePostViewTracking';

// API 함수
const getPostDetail = async (postId: string) => {
  const response = await fetch(`/api/community/posts/${postId}`);

  if (!response.ok) {
    throw new Error('게시글을 불러오는데 실패했습니다.');
  }

  return response.json();
};

function PostDetailContent() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;

  // 게시글 상세 정보 조회
  const { data: post } = useGoalSuspenseQuery(getPostDetail, [postId]);

  // 조회 추적 훅 사용
  const { hasTracked } = usePostViewTracking({
    postId,
    enabled: true,
    onViewTracked: (isNewView) => {
      if (isNewView) {
        console.log('새로운 조회가 기록되었습니다.');
      } else {
        console.log('이미 조회한 게시글입니다.');
      }
    },
  });

  const getCategoryBadge = (category: string) => {
    const badges = {
      general: { label: '일반', variant: 'default' as const },
      match: { label: '경기', variant: 'secondary' as const },
      team: { label: '팀', variant: 'outline' as const },
      data: { label: '데이터', variant: 'destructive' as const },
      prediction: { label: '예측', variant: 'default' as const },
    };
    return badges[category as keyof typeof badges] || badges.general;
  };

  const categoryBadge = getCategoryBadge(post.category);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 뒤로가기 버튼 */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        뒤로가기
      </Button>

      {/* 게시글 헤더 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={categoryBadge.variant}>{categoryBadge.label}</Badge>
            {post.team && (
              <Badge variant="outline">{post.team.team_name}</Badge>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Image
                src={post.user.profile_image_url || '/default-avatar.png'}
                alt={`${post.user.korean_nickname} 프로필`}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{post.user.korean_nickname}</span>
            </div>

            <span>
              {format(new Date(post.created_at), 'yyyy년 MM월 dd일 HH:mm', {
                locale: ko,
              })}
            </span>

            {post.updated_at !== post.created_at && (
              <span className="text-gray-400">
                (수정됨:{' '}
                {format(new Date(post.updated_at), 'MM/dd HH:mm', {
                  locale: ko,
                })}
                )
              </span>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* 게시글 내용 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="prose max-w-none">
            {post.content ? (
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {post.content}
              </div>
            ) : (
              <p className="text-gray-500 italic">내용이 없습니다.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 게시글 메타 정보 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>조회 {post.views_count}</span>
                {hasTracked && (
                  <span className="text-xs text-green-600 ml-1">(추적됨)</span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>좋아요 {post.likes_count}</span>
              </div>

              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>댓글 {post.comments_count}</span>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              게시글 ID: {post.post_id}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
      </div>

      <div className="space-y-6">
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-16 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function PostDetailPage() {
  return (
    <GoalWrapper fallback={<PostDetailSkeleton />}>
      <PostDetailContent />
    </GoalWrapper>
  );
}
