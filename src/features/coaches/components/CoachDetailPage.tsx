'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

import { fetchCoachFull } from '../api-prisma';
import CoachSeasonStats from './CoachSeasonStats';
import CoachTimeline from './CoachTimeline';

interface CoachDetailPageProps {
  coachId: number;
}

function CoachDetailPageInner({ coachId }: CoachDetailPageProps) {
  const { data: full } = useGoalSuspenseQuery(fetchCoachFull, [coachId]);
  const coach = full?.coach;
  const overview = full?.overview;
  const currentTeamVerified = full?.current_team_verified;
  const trophies = overview?.trophies;
  const [activeTab, setActiveTab] = useState<'stats' | 'timeline'>('stats');
  const totals = (overview?.season_stats ?? []).reduce(
    (acc: { wins: number; losses: number; matches: number }, s) => {
      return {
        wins: acc.wins + (s.wins ?? 0),
        losses: acc.losses + (s.losses ?? 0),
        matches: acc.matches + (s.matches_played ?? 0),
      };
    },
    { wins: 0, losses: 0, matches: 0 }
  );
  const winRate =
    totals.matches > 0 ? Math.round((totals.wins / totals.matches) * 100) : 0;

  if (!coach) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">감독 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const totalTeams = new Set(coach.team_coach_history.map((h) => h.team_id))
    .size;

  const totalMatches = overview?.total_matches ?? coach.match_coaches.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-start md:space-x-6 space-y-4 md:space-y-0">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full overflow-hidden bg-gray-200">
              {coach.profile_image_url ? (
                <Image
                  src={coach.profile_image_url}
                  alt={`${coach.name} 프로필`}
                  fill
                  className="object-cover object-top"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl text-gray-500">
                    {coach.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {coach.name}
            </h1>

            {coach.nationality && (
              <p className="text-base md:text-lg text-gray-600 mb-2 md:mb-3">
                {coach.nationality}
              </p>
            )}
            {trophies && trophies.items.length > 0 && (
              <div className="mb-3 md:mb-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  {trophies.items.map((it) => (
                    <span
                      key={it.season_id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800"
                      title={it.season_name}
                    >
                      🏆 {it.season_name.replace(/골때리는 그녀들/g, '').trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* 현재 맡고 있는 팀 */}
            <div className="mb-3 md:mb-4">
              {currentTeamVerified ? (
                <div className="flex items-center space-x-2 md:space-x-3">
                  {currentTeamVerified.logo && (
                    <div className="w-6 h-6 md:w-8 md:h-8 relative rounded-full overflow-hidden">
                      <Image
                        src={currentTeamVerified.logo}
                        alt={`${currentTeamVerified.team_name} 로고`}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-base md:text-lg font-semibold">
                      {currentTeamVerified.team_name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">맡은 팀 없음</div>
              )}
            </div>

            {/* 통계 요약 */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">활동 팀:</span>
                <span className="ml-1 font-semibold">{totalTeams}개</span>
              </div>
              <div>
                <span className="text-gray-500">총 경기:</span>
                <span className="ml-1 font-semibold">{totalMatches}경기</span>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">승리:</span>
                <span className="ml-1 font-semibold">{totals.wins}</span>
              </div>
              <div>
                <span className="text-gray-500">패배:</span>
                <span className="ml-1 font-semibold">{totals.losses}</span>
              </div>
              <div>
                <span className="text-gray-500">승률:</span>
                <span className="ml-1 font-semibold">{winRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-4 md:mb-6">
        <div className="border-b border-gray-200 overflow-x-auto overflow-y-hidden">
          <nav className="-mb-px flex space-x-4 md:space-x-8 whitespace-nowrap px-1">
            <button
              onClick={() => setActiveTab('stats')}
              className={
                `py-2 px-1 text-sm md:text-base font-medium ` +
                (activeTab === 'stats'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700')
              }
            >
              시즌별 통계
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={
                `py-2 px-1 text-sm md:text-base font-medium ` +
                (activeTab === 'timeline'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700')
              }
            >
              팀 이력
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'stats' ? (
        <div className="mb-6 md:mb-8">
          <CoachSeasonStats coachId={coachId} stats={overview?.season_stats} />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">팀 이력</h2>
          <CoachTimeline
            history={coach.team_coach_history}
            hasCurrent={Boolean(currentTeamVerified)}
          />
        </div>
      )}
    </div>
  );
}

const CoachDetailPage: React.FC<CoachDetailPageProps> = ({ coachId }) => {
  return <CoachDetailPageInner coachId={coachId} />;
};

export default CoachDetailPage;
