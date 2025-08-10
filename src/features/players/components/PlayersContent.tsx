'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

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

// Category (position) options
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
  controlledKeyword,
  onApplyControlledKeyword,
  hideInternalSearch,
}: {
  onTotalChange?: (n: number) => void;
  controlledKeyword?: string;
  onApplyControlledKeyword?: () => void;
  hideInternalSearch?: boolean;
}) {
  const { data: teams = [] } = useGoalSuspenseQuery(getTeamsPrisma, []);
  const [keyword, setKeyword] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
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

  // Select styles: visually connect with the category bar by removing trigger border and focus ring
  const triggerBase =
    'h-10 text-xs rounded-none border-0 bg-transparent px-3 shadow-none hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0';
  const contentBase =
    'rounded-md border border-gray-200 bg-white p-0 shadow-lg';
  // Item styles: add left padding for check/emoji, remove selected background/weight
  const itemBase =
    'pl-8 pr-4 py-3 text-sm text-gray-800 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-transparent data-[state=checked]:font-normal cursor-pointer';

  const applySearch = useCallback(() => {
    const next = keywordInput.trim();
    if (controlledKeyword != null) {
      if (next === controlledKeyword.trim()) return;
      onApplyControlledKeyword?.();
      return;
    }
    if (next === keyword.trim()) return;
    setKeyword(next);
  }, [keywordInput, keyword, controlledKeyword, onApplyControlledKeyword]);

  const onKeyDownInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applySearch();
      }
    },
    [applySearch]
  );

  return (
    <>
      {/* Top bar - minimal category tabs + right-side dropdowns */}
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

          {/* Right: team select + order select (left vertical divider + inner dividers) */}
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

      {!hideInternalSearch && (
        // Search (server) - compact underline style (<=25% width)
        <div className="mb-4 flex justify-end">
          <div className="relative w-[22%] min-w-[220px] max-w-[360px]">
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={onKeyDownInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="선수 검색"
              aria-label="선수 검색"
              className="w-full border-0 bg-transparent px-2 pr-10 text-base md:text-xl font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-0 h-10"
            />
            <button
              type="button"
              onClick={applySearch}
              disabled={
                keywordInput.trim() === (controlledKeyword ?? keyword).trim()
              }
              aria-label="검색"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 disabled:opacity-40"
            >
              <SearchIcon className="h-5 w-5 text-black" strokeWidth={2} />
            </button>
            <div
              className={`mt-1 h-[2px] w-full ${isFocused || keywordInput.trim().length > 0 ? 'bg-black' : 'bg-gray-200'}`}
            />
          </div>
        </div>
      )}

      <PlayerInfiniteList
        keyword={controlledKeyword ?? keyword}
        order={order}
        position={position === 'ALL' ? undefined : position}
        teamId={teamId}
        onTotalChange={onTotalChange}
      />
    </>
  );
}
