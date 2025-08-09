'use client';

import Image from 'next/image';
import Link from 'next/link';

import { getTeamHighlightsPrisma } from '@/features/teams/api-prisma';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import type { Team } from '@/lib/types';

interface TeamHeaderProps {
  team: Team;
}

export default function TeamHeader({ team }: TeamHeaderProps) {
  const { data: highlights } = useGoalSuspenseQuery(getTeamHighlightsPrisma, [
    team.team_id!,
  ]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 relative rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
          {team.logo ? (
            <Image
              src={team.logo}
              alt={`${team.team_name} 로고`}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <span className="text-xl text-gray-600 font-semibold">
              {team.team_name?.charAt(0) ?? '?'}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{team.team_name}</h1>
          <div className="text-sm text-gray-500">
            {team.founded_year
              ? `${team.founded_year}년 창단`
              : '창단년도 미상'}
          </div>
          {team.description && (
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
              {team.description}
            </p>
          )}
        </div>
      </div>

      {highlights && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                🎽
              </span>
              <span className="font-medium">최다 출장</span>
            </div>
            {highlights.top_appearances ? (
              <div className="mt-2">
                <Link
                  href={`/players/${highlights.top_appearances.player_id}`}
                  className="hover:underline font-semibold text-gray-900"
                >
                  {highlights.top_appearances.name}
                </Link>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {highlights.top_appearances.appearances}
                  <span className="ml-1 text-base font-medium text-gray-500">
                    경기
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-gray-400">기록 없음</div>
            )}
          </div>

          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                ⚽️
              </span>
              <span className="font-medium">최다 득점</span>
            </div>
            {highlights.top_scorer ? (
              <div className="mt-2">
                <Link
                  href={`/players/${highlights.top_scorer.player_id}`}
                  className="hover:underline font-semibold text-gray-900"
                >
                  {highlights.top_scorer.name}
                </Link>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {highlights.top_scorer.goals}
                  <span className="ml-1 text-base font-medium text-gray-500">
                    골
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-gray-400">기록 없음</div>
            )}
          </div>

          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                🏆
              </span>
              <span className="font-medium">우승 기록</span>
            </div>
            {highlights.championships.count > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {highlights.championships.seasons.map((s) => (
                  <span
                    key={s.season_id}
                    className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100/70 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                  >
                    🏆 {s.season_name ?? `시즌 ${s.year ?? ''}`}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-gray-400">없음</div>
            )}
          </div>

          <div className="rounded-lg border p-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                📈
              </span>
              <span className="font-medium">최고 순위</span>
            </div>
            {highlights.championships.count > 0 ? (
              <div className="mt-2 text-2xl font-bold text-gray-900">
                1위{' '}
                <span className="ml-1 text-base font-medium text-gray-600">
                  (슈퍼리그/컵)
                </span>
              </div>
            ) : highlights.best_overall?.position ? (
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900">
                  {highlights.best_overall.position}
                  <span className="ml-1 text-base font-medium text-gray-600">
                    {highlights.best_overall.league === 'super'
                      ? '(슈퍼리그)'
                      : highlights.best_overall.league === 'challenge'
                        ? '(챌린지리그)'
                        : '(SBS 컵)'}
                  </span>
                </div>
                {highlights.best_overall.league === 'challenge' &&
                highlights.best_positions?.super ? (
                  <div className="mt-1 text-sm text-gray-600">
                    / 슈퍼리그 최고 {highlights.best_positions.super}위
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-2 text-gray-400">기록 없음</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
