'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { SeasonBasic, TeamWithExtras } from '@/features/teams/types';
import { inferLeague, shortenSeasonName } from '@/lib/utils';

function StarsArc({
  count,
  radius = 60,
  startDeg = -140,
  endDeg = -40,
  twoSpan = 24,
  className = 'text-yellow-400 text-[16px] sm:text-[20px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]',
}: {
  count: number;
  radius?: number;
  startDeg?: number;
  endDeg?: number;
  twoSpan?: number;
  className?: string;
}) {
  const n = Math.min(Math.max(count, 0), 8);
  if (n <= 0) return null;
  // 두 개일 때는 상단 중앙(-90°) 기준으로 더 좁은 범위로 압축 배치
  const mid = (startDeg + endDeg) / 2;
  const localStart = n === 2 ? mid - twoSpan / 2 : startDeg;
  const localEnd = n === 2 ? mid + twoSpan / 2 : endDeg;
  const angles = Array.from({ length: n }, (_, i) =>
    n === 1 ? mid : localStart + (i * (localEnd - localStart)) / (n - 1)
  );
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {angles.map((deg, i) => (
        <span
          key={i}
          className={`absolute left-1/2 top-1/2 leading-none ${className}`}
          style={{
            transform: `translate(-50%,-50%) rotate(${deg}deg) translate(${radius}px) rotate(${-deg}deg)`,
          }}
        >
          ⭐️
        </span>
      ))}
    </div>
  );
}

// TROPHY ICON WAS PREVIOUSLY AROUND THE LOGO. NOW WE PLACE IT AT CARD CORNER.

function sanitizeSeasonName(name: string) {
  return shortenSeasonName(name);
}

function getInitial(name?: string) {
  if (!name || name.length === 0) return '?';
  return name.charAt(0);
}

