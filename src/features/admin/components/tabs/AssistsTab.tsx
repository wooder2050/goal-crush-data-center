'use client';

import { Button } from '@/components/ui/button';
import { H2 } from '@/components/ui/typography';
import { AssistsTableSkeleton } from '@/features/admin/components/skeletons';
import { MatchAssist } from '@/features/admin/types';

interface AssistsTabProps {
  isLoading: boolean;
  onAddAssist: () => void;
  // 실제 경기 어시스트 데이터
  actualAssists?: MatchAssist[];
  onRemoveAssist?: (assistId: string) => void;
}

export default function AssistsTab({
  isLoading,
  onAddAssist,
  actualAssists = [],
  onRemoveAssist,
}: AssistsTabProps) {
  const hasActualAssists = actualAssists.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <H2 className="text-xl">어시스트 기록</H2>
        <Button onClick={onAddAssist}>어시스트 추가</Button>
      </div>

      {isLoading ? (
        <AssistsTableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">시간</th>
                <th className="text-left py-2 px-4">선수</th>
                <th className="text-left py-2 px-4">연결된 골</th>
                <th className="text-left py-2 px-4">설명</th>
                {hasActualAssists && onRemoveAssist && (
                  <th className="text-left py-2 px-4">액션</th>
                )}
              </tr>
            </thead>
            <tbody>
              {hasActualAssists ? (
                actualAssists.map((assist) => (
                  <tr key={assist.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{assist.goal_time}&apos;</td>
                    <td className="py-2 px-4">{assist.player_name}</td>
                    <td className="py-2 px-4">
                      {assist.goal_time}&apos; {assist.goal_player_name || ''}
                    </td>
                    <td className="py-2 px-4">{assist.description || '-'}</td>
                    {onRemoveAssist && (
                      <td className="py-2 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500"
                          onClick={() => onRemoveAssist(assist.id)}
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
                    colSpan={hasActualAssists && onRemoveAssist ? 5 : 4}
                    className="py-4 text-center"
                  >
                    기록된 어시스트가 없습니다. 어시스트를 추가해주세요.
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
