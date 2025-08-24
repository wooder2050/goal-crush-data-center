'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useGoalMutation } from '@/hooks/useGoalMutation';

import {
  createAssist,
  createGoal,
  createLineup,
  createPenalty,
  createSubstitution,
  updateMatch,
} from '../api';
import { MatchData } from '../types';

interface SubmitMatchDataParams {
  matchId: number;
  matchData: MatchData;
}

// 모든 경기 데이터를 서버에 제출하는 훅
export function useSubmitMatchData() {
  const queryClient = useQueryClient();

  // 모든 데이터를 순차적으로 제출하는 함수
  const submitAllData = async ({
    matchId,
    matchData,
  }: SubmitMatchDataParams) => {
    try {
      // 1. 먼저 스코어 업데이트
      await updateMatch(matchId, matchData.score);

      // 2. 골 데이터 추가
      const goalPromises = matchData.goals.map((goal) => {
        // UI 표시용 필드를 제외한 API 호출용 데이터 준비
        const goalData = {
          player_id: goal.player_id,
          goal_time: goal.goal_time,
          goal_type: goal.goal_type,
          description: goal.description,
        };
        return createGoal(matchId, goalData);
      });
      const createdGoals = await Promise.all(goalPromises);

      // 3. 어시스트 데이터 추가
      // 임시 ID를 실제 골 ID로 매핑
      const goalIdMap = new Map();
      matchData.goals.forEach((matchGoal, index) => {
        if (createdGoals[index]) {
          goalIdMap.set(matchGoal.id, createdGoals[index].goal_id);
        }
      });

      const assistPromises = matchData.assists.map((assist) => {
        // 임시 골 ID를 실제 골 ID로 변환
        const realGoalId = goalIdMap.get(assist.goal_id);
        if (!realGoalId) {
          throw new Error(`연결된 골을 찾을 수 없습니다: ${assist.goal_id}`);
        }

        // UI 표시용 필드를 제외한 API 호출용 데이터 준비
        const assistData = {
          player_id: assist.player_id,
          goal_id: realGoalId,
          description: assist.description,
        };
        return createAssist(matchId, assistData);
      });
      await Promise.all(assistPromises);

      // 4. 라인업 데이터 추가
      const lineupPromises = matchData.lineups.map((lineup) => {
        // UI 표시용 필드를 제외한 API 호출용 데이터 준비
        const lineupData = {
          player_id: lineup.player_id,
          team_id: lineup.team_id,
          position: lineup.position,
          jersey_number: lineup.jersey_number,
          minutes_played: lineup.minutes_played || 0, // 출전 시간 포함
        };
        return createLineup(matchId, lineupData);
      });
      await Promise.all(lineupPromises);

      // 5. 교체 데이터 추가
      const substitutionPromises = matchData.substitutions.map(
        (substitution) => {
          // UI 표시용 필드를 제외한 API 호출용 데이터 준비
          const substitutionData = {
            team_id: substitution.team_id,
            player_in_id: substitution.player_in_id,
            player_out_id: substitution.player_out_id,
            substitution_time: substitution.substitution_time,
            description: substitution.description,
          };
          return createSubstitution(matchId, substitutionData);
        }
      );
      await Promise.all(substitutionPromises);

      // 6. 페널티킥 데이터 추가
      const penaltyPromises = matchData.penalties.map((penalty) => {
        // UI 표시용 필드를 제외한 API 호출용 데이터 준비
        const penaltyData = {
          team_id: penalty.team_id,
          player_id: penalty.player_id,
          goalkeeper_id: penalty.goalkeeper_id,
          is_scored: penalty.is_scored,
          order: penalty.order,
        };
        return createPenalty(matchId, penaltyData);
      });
      await Promise.all(penaltyPromises);

      // 7. 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['getGoals', JSON.stringify([matchId])],
      });
      queryClient.invalidateQueries({
        queryKey: ['getAssists', JSON.stringify([matchId])],
      });
      queryClient.invalidateQueries({
        queryKey: ['getLineups', JSON.stringify([matchId])],
      });
      queryClient.invalidateQueries({
        queryKey: ['getSubstitutions', JSON.stringify([matchId])],
      });
      queryClient.invalidateQueries({
        queryKey: ['getPenalties', JSON.stringify([matchId])],
      });
      queryClient.invalidateQueries({
        queryKey: ['getMatch', JSON.stringify([matchId])],
      });

      return true;
    } catch (error) {
      console.error('데이터 제출 중 오류 발생:', error);
      throw error;
    }
  };

  return useGoalMutation<boolean, Error, SubmitMatchDataParams>(submitAllData);
}
