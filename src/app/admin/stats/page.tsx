'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { H1, H2 } from '@/components/ui/typography';
import { getAllSeasonsPrisma } from '@/features/seasons/api-prisma';
import { useGoalMutation } from '@/hooks/useGoalMutation';
import { useGoalQuery } from '@/hooks/useGoalQuery';

export const dynamic = 'force-dynamic';

export default function AdminStatsPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  // 시즌 목록 가져오기
  const { data: seasons = [], isLoading: isLoadingSeasons } = useGoalQuery(
    getAllSeasonsPrisma,
    []
  );

  // 통계 재생성 mutation
  const regenerateAllMutation = useGoalMutation(
    async (params: { season_id?: string; type: string }) => {
      const queryParams =
        params.season_id && params.season_id !== 'all'
          ? `?season_id=${params.season_id}&type=${params.type}`
          : `?type=${params.type}`;

      const response = await fetch(
        `/api/admin/stats/regenerate${queryParams}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('통계 재생성에 실패했습니다.');
      }

      return response.json();
    }
  );

  // 개별 통계 재생성 mutation
  const regenerateSpecificMutation = useGoalMutation(
    async (params: { season_id?: string; type: string; typeName: string }) => {
      const queryParams =
        params.season_id && params.season_id !== 'all'
          ? `?season_id=${params.season_id}&type=${params.type}`
          : `?type=${params.type}`;

      const response = await fetch(
        `/api/admin/stats/regenerate${queryParams}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error(`${params.typeName} 재생성에 실패했습니다.`);
      }

      return response.json();
    }
  );

  // 통계 검증 mutation
  const validateStatsMutation = useGoalMutation(async (season_id?: string) => {
    const queryParams =
      season_id && season_id !== 'all' ? `?season_id=${season_id}` : '';

    const response = await fetch(`/api/admin/stats/validate${queryParams}`);

    if (!response.ok) {
      throw new Error('통계 검증에 실패했습니다.');
    }

    return response.json();
  });

  // 전체 통계 재생성
  const handleRegenerateAll = async () => {
    if (
      !confirm(
        '모든 통계를 재생성하시겠습니까?\n⚠️ 이 작업은 시간이 오래 걸릴 수 있습니다.'
      )
    ) {
      return;
    }

    try {
      const result = await regenerateAllMutation.mutateAsync({
        season_id: selectedSeason,
        type: 'all',
      });

      alert(
        `통계 재생성이 완료되었습니다!\n\n재생성된 데이터:\n- 순위표: ${result.results.standings}개\n- 선수 통계: ${result.results.player_season_stats}개\n- 팀 통계: ${result.results.team_season_stats}개\n- 팀-시즌: ${result.results.team_seasons}개\n- 상대전적: ${result.results.h2h_pair_stats}개`
      );
    } catch (error) {
      console.error('통계 재생성 실패:', error);
      alert('통계 재생성 중 오류가 발생했습니다.');
    }
  };

  // 개별 통계 재생성
  const handleRegenerateSpecific = async (type: string, typeName: string) => {
    if (!confirm(`${typeName} 통계를 재생성하시겠습니까?`)) {
      return;
    }

    try {
      const result = await regenerateSpecificMutation.mutateAsync({
        season_id: selectedSeason,
        type,
        typeName,
      });

      alert(
        `${typeName} 재생성이 완료되었습니다!\n재생성된 데이터: ${result.results[type]}개`
      );
    } catch (error) {
      console.error(`${typeName} 재생성 실패:`, error);
      alert(`${typeName} 재생성 중 오류가 발생했습니다.`);
    }
  };

  // 통계 검증
  const handleValidateStats = async () => {
    try {
      const result = await validateStatsMutation.mutateAsync(selectedSeason);

      alert(
        `통계 검증 결과:\n${result.message}\n\n발견된 문제: ${result.issues?.length || 0}개`
      );
    } catch (error) {
      console.error('통계 검증 실패:', error);
      alert('통계 검증 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container className="py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <H1>통계 데이터 관리</H1>
          <Link href="/admin/matches">
            <Button variant="outline">관리자 메뉴로 돌아가기</Button>
          </Link>
        </div>

        {/* 시즌 선택 */}
        <Card className="p-6">
          <H2 className="mb-4">시즌 선택</H2>
          <div className="max-w-md">
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger>
                <SelectValue placeholder="전체 시즌 (선택사항)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 시즌</SelectItem>
                {isLoadingSeasons ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    로딩 중...
                  </div>
                ) : (
                  seasons.map((season) => (
                    <SelectItem
                      key={season.season_id}
                      value={season.season_id.toString()}
                    >
                      {season.season_name} ({season.year})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              {selectedSeason === 'all'
                ? '모든 시즌이 처리됩니다.'
                : `선택된 시즌 (${selectedSeason})만 처리됩니다.`}
            </p>
          </div>
        </Card>

        {/* 전체 재생성 */}
        <Card className="p-6">
          <H2 className="mb-4">🔄 전체 통계 재생성</H2>
          <p className="text-muted-foreground mb-4">
            모든 통계 데이터를 경기 결과로부터 다시 계산합니다. 데이터 오류가
            의심될 때 사용하세요.
          </p>
          <Button
            onClick={handleRegenerateAll}
            disabled={regenerateAllMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {regenerateAllMutation.isPending
              ? '재생성 중...'
              : '🚨 모든 통계 재생성'}
          </Button>
        </Card>

        {/* 개별 통계 재생성 */}
        <Card className="p-6">
          <H2 className="mb-4">📊 개별 통계 재생성</H2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">순위표 (standings)</h3>
              <p className="text-sm text-muted-foreground">
                팀별 승점, 순위 등
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRegenerateSpecific('standings', '순위표')}
                disabled={regenerateSpecificMutation.isPending}
              >
                재생성
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">선수 통계 (player_season_stats)</h3>
              <p className="text-sm text-muted-foreground">
                골, 어시스트, 출장 등
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleRegenerateSpecific('player_stats', '선수 통계')
                }
                disabled={regenerateSpecificMutation.isPending}
              >
                재생성
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">팀 통계 (team_season_stats)</h3>
              <p className="text-sm text-muted-foreground">팀별 시즌 성적</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleRegenerateSpecific('team_stats', '팀 통계')
                }
                disabled={regenerateSpecificMutation.isPending}
              >
                재생성
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">팀-시즌 (team_seasons)</h3>
              <p className="text-sm text-muted-foreground">시즌 참가 팀 관계</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleRegenerateSpecific('team_seasons', '팀-시즌 관계')
                }
                disabled={regenerateSpecificMutation.isPending}
              >
                재생성
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">상대전적 (h2h_pair_stats)</h3>
              <p className="text-sm text-muted-foreground">팀간 맞대결 기록</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRegenerateSpecific('h2h', '상대전적')}
                disabled={regenerateSpecificMutation.isPending}
              >
                재생성
              </Button>
            </div>
          </div>
        </Card>

        {/* 데이터 검증 */}
        <Card className="p-6">
          <H2 className="mb-4">✅ 데이터 무결성 검증</H2>
          <p className="text-muted-foreground mb-4">
            통계 데이터와 원본 경기 데이터 간의 일치성을 확인합니다.
          </p>
          <Button
            variant="outline"
            onClick={handleValidateStats}
            disabled={validateStatsMutation.isPending}
          >
            데이터 검증 실행
          </Button>
        </Card>

        {/* 주의사항 */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <H2 className="mb-4 text-yellow-800">⚠️ 주의사항</H2>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li>
              • 통계 재생성은 기존 데이터를 완전히 삭제하고 다시 생성합니다.
            </li>
            <li>
              • 재생성 중에는 사용자에게 잘못된 데이터가 노출될 수 있습니다.
            </li>
            <li>
              • 대량의 경기 데이터가 있을 경우 처리 시간이 오래 걸릴 수
              있습니다.
            </li>
            <li>• 중요한 작업 전에는 반드시 데이터베이스 백업을 권장합니다.</li>
          </ul>
        </Card>
      </div>
    </Container>
  );
}
