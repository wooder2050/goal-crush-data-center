'use client';

import { Search as SearchIcon } from 'lucide-react';
import React from 'react';

type PlayersHeaderProps = {
  total: number | null;
  keyword: string;
  keywordInput: string;
  onChangeKeywordInput: (value: string) => void;
  onKeyDownInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  onClickSearch: () => void;
};

export function PlayersHeader(props: PlayersHeaderProps) {
  const {
    total,
    keyword,
    keywordInput,
    onChangeKeywordInput,
    onKeyDownInput,
    onFocus,
    onBlur,
    isFocused,
    onClickSearch,
  } = props;

  const isDisabled = keywordInput.trim() === keyword.trim();

  return (
    <div className="mb-2 flex items-center justify-between gap-4 px-3 pt-3 sm:mb-3 sm:px-3">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold sm:text-2xl">선수 정보 보기</h1>
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
          onChange={(e) => onChangeKeywordInput(e.target.value)}
          onKeyDown={onKeyDownInput}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="선수 검색"
          aria-label="선수 검색"
          className="w-full border-0 bg-transparent px-2 pr-10 text-base md:text-xl font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-0 h-10"
        />
        <button
          type="button"
          onClick={onClickSearch}
          disabled={isDisabled}
          aria-label="검색"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 disabled:opacity-40"
        >
          <SearchIcon className="h-5 w-5 text-black" strokeWidth={2} />
        </button>
        <div
          className={`mt-1 h-[2px] w-full ${
            isFocused || keywordInput.trim().length > 0
              ? 'bg-black'
              : 'bg-gray-200'
          }`}
        />
      </div>
    </div>
  );
}
