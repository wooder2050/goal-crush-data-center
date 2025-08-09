'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { SeasonBasic, TeamWithExtras } from '@/features/teams/types';

function sanitizeSeasonName(name: string) {
  const p1 = '골때리는 그녀들 ';
  const p2 = '골 때리는 그녀들 ';
  if (name.startsWith(p1)) return name.slice(p1.length).trim();
  if (name.startsWith(p2)) return name.slice(p2.length).trim();
  return name.trim();
}

function getInitial(name?: string) {
  if (!name || name.length === 0) return '?';
  return name.charAt(0);
}

interface TeamGridProps {
  teams: TeamWithExtras[];
}

export default function TeamGrid({ teams }: TeamGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
      {teams.map((team) => {
        const seasons = (team.team_seasons ?? [])
          .map((ts) => ts.season)
          .filter((s): s is SeasonBasic => !!s);
        const maxBadgeCount = 12; // 두 줄 기준 더 많은 배지를 노출
        const displayedSeasons = seasons.slice(0, maxBadgeCount);
        const overflowCount = Math.max(
          seasons.length - displayedSeasons.length,
          0
        );

        const repsText = (team.representative_players ?? [])
          .slice(0, 2)
          .map(
            (p) => `#${p.jersey_number ?? '-'} ${p.name} (${p.appearances}경기)`
          )
          .join(', ');

        return (
          <Link key={team.team_id} href={`/teams/${team.team_id}`}>
            <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="p-0">
                {/* 이미지 영역 (정사각 비율) */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 md:w-32 md:h-32 relative rounded-full overflow-hidden flex items-center justify-center bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
                      {team.logo ? (
                        <Image
                          src={team.logo}
                          alt={`${team.team_name} 로고`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="128px"
                        />
                      ) : (
                        <span className="text-xl md:text-2xl text-gray-600 font-semibold">
                          {getInitial(team.team_name)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 텍스트 영역 */}
                <div className="p-5 space-y-2 h-48 md:h-52 overflow-hidden">
                  <div className="text-lg font-semibold truncate">
                    {team.team_name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {team.founded_year
                      ? `${team.founded_year}년 창단`
                      : '창단년도 미상'}
                  </div>

                  {/* 시즌 배지: 최대 12개 + 나머지 개수 (두 줄 고정) */}
                  <div className="mt-2 flex flex-wrap gap-x-1 gap-y-1 overflow-hidden max-h-[3.25rem] md:max-h-[3.25rem]">
                    {displayedSeasons.map((s) => (
                      <Badge
                        key={s.season_id}
                        variant="outline"
                        className="text-[10px] h-6 leading-6 px-2"
                      >
                        {sanitizeSeasonName(s.season_name)}
                      </Badge>
                    ))}
                    {overflowCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] h-6 leading-6 px-2"
                      >
                        +{overflowCount}
                      </Badge>
                    )}
                  </div>

                  {/* 대표 선수 두 줄 요약 */}
                  <div className="text-[13px] text-gray-500 mt-3 overflow-hidden max-h-10">
                    {repsText || '대표 선수 정보 없음'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
