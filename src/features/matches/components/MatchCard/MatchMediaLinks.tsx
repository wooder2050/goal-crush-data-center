'use client';

import React from 'react';

import { MatchWithTeams } from '@/lib/types/database';

interface MatchMediaLinksProps {
  match: MatchWithTeams;
  className?: string;
}

const MatchMediaLinks: React.FC<MatchMediaLinksProps> = ({
  match,
  className = '',
}) => {
  const hasLinks =
    Boolean(match.highlight_url) || Boolean(match.full_video_url);
  if (!hasLinks) return null;

  return (
    <div
      className={`mb-3 sm:mb-4 flex w-full items-center justify-end gap-2 ${className}`}
    >
      {match.highlight_url && (
        <a
          href={match.highlight_url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center rounded-md bg-black px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-white shadow-sm hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
        >
          🎦 하이라이트
        </a>
      )}
      {match.full_video_url && (
        <a
          href={match.full_video_url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center rounded-md border px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          ▶️ 풀영상
        </a>
      )}
    </div>
  );
};

export default MatchMediaLinks;
