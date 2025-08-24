'use client';

import { Button } from '@/components/ui/button';
import { H2 } from '@/components/ui/typography';
import { PenaltiesTableSkeleton } from '@/features/admin/components/skeletons';
import { MatchPenalty } from '@/features/admin/types';

interface PenaltiesTabProps {
  isLoadingPlayers: boolean;
  onAddPenalty: () => void;
  // 실제 경기 페널티킥 데이터
  actualPenalties?: MatchPenalty[];
  onRemovePenalty?: (penaltyId: string) => void;
}

export default function PenaltiesTab({
  isLoadingPlayers,
  onAddPenalty,
  actualPenalties = [],
  onRemovePenalty,
}: PenaltiesTabProps) {
  const hasActualPenalties = actualPenalties.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <H2 className="text-xl">승부차기 기록</H2>
        <Button onClick={onAddPenalty}>승부차기 추가</Button>
      </div>

      {isLoadingPlayers ? (
        <PenaltiesTableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">순서</th>
                <th className="text-left py-2 px-4">팀</th>
                <th className="text-left py-2 px-4">키커</th>
                <th className="text-left py-2 px-4">골키퍼</th>
                <th className="text-left py-2 px-4">결과</th>
                {hasActualPenalties && onRemovePenalty && (
                  <th className="text-left py-2 px-4">액션</th>
                )}
              </tr>
            </thead>
            <tbody>
              {hasActualPenalties ? (
                actualPenalties
                  .sort((a, b) => a.order - b.order) // 순서대로 정렬
                  .map((penalty) => (
                    <tr key={penalty.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{penalty.order}</td>
                      <td className="py-2 px-4">{penalty.team_name}</td>
                      <td className="py-2 px-4">{penalty.player_name}</td>
                      <td className="py-2 px-4">{penalty.goalkeeper_name}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            penalty.is_scored
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {penalty.is_scored ? '성공' : '실패'}
                        </span>
                      </td>
                      {onRemovePenalty && (
                        <td className="py-2 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500"
                            onClick={() => onRemovePenalty(penalty.id)}
                          >
                            삭제
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
              ) : (
                <tr className="border-b">
                  <td
                    colSpan={hasActualPenalties && onRemovePenalty ? 6 : 5}
                    className="py-4 text-center"
                  >
                    기록된 페널티킥이 없습니다. 페널티킥을 추가해주세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
