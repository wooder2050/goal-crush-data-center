'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Grid, Section } from '@/components/ui';
import PlayersContent from '@/features/players/components/PlayersContent';
import SkeletonCard from '@/features/players/components/SkeletonCard';

export default function PlayersPage() {
  const [total, setTotal] = useState<number | null>(null);

  // Controlled search state
  const [keyword, setKeyword] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applySearch = useCallback(() => {
    const next = keywordInput.trim();
    if (next === keyword.trim()) return;
    setKeyword(next);
  }, [keywordInput, keyword]);

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
    <Section padding="sm" className="pt-2 sm:pt-3">
      <GoalWrapper
        fallback={
          <div className="space-y-4">
            {/* Mobile skeleton: tabs underline + pill selects */}
            <div className="sm:hidden">
              <div className="mb-2 border-b bg-white">
                <div className="flex items-center gap-4 overflow-x-auto px-3 pt-3 pb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-4 w-14 rounded bg-gray-200 animate-pulse"
                    />
                  ))}
                </div>
              </div>
              <div className="mb-4 bg-white">
                <div className="flex items-center gap-2 overflow-x-auto px-3 py-2">
                  <span className="block h-9 w-28 rounded-full bg-gray-200 animate-pulse" />
                  <span className="block h-9 w-24 rounded-full bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Desktop skeleton: original combined bar with extra spacing */}
            <div className="hidden sm:block">
              <div className="mb-4 rounded-md border bg-white">
                <div className="flex min-h-12 items-center justify-between gap-2 px-3 py-3">
                  <div className="flex max-w-full items-center gap-4 overflow-x-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-4 w-14 rounded bg-gray-200 animate-pulse"
                      />
                    ))}
                  </div>
                  <div className="flex items-center pl-3 ml-3 divide-x divide-gray-200">
                    <div className="px-3">
                      <span className="block h-10 w-[150px] rounded bg-gray-200 animate-pulse" />
                    </div>
                    <div className="px-3">
                      <span className="block h-10 w-[120px] rounded bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Grid cols={4} gap="lg">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </Grid>
          </div>
        }
      >
        <PlayersContent
          onTotalChange={setTotal}
          controlledKeyword={keyword}
          hideInternalSearch
          stickyHeaderSlot={
            <div className="mb-2 flex items-center justify-between gap-4 px-3 pt-3 sm:mb-3 sm:px-3">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold sm:text-2xl">
                  선수 정보 보기
                </h1>
                {typeof total === 'number' && (
                  <span className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
                    총 {total}명
                  </span>
                )}
              </div>
              {/* Right: Controlled search bar (hidden on mobile) */}
              <div className="relative hidden sm:block w-[22%] min-w-[220px] max-w-[360px]">
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
                  disabled={keywordInput.trim() === keyword.trim()}
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
          }
        />
      </GoalWrapper>
    </Section>
  );
}
