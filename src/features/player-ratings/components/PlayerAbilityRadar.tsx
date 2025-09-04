'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { PlayerAbilityAggregate } from '@/features/player-ratings/types';
import {
  ABILITY_CATEGORIES,
  ABILITY_METADATA,
} from '@/features/player-ratings/types';

interface PlayerAbilityRadarProps {
  aggregate: PlayerAbilityAggregate;
  title?: string;
}

interface CategoryStats {
  name: string;
  value: number;
  color: string;
}

export function PlayerAbilityRadar({
  aggregate,
  title = '능력치',
}: PlayerAbilityRadarProps) {
  // 카테고리별 평균 계산
  const calculateCategoryAverage = (category: string): number => {
    const abilities = Object.entries(ABILITY_METADATA)
      .filter(([, meta]) => meta.category === category)
      .map(([key]) => {
        const avgKey = `avg_${key}` as keyof PlayerAbilityAggregate;
        return (aggregate[avgKey] as number) || 50;
      });

    if (abilities.length === 0) return 50;

    return Math.round(
      abilities.reduce((sum, val) => sum + val, 0) / abilities.length
    );
  };

  const categoryStats: CategoryStats[] = [
    {
      name: '공격',
      value: calculateCategoryAverage(ABILITY_CATEGORIES.ATTACK),
      color: '#ef4444', // red
    },
    {
      name: '패스',
      value: calculateCategoryAverage(ABILITY_CATEGORIES.PASSING),
      color: '#3b82f6', // blue
    },
    {
      name: '드리블',
      value: calculateCategoryAverage(ABILITY_CATEGORIES.DRIBBLING),
      color: '#10b981', // green
    },
    {
      name: '수비',
      value: calculateCategoryAverage(ABILITY_CATEGORIES.DEFENDING),
      color: '#f59e0b', // yellow
    },
    {
      name: '피지컬',
      value: calculateCategoryAverage(ABILITY_CATEGORIES.PHYSICAL),
      color: '#8b5cf6', // purple
    },
    {
      name: '멘탈',
      value: calculateCategoryAverage(ABILITY_CATEGORIES.MENTAL),
      color: '#06b6d4', // cyan
    },
  ];

  // 골키퍼 능력치가 있으면 추가
  const gkAverage = calculateCategoryAverage(ABILITY_CATEGORIES.GOALKEEPER);
  if (gkAverage > 50) {
    // 골키퍼 능력치가 기본값보다 높으면 골키퍼로 판단
    categoryStats.push({
      name: '골키퍼',
      value: gkAverage,
      color: '#ec4899', // pink
    });
  }

  const overallRating = aggregate.avg_overall_rating || 50;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          {title}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>전체 평점:</span>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-primary">
                {Math.round(overallRating)}
              </span>
              <span>/99</span>
            </div>
          </div>
        </CardTitle>
        <p className="text-sm text-gray-600">
          {aggregate.total_ratings}명의 평가 기준
        </p>
      </CardHeader>

      <CardContent>
        {/* 레이더 차트 대신 가로 막대 그래프 (2열) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryStats.map((category) => (
            <div key={category.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{category.name}</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: category.color }}
                >
                  {category.value}/99
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(category.value / 99) * 100}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>

              {/* 등급 표시 */}
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">
                  {getRatingGrade(category.value)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 전체 평점 막대 */}
        <div className="mt-5 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">전체 평점</span>
            <span className="text-lg font-bold text-primary">
              {Math.round(overallRating)}/99
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
              style={{
                width: `${(overallRating / 99) * 100}%`,
              }}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">
              {getRatingGrade(overallRating)}
            </span>
            <span className="text-xs text-gray-500">
              마지막 업데이트:{' '}
              {new Date(aggregate.last_updated).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 평점에 따른 등급 반환
function getRatingGrade(rating: number): string {
  if (rating >= 86) return '월드클래스';
  if (rating >= 71) return '리그 상위권';
  if (rating >= 51) return '프로 평균';
  if (rating >= 31) return '세미프로';
  return '아마추어';
}
