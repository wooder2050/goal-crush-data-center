'use client';

import { format } from 'date-fns';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { MatchWithRelations } from '../api';
import { useDeleteMatchMutation } from '../hooks/useDeleteMatchMutation';
import { useRecentMatches } from '../hooks/useMatchesQuery';

interface RecentMatchesListProps {
  limit?: number;
}

export default function RecentMatchesList({
  limit = 5,
}: RecentMatchesListProps) {
  const {
    data: matches = [],
    isLoading,
    error,
  } = useRecentMatches(limit) as {
    data: MatchWithRelations[];
    isLoading: boolean;
    error: Error | null;
  };
  const deleteMatchMutation = useDeleteMatchMutation();

  // 경기 상태에 따른 배지 스타일 및 텍스트
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            예정됨
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            완료됨
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            취소됨
          </span>
        );
      case 'postponed':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            연기됨
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  // 로딩 중 상태
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">날짜</th>
              <th className="text-left py-2 px-4">홈팀</th>
              <th className="text-left py-2 px-4">원정팀</th>
              <th className="text-left py-2 px-4">상태</th>
              <th className="text-left py-2 px-4">관리</th>
            </tr>
          </thead>
          <tbody>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <tr key={index} className="border-b animate-pulse">
                  <td className="py-2 px-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">
          경기 목록을 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="text-sm text-gray-600">{error.message}</p>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (matches.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">등록된 경기가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">날짜</th>
            <th className="text-left py-2 px-4">홈팀</th>
            <th className="text-left py-2 px-4">원정팀</th>
            <th className="text-left py-2 px-4">상태</th>
            <th className="text-left py-2 px-4">관리</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.match_id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">
                {format(new Date(match.match_date), 'yyyy-MM-dd')}
              </td>
              <td className="py-2 px-4">
                <Link
                  href={`/teams/${match.home_team.team_id}`}
                  className="hover:underline"
                >
                  {match.home_team.team_name}
                </Link>
              </td>
              <td className="py-2 px-4">
                <Link
                  href={`/teams/${match.away_team.team_id}`}
                  className="hover:underline"
                >
                  {match.away_team.team_name}
                </Link>
              </td>
              <td className="py-2 px-4">
                {getStatusBadge(match.status || 'unknown')}
              </td>
              <td className="py-2 px-4">
                {match.status === 'scheduled' ? (
                  <>
                    <Link href={`/admin/matches/record/${match.match_id}`}>
                      <Button size="sm" variant="outline" className="mr-2">
                        수정
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500"
                      onClick={() => {
                        // 삭제 기능 구현 (확인 후 삭제)
                        if (
                          window.confirm(
                            '정말로 이 경기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
                          )
                        ) {
                          // 삭제 API 호출 (useDeleteMatchMutation 활용)
                          deleteMatchMutation.mutate(match.match_id, {
                            onSuccess: () => {
                              alert('경기가 성공적으로 삭제되었습니다.');
                            },
                            onError: (error) => {
                              alert(
                                `경기 삭제 중 오류가 발생했습니다: ${error.message}`
                              );
                              return true;
                            },
                          });
                        }
                      }}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href={`/matches/${match.match_id}`}>
                      <Button size="sm" variant="outline" className="mr-2">
                        상세
                      </Button>
                    </Link>
                    <Link href={`/admin/matches/record/${match.match_id}`}>
                      <Button size="sm" variant="outline">
                        수정
                      </Button>
                    </Link>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
