'use client';

import { useMemo, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PlayerInfiniteList from '@/features/players/components/PlayerInfiniteList';
import TeamOptionItem from '@/features/players/components/TeamOptionItem';
import { getTeamsPrisma } from '@/features/teams/api-prisma';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import type { Team } from '@/lib/types';

// 카테고리(포지션) 옵션
const POSITION_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'FW', label: '공격수' },
  { value: 'MF', label: '미드필더' },
  { value: 'DF', label: '수비수' },
  { value: 'GK', label: '골키퍼' },
] as const;

type PositionValue = (typeof POSITION_OPTIONS)[number]['value'];
type OrderValue = 'apps' | 'goals';

export default function PlayersContent({
  onTotalChange,
}: {
  onTotalChange?: (n: number) => void;
}) {
  const { data: teams = [] } = useGoalSuspenseQuery(getTeamsPrisma, []);
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState<OrderValue>('apps');
  const [position, setPosition] = useState<PositionValue>('ALL');
  const [teamId, setTeamId] = useState<number | null>(null);

  const teamOptions = useMemo(() => {
    const map = new Map<
      number,
      { team_id: number; team_name: string; logo: string | null | undefined }
    >();
    for (const t of teams as Team[]) {
      const id = t.team_id!;
      if (!map.has(id))
        map.set(id, {
          team_id: id,
          team_name: t.team_name ?? '',
          logo: (t as Team & { logo?: string | null }).logo ?? null,
        });
    }
    return Array.from(map.values()).sort((a, b) =>
      a.team_name.localeCompare(b.team_name)
    );
  }, [teams]);

  // Select 스타일: 카테고리 바와 자연스럽게 연결되도록 트리거 보더 제거 + 포커스 링 제거
  const triggerBase =
    'h-10 text-xs rounded-none border-0 bg-transparent px-3 shadow-none hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0';
  const contentBase =
    'rounded-md border border-gray-200 bg-white p-0 shadow-lg';
  // 체크 아이콘/선택 스타일 최소화: 좌측 여백(pl-8), 선택 상태 배경/두께 제거
  const itemBase =
    'pl-8 pr-4 py-3 text-sm text-gray-800 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-transparent data-[state=checked]:font-normal cursor-pointer';

  return (
    <>
      {/* Top bar - 29CM 스타일 카테고리 + 우측 드롭다운들 */}
      <div className="mb-3 rounded-md border bg-white">
        <div className="flex h-11 items-center justify-between px-3">
          {/* Left: category tabs with separators */}
          <div className="flex max-w-full items-center gap-4 overflow-x-auto">
            {POSITION_OPTIONS.map((opt, idx) => (
              <div key={opt.value} className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setPosition(opt.value)}
                  className={`whitespace-nowrap text-sm ${position === opt.value ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {opt.label}
                </button>
                {idx < POSITION_OPTIONS.length - 1 && (
                  <span className="hidden h-5 w-px bg-gray-200 sm:inline-block" />
                )}
              </div>
            ))}
          </div>

          {/* Right: team select + order select (왼쪽에 세로 구분선 + 필터 사이 보더) */}
          <div className="flex items-center pl-3 ml-3 border-l border-gray-200 divide-x divide-gray-200">
            <div className="px-3">
              <Select
                value={teamId != null ? String(teamId) : 'all'}
                onValueChange={(val) =>
                  setTeamId(val === 'all' ? null : Number(val))
                }
              >
                <SelectTrigger className={`${triggerBase} min-w-[150px]`}>
                  <SelectValue placeholder="팀 전체" />
                </SelectTrigger>
                <SelectContent className={contentBase}>
                  <SelectItem value="all" className={itemBase}>
                    <TeamOptionItem name="팀 전체" logo={null} />
                  </SelectItem>
                  {teamOptions.map((t) => (
                    <SelectItem
                      key={t.team_id}
                      value={String(t.team_id)}
                      className={itemBase}
                    >
                      <TeamOptionItem
                        name={t.team_name}
                        logo={t.logo ?? null}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="px-3">
              <Select
                value={order}
                onValueChange={(val) => setOrder((val as OrderValue) ?? 'apps')}
              >
                <SelectTrigger className={`${triggerBase} min-w-[120px]`}>
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent className={contentBase}>
                  <SelectItem value="apps" className={itemBase}>
                    🏃 출전 많은 순
                  </SelectItem>
                  <SelectItem value="goals" className={itemBase}>
                    ⚽️ 골 많은 순
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Search (서버) */}
      <div className="mb-4 flex items-center gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="선수 이름 검색"
          className="h-8 w-44 sm:w-64 rounded-md border border-gray-300 px-2 text-xs focus:outline-none focus:ring-0 focus-visible:ring-0"
        />
      </div>

      <PlayerInfiniteList
        keyword={keyword}
        order={order}
        position={position === 'ALL' ? undefined : position}
        teamId={teamId}
        onTotalChange={onTotalChange}
      />
    </>
  );
}
