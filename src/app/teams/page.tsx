'use client';

import BackLink from '@/components/ui/back-link';
import { getTeamsPrisma } from '@/features/teams/api-prisma';
import TeamGrid from '@/features/teams/components/TeamGrid';
import TeamGridSkeleton from '@/features/teams/components/TeamGridSkeleton';
import { useGoalQuery } from '@/hooks/useGoalQuery';

export default function TeamsPage() {
  const {
    data: teams = [],
    isLoading,
    error,
  } = useGoalQuery(getTeamsPrisma, []);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">팀 목록</h1>
          <BackLink href="/" label="메인 페이지로 돌아가기" />
        </div>
        <TeamGridSkeleton items={10} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-red-500">팀 목록을 불러오지 못했습니다.</div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <BackLink href="/" label="메인 페이지로 돌아가기" />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">팀 목록</h1>
      </div>
      {/* 메인 콘텐츠 */}
      <div>
        <TeamGrid teams={teams} />
      </div>
    </div>
  );
}
