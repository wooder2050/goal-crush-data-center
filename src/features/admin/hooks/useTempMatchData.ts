'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  MatchAssist,
  MatchData,
  MatchGoal,
  MatchLineup,
  MatchPenalty,
  MatchSubstitution,
  ValidationResult,
} from '../types';

// 경기 데이터 관리를 위한 커스텀 훅
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useMatchData(_matchId: number) {
  // 경기 데이터 상태
  const [matchData, setMatchData] = useState<MatchData>({
    score: {
      home_score: 0,
      away_score: 0,
      penalty_home_score: null,
      penalty_away_score: null,
      status: 'completed',
    },
    goals: [],
    assists: [],
    lineups: [],
    substitutions: [],
    penalties: [],
    coaches: [],
  });

  // 스코어 업데이트
  const updateScore = (scoreData: Partial<MatchData['score']>) => {
    setMatchData((prev) => ({
      ...prev,
      score: {
        ...prev.score,
        ...scoreData,
      },
    }));
  };

  // 골 추가
  const addGoal = (goal: Omit<MatchGoal, 'id'>) => {
    const newGoal: MatchGoal = {
      ...goal,
      id: uuidv4(),
    };

    setMatchData((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));

    return newGoal.id;
  };

  // 골 삭제
  const removeGoal = (goalId: string) => {
    setMatchData((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== goalId),
      // 연결된 어시스트도 삭제
      assists: prev.assists.filter((assist) => assist.goal_id !== goalId),
    }));
  };

  // 어시스트 추가
  const addAssist = (assist: Omit<MatchAssist, 'id'>) => {
    const newAssist: MatchAssist = {
      ...assist,
      id: uuidv4(),
    };

    setMatchData((prev) => ({
      ...prev,
      assists: [...prev.assists, newAssist],
    }));

    return newAssist.id;
  };

  // 어시스트 삭제
  const removeAssist = (assistId: string) => {
    setMatchData((prev) => ({
      ...prev,
      assists: prev.assists.filter((assist) => assist.id !== assistId),
    }));
  };

  // 라인업 추가
  const addLineup = (lineup: Omit<MatchLineup, 'id'>) => {
    const newLineup: MatchLineup = {
      ...lineup,
      id: uuidv4(),
    };

    setMatchData((prev) => ({
      ...prev,
      lineups: [...prev.lineups, newLineup],
    }));

    return newLineup.id;
  };

  // 라인업 삭제
  const removeLineup = (lineupId: string) => {
    setMatchData((prev) => ({
      ...prev,
      lineups: prev.lineups.filter((lineup) => lineup.id !== lineupId),
    }));
  };

  // 교체 추가
  const addSubstitution = (substitution: Omit<MatchSubstitution, 'id'>) => {
    const newSubstitution: MatchSubstitution = {
      ...substitution,
      id: uuidv4(),
    };

    setMatchData((prev) => ({
      ...prev,
      substitutions: [...prev.substitutions, newSubstitution],
    }));

    return newSubstitution.id;
  };

  // 교체 삭제
  const removeSubstitution = (substitutionId: string) => {
    setMatchData((prev) => ({
      ...prev,
      substitutions: prev.substitutions.filter(
        (sub) => sub.id !== substitutionId
      ),
    }));
  };

  // 페널티킥 추가
  const addPenalty = (penalty: Omit<MatchPenalty, 'id'>) => {
    const newPenalty: MatchPenalty = {
      ...penalty,
      id: uuidv4(),
    };

    setMatchData((prev) => ({
      ...prev,
      penalties: [...prev.penalties, newPenalty],
    }));

    return newPenalty.id;
  };

  // 페널티킥 삭제
  const removePenalty = (penaltyId: string) => {
    setMatchData((prev) => ({
      ...prev,
      penalties: prev.penalties.filter((penalty) => penalty.id !== penaltyId),
    }));
  };

  // 데이터 유효성 검증
  const validateData = (): ValidationResult => {
    const errors: ValidationResult['errors'] = {};

    // 스코어 검증
    if (matchData.score.home_score < 0 || matchData.score.away_score < 0) {
      errors.score = ['점수는 0 이상이어야 합니다.'];
    }

    // 골 개수와 스코어 일치 검증
    const homeGoals = matchData.goals.filter(
      (g) => g.goal_type !== 'own_goal'
    ).length;
    const awayGoals = matchData.goals.filter(
      (g) => g.goal_type === 'own_goal'
    ).length;

    if (
      homeGoals + awayGoals !==
      matchData.score.home_score + matchData.score.away_score
    ) {
      if (!errors.goals) errors.goals = [];
      errors.goals.push('골 개수와 스코어가 일치하지 않습니다.');
    }

    // 어시스트 검증 - 존재하는 골에 대한 어시스트인지
    const goalIds = new Set(matchData.goals.map((g) => g.id));
    const invalidAssists = matchData.assists.filter(
      (a) => !goalIds.has(a.goal_id)
    );

    if (invalidAssists.length > 0) {
      if (!errors.assists) errors.assists = [];
      errors.assists.push('존재하지 않는 골에 대한 어시스트가 있습니다.');
    }

    // 페널티킥 검증
    if (
      matchData.score.penalty_home_score !== null &&
      matchData.score.penalty_away_score !== null
    ) {
      // 페널티킥 스코어가 있는 경우 페널티킥 데이터도 있어야 함
      if (matchData.penalties.length === 0) {
        if (!errors.penalties) errors.penalties = [];
        errors.penalties.push(
          '페널티킥 스코어가 있지만 페널티킥 데이터가 없습니다.'
        );
      }

      // 페널티킥 성공 개수와 스코어 일치 검증
      const homePenaltyGoals = matchData.penalties.filter(
        (p) => p.is_scored
      ).length;

      if (
        homePenaltyGoals !==
        matchData.score.penalty_home_score + matchData.score.penalty_away_score
      ) {
        if (!errors.penalties) errors.penalties = [];
        errors.penalties.push(
          '페널티킥 성공 개수와 스코어가 일치하지 않습니다.'
        );
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  // 모든 경기 데이터 초기화
  const resetMatchData = () => {
    setMatchData({
      score: {
        home_score: 0,
        away_score: 0,
        penalty_home_score: null,
        penalty_away_score: null,
        status: 'completed',
      },
      goals: [],
      assists: [],
      lineups: [],
      substitutions: [],
      penalties: [],
      coaches: [],
    });
  };

  return {
    matchData,
    updateScore,
    addGoal,
    removeGoal,
    addAssist,
    removeAssist,
    addLineup,
    removeLineup,
    addSubstitution,
    removeSubstitution,
    addPenalty,
    removePenalty,
    validateData,
    resetMatchData,
  };
}
