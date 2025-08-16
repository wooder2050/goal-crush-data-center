'use client';

import { useCallback, useState } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Grid, Section } from '@/components/ui';
import PlayersContent from '@/features/players/components/PlayersContent';
import { PlayersHeader } from '@/features/players/components/PlayersHeader';
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
            <PlayersHeader
              total={total}
              keyword={keyword}
              keywordInput={keywordInput}
              onChangeKeywordInput={setKeywordInput}
              onKeyDownInput={onKeyDownInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              isFocused={isFocused}
              onClickSearch={applySearch}
            />
          }
        />
      </GoalWrapper>
    </Section>
  );
}