function normalizeHex(hex?: string): string {
  if (!hex) return '#000000';
  const h = hex.trim();
  if (/^#([0-9a-fA-F]{6})$/.test(h)) return h;
  if (/^#([0-9a-fA-F]{3})$/.test(h)) {
    const r = h[1];
    const g = h[2];
    const b = h[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return '#000000';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = normalizeHex(hex).slice(1);
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbaFromHex(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getContrastingTextColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  // relative luminance
  const sr = r / 255;
  const sg = g / 255;
  const sb = b / 255;
  const R = sr <= 0.03928 ? sr / 12.92 : Math.pow((sr + 0.055) / 1.055, 2.4);
  const G = sg <= 0.03928 ? sg / 12.92 : Math.pow((sg + 0.055) / 1.055, 2.4);
  const B = sb <= 0.03928 ? sb / 12.92 : Math.pow((sb + 0.055) / 1.055, 2.4);
  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  return luminance > 0.5 ? '#111111' : '#FFFFFF';
}

interface TeamGridProps {
  teams: TeamWithExtras[];
}

export default function TeamGrid({ teams }: TeamGridProps) {
  const orderedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const ca = a.championships_count ?? 0;
      const cb = b.championships_count ?? 0;
      if (cb !== ca) return cb - ca; // desc by championships
      return a.team_name.localeCompare(b.team_name);
    });
  }, [teams]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {orderedTeams.map((team) => {
        const seasons = (team.team_seasons ?? [])
          .map((ts) => ts.season)
          .filter((s): s is SeasonBasic => !!s);
        // 최신 시즌부터 정렬: year desc, tie-breaker by season_id desc
        const seasonsSorted = [...seasons].sort((a, b) => {
          const yA = (a as SeasonBasic).year ?? -1;
          const yB = (b as SeasonBasic).year ?? -1;
          if (yB !== yA) return yB - yA;
          return (b.season_id ?? 0) - (a.season_id ?? 0);
        });

        const maxBadgeCount = 4; // 최대 4개만 표기
        const overflowCount = Math.max(seasonsSorted.length - maxBadgeCount, 0);
        const visibleCount =
          overflowCount > 0 ? maxBadgeCount - 1 : maxBadgeCount; // +N 뱃지 자리 확보
        const displayedSeasons = seasonsSorted.slice(0, visibleCount);

        const repsText = (team.representative_players ?? [])
          .slice(0, 2)
          .map(
            (p) => `#${p.jersey_number ?? '-'} ${p.name} (${p.appearances}경기)`
          )
          .join(', ');

        // 우승 타입 분류: 챔피언 매치 / SBS 컵(cup) vs 그 외(리그 등)
        const championships = team.championships ?? [];
        const cupWinsCount = championships.filter(
          (c) => inferLeague(c.season_name ?? null) === 'cup'
        ).length;
        const totalWins = championships.length;
        const leagueWinsCount = Math.max(totalWins - cupWinsCount, 0);

        return (
          <Link key={team.team_id} href={`/teams/${team.team_id}`}>
            <Card className="relative p-0 sm:p-0 group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="p-0">
                {/* 이미지 영역 (정사각 비율) */}
                <div
                  className="relative aspect-square w-full overflow-hidden rounded-xl"
                  style={{
                    background: team.primary_color
                      ? `linear-gradient(180deg, ${rgbaFromHex(team.primary_color, 0.12)} 0%, ${rgbaFromHex(
                          team.primary_color,
                          0.04
                        )} 100%)`
                      : undefined,
                  }}
                >
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
                        <span
                          className="text-xl md:text-2xl font-semibold"
                          style={{
                            color: team.primary_color
                              ? getContrastingTextColor(team.primary_color)
                              : '#555555',
                          }}
                        >
                          {getInitial(team.team_name)}
                        </span>
                      )}
                    </div>
                  </div>
                  {leagueWinsCount > 0 && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <div className="block md:hidden">
                        <StarsArc
                          count={leagueWinsCount}
                          radius={66}
                          startDeg={-140}
                          endDeg={-40}
                        />
                      </div>
                      <div className="hidden md:block">
                        <StarsArc
                          count={leagueWinsCount}
                          radius={78}
                          startDeg={-140}
                          endDeg={-40}
                        />
                      </div>
                    </div>
                  )}
                  {cupWinsCount > 0 && (
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 pointer-events-none">
                      <div
                        className="leading-none text-yellow-500 text-[18px] sm:text-[22px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] text-right"
                        aria-label={`컵 우승 ${cupWinsCount}회`}
                        title={`컵 우승 ${cupWinsCount}회`}
                      >
                        {'🏆'.repeat(Math.min(cupWinsCount, 8))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 텍스트 영역 */}
                <div className="p-3 space-y-2 min-h-[12rem] md:min-h-[13rem] flex flex-col">
                  <div className="text-lg font-semibold flex items-center gap-1">
                    <span className="truncate">{team.team_name}</span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {team.founded_year
                      ? `${team.founded_year}년 창단`
                      : '창단년도 미상'}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-1 gap-y-1 overflow-hidden max-h-[3.25rem] md:max-h-[3.25rem]">
                    {displayedSeasons.map((s, i) => {
                      const isLast = i === displayedSeasons.length - 1;
                      if (overflowCount > 0 && isLast) {
                        return [
                          <Badge
                            key={s.season_id}
                            variant="outline"
                            className="text-[10px] h-6 leading-6 px-2"
                          >
                            {sanitizeSeasonName(s.season_name)}
                          </Badge>,
                          <Badge
                            key={`overflow-${team.team_id}`}
                            variant="outline"
                            className="text-[10px] h-6 leading-6 px-2"
                          >
                            +{overflowCount}
                          </Badge>,
                        ];
                      }
                      return (
                        <Badge
                          key={s.season_id}
                          variant="outline"
                          className="text-[10px] h-6 leading-6 px-2"
                        >
                          {sanitizeSeasonName(s.season_name)}
                        </Badge>
                      );
                    })}
                  </div>

                  {/* 대표 선수 두 줄 요약 */}
                  <div className="text-[11px] text-gray-500 mt-3">
                    {repsText || '대표 선수 정보 없음'}
                  </div>

                  {/* 하단 우승 기록: 대회 이름 + 트로피 이모지 */}
                  {Array.isArray(team.championships) && (
                    <div className="mt-auto pt-2 text-[11px] border-t border-gray-100">
                      {team.championships.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {team.championships.map((c) => (
                            <Badge
                              key={c.season_id}
                              variant="trophyOutline"
                              className="px-2 py-0.5 text-[9px] md:text-[11px]"
                            >
                              🏆 {sanitizeSeasonName(c.season_name ?? '')}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">우승 없음</span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
