'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { H2 } from '@/components/ui/typography';
import { MatchCoach } from '@/features/admin/types';

import { useDeleteMatchCoachMutation } from '../../hooks/useCoachMutation';
import AddCoachDialog from '../AddCoachDialog';

interface CoachesTabProps {
  matchId: number;
  actualCoaches?: MatchCoach[];
  onRemoveCoach?: (coachId: string) => void;
  homeTeam: { team_id: number; team_name: string };
  awayTeam: { team_id: number; team_name: string };
}

export default function CoachesTab({
  matchId,
  actualCoaches = [],
  onRemoveCoach,
  homeTeam,
  awayTeam,
}: CoachesTabProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const deleteCoachMutation = useDeleteMatchCoachMutation();

  const hasActualCoaches = actualCoaches.length > 0;

  // 감독 삭제 처리
  const handleDeleteCoach = async (coachId: string) => {
    if (confirm('정말로 이 감독을 삭제하시겠습니까?')) {
      try {
        await deleteCoachMutation.mutateAsync({
          matchId,
          coachId: parseInt(coachId),
        });
        alert('감독이 삭제되었습니다.');
        // 부모 컴포넌트에 삭제 알림
        if (onRemoveCoach) {
          onRemoveCoach(coachId);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '감독 삭제 중 오류가 발생했습니다.';
        alert(`삭제 실패: ${errorMessage}`);
      }
    }
  };

  // 역할별 한글 이름
  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      head: '감독',
      assistant: '코치',
      goalkeeper: '골키퍼 코치',
      fitness: '피트니스 코치',
      analyst: '분석 코치',
    };
    return roleMap[role] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <H2>감독 정보</H2>
        <Button onClick={() => setShowAddDialog(true)}>감독 추가</Button>
      </div>

      {/* 실제 감독 데이터 표시 */}
      {hasActualCoaches ? (
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">팀</th>
                  <th className="text-left py-2 px-4">감독명</th>
                  <th className="text-left py-2 px-4">역할</th>
                  <th className="text-left py-2 px-4">설명</th>
                  {onRemoveCoach && (
                    <th className="text-left py-2 px-4">액션</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {actualCoaches.map((coach) => (
                  <tr key={coach.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{coach.team_name}</td>
                    <td className="py-2 px-4">{coach.coach_name}</td>
                    <td className="py-2 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {getRoleLabel(coach.role)}
                      </span>
                    </td>
                    <td className="py-2 px-4">{coach.description || '-'}</td>
                    {onRemoveCoach && (
                      <td className="py-2 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteCoach(coach.id)}
                        >
                          삭제
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            등록된 감독이 없습니다.
          </div>
        </Card>
      )}

      {/* 감독 추가 다이얼로그 */}
      <AddCoachDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        matchId={matchId}
        onSuccess={() => {
          // 페이지 새로고침으로 목록 업데이트
          window.location.reload();
        }}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />
    </div>
  );
}
