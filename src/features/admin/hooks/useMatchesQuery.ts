'use client';

import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getMatches, MatchWithRelations } from '../api';

/**
 * 모든 경기 목록을 조회하는 훅
 */
export function useAllMatches() {
  return useGoalQuery<typeof getMatches, [], MatchWithRelations[]>(
    getMatches,
    []
  );
}

/**
 * 최근 경기 목록을 조회하는 훅
 * @param limit 가져올 경기 수 (기본값: 5)
 */
export function useRecentMatches(limit: number = 5) {
  return useGoalQuery<
    typeof getMatches,
    [{ limit: number }],
    MatchWithRelations[]
  >(getMatches, [{ limit }]);
}

/**
 * 특정 상태의 경기 목록을 조회하는 훅
 * @param status 경기 상태 ('scheduled', 'completed', 'cancelled' 등)
 * @param limit 가져올 경기 수
 */
export function useMatchesByStatus(status: string, limit?: number) {
  return useGoalQuery<
    typeof getMatches,
    [{ status: string; limit?: number }],
    MatchWithRelations[]
  >(getMatches, [{ status, limit }]);
}

/**
 * 특정 시즌의 경기 목록을 조회하는 훅
 * @param seasonId 시즌 ID
 * @param limit 가져올 경기 수
 */
export function useMatchesBySeason(seasonId: number, limit?: number) {
  return useGoalQuery<
    typeof getMatches,
    [{ season_id: number; limit?: number }],
    MatchWithRelations[]
  >(getMatches, [{ season_id: seasonId, limit }]);
}

/**
 * 특정 팀의 경기 목록을 조회하는 훅
 * @param teamId 팀 ID
 * @param limit 가져올 경기 수
 */
export function useMatchesByTeam(teamId: number, limit?: number) {
  return useGoalQuery<
    typeof getMatches,
    [{ team_id: number; limit?: number }],
    MatchWithRelations[]
  >(getMatches, [{ team_id: teamId, limit }]);
}
