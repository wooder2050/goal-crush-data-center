'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { type MatchResultFormValues } from '@/common/form/fields';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreateAssistData,
  CreateGoalData,
  CreateLineupData,
  CreatePenaltyData,
  CreateSubstitutionData,
  MatchCoachResponse,
} from '@/features/admin/api';
import MatchDataDisplay from '@/features/admin/components/MatchDataDisplay';
import MatchDialogs from '@/features/admin/components/MatchDialogs';
import MatchErrorState from '@/features/admin/components/MatchErrorState';
import MatchHeader from '@/features/admin/components/MatchHeader';
import MatchInfo from '@/features/admin/components/MatchInfo';
import { MatchDetailPageSkeleton } from '@/features/admin/components/skeletons';
import {
  AssistsTab,
  CoachesTab,
  GoalsTab,
  LineupsTab,
  PenaltiesTab,
  ScoreTab,
  SubstitutionsTab,
} from '@/features/admin/components/tabs';
import { useMatchAssists } from '@/features/admin/hooks/useAssistQuery';
import { useMatchCoaches } from '@/features/admin/hooks/useCoachQuery';
import { useMatchLineups } from '@/features/admin/hooks/useLineupQuery';
import { useMatchData } from '@/features/admin/hooks/useMatchData';
import { useMatchGoals } from '@/features/admin/hooks/useMatchGoalsQuery';
import { useMatchDetail } from '@/features/admin/hooks/useMatchQuery';
import { useMatchPenalties } from '@/features/admin/hooks/usePenaltyQuery';
import { useTeamPlayers } from '@/features/admin/hooks/usePlayersQuery';
import { useSubmitMatchData } from '@/features/admin/hooks/useSubmitMatchData';
import { useMatchSubstitutions } from '@/features/admin/hooks/useSubstitutionQuery';

export const dynamic = 'force-dynamic';

export default function RecordMatchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = Number(params.match_id as string);

  const {
    data: match,
    isLoading: isLoadingMatch,
    error: matchError,
  } = useMatchDetail(matchId);

  // 골 목록 조회
  const { data: goals = [], isLoading: isLoadingGoals } =
    useMatchGoals(matchId);

  // 어시스트, 라인업, 교체, 페널티킥, 감독 목록 조회
  const { data: assists = [] } = useMatchAssists(matchId);
  const { data: lineups = [] } = useMatchLineups(matchId);
  const { data: substitutions = [] } = useMatchSubstitutions(matchId);
  const { data: penalties = [] } = useMatchPenalties(matchId);
  const { data: coaches = [] } = useMatchCoaches(matchId);

  // 팀별 선수 목록 조회
  const { data: homePlayers = [], isLoading: isLoadingHomePlayers } =
    useTeamPlayers(match?.home_team_id || null);

  const { data: awayPlayers = [], isLoading: isLoadingAwayPlayers } =
    useTeamPlayers(match?.away_team_id || null);

  // 현재 활성화된 탭
  const [activeTab, setActiveTab] = useState('score');

  // 다이얼로그 상태 관리
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [assistDialogOpen, setAssistDialogOpen] = useState(false);
  const [lineupDialogOpen, setLineupDialogOpen] = useState(false);
  const [substitutionDialogOpen, setSubstitutionDialogOpen] = useState(false);
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);

  // 경기 데이터 관리
  const {
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
    addCoach,
    removeCoach,
    validateData,
    resetMatchData,
  } = useMatchData(matchId);

  // 유효성 검증 결과 상태
  const [validationResult, setValidationResult] = useState<
    | {
        isValid: boolean;
        errors: Record<string, string[]>;
      }
    | undefined
  >(undefined);

  // 최종 제출 mutation
  const submitMatchDataMutation = useSubmitMatchData();

  // 경기 데이터 로드 상태 추적
  const [dataLoaded, setDataLoaded] = useState(false);

  // 경기 정보가 로드되면 스코어 설정 및 기존 데이터 로드

  // 스코어 설정
  if (match && !dataLoaded) {
    // 스코어 설정
    if (match.home_score !== null) {
      updateScore({
        home_score: match.home_score,
        away_score: match.away_score !== null ? match.away_score : 0,
        penalty_home_score: match.penalty_home_score,
        penalty_away_score: match.penalty_away_score,
        status: match.status || 'completed',
      });
    }

    // 기존 중복 로직 제거됨 - 아래 독립 블록들이 처리

    // 데이터 로드 완료 표시
    setDataLoaded(true);
  }

  // 골 데이터 독립 로드
  if (match && goals.length > 0 && matchData.goals.length === 0) {
    goals.forEach((goal) => {
      addGoal({
        player_id: goal.player_id,
        goal_time: goal.goal_time,
        goal_type: goal.goal_type,
        description: goal.description,
        player_name: goal.player?.name || '알 수 없음',
        jersey_number: goal.player?.jersey_number || null,
      });
    });
  }

  // 라인업 데이터 독립 로드
  if (match && lineups.length > 0 && matchData.lineups.length === 0) {
    lineups.forEach((lineup) => {
      addLineup({
        player_id: lineup.player_id,
        team_id: lineup.team_id,
        position: lineup.position || '',
        jersey_number: lineup.player?.jersey_number,
        minutes_played: lineup.minutes_played || 0,
        player_name: lineup.player?.name || '알 수 없음',
        team_name: lineup.team?.team_name || '알 수 없음',
      });
    });
  }

  // 교체 데이터 독립 로드
  if (
    match &&
    substitutions.length > 0 &&
    matchData.substitutions.length === 0
  ) {
    substitutions.forEach((sub) => {
      addSubstitution({
        team_id: sub.team_id,
        player_in_id: sub.player_in_id,
        player_out_id: sub.player_out_id,
        substitution_time: sub.substitution_time,
        description: sub.substitution_reason,
        player_in_name: sub.player_in?.name || '알 수 없음',
        player_out_name: sub.player_out?.name || '알 수 없음',
        team_name: sub.team?.team_name || '알 수 없음',
      });
    });
  }

  // 승부차기 데이터 독립 로드
  if (match && penalties.length > 0 && matchData.penalties.length === 0) {
    penalties.forEach((penalty) => {
      addPenalty({
        team_id: penalty.team_id,
        player_id: penalty.kicker_id,
        goalkeeper_id: penalty.goalkeeper_id,
        is_scored: penalty.is_successful,
        order: penalty.kicker_order,
        player_name: penalty.kicker?.name || '알 수 없음',
        goalkeeper_name: penalty.goalkeeper?.name || '알 수 없음',
        team_name: penalty.team?.team_name || '알 수 없음',
      });
    });
  }

  // 어시스트 데이터 독립 로드 (골 데이터가 있을 때)
  if (
    match &&
    assists.length > 0 &&
    matchData.assists.length === 0 &&
    matchData.goals.length > 0
  ) {
    // 골 ID 매핑 생성
    const goalIdMap = new Map<number, string>();
    matchData.goals.forEach((goal) => {
      const apiGoal = goals.find(
        (g) =>
          g.player_id === goal.player_id &&
          g.goal_time === goal.goal_time &&
          g.goal_type === goal.goal_type
      );
      if (apiGoal) {
        goalIdMap.set(apiGoal.goal_id, goal.id);
      }
    });

    assists.forEach((assist) => {
      const goalId = goalIdMap.get(assist.goal_id);
      if (goalId) {
        addAssist({
          player_id: assist.player_id,
          goal_id: goalId,
          description: assist.description,
          player_name: assist.player?.name || '알 수 없음',
          goal_time: assist.goal?.goal_time || 0,
          goal_player_name: assist.goal?.player?.name || '알 수 없음',
        });
      }
    });
  }

  // 감독 데이터 독립 로드
  if (match && coaches.length > 0 && matchData.coaches.length === 0) {
    coaches.forEach((coach: MatchCoachResponse) => {
      addCoach({
        team_id: coach.team_id,
        coach_id: coach.coach_id,
        role: coach.role,
        description: coach.description,
        coach_name: coach.coach_name || '알 수 없음',
        team_name: coach.team_name || '알 수 없음',
      });
    });
  }

  // 핸들러 함수들
  const handleBackClick = () => router.push('/admin/matches/record');

  const handleScoreSubmit = async (values: MatchResultFormValues) => {
    const scoreData = {
      home_score: parseInt(values.home_score),
      away_score: parseInt(values.away_score),
      penalty_home_score: values.penalty_home_score
        ? parseInt(values.penalty_home_score)
        : null,
      penalty_away_score: values.penalty_away_score
        ? parseInt(values.penalty_away_score)
        : null,
      status: 'completed',
    };

    updateScore(scoreData);
    const result = validateData();
    setValidationResult(result);
    setActiveTab('goals');
  };

  const handleFinalSubmit = async () => {
    const result = validateData();
    setValidationResult(result);

    if (!result.isValid) {
      alert('데이터 유효성 검증에 실패했습니다. 오류를 수정해주세요.');
      return;
    }

    try {
      await submitMatchDataMutation.mutateAsync({ matchId, matchData });
      alert('모든 데이터가 성공적으로 저장되었습니다.');
      resetMatchData();
      router.push('/admin/matches');
    } catch (error) {
      console.error('데이터 제출 실패:', error);
      alert('데이터 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const dialogSubmitHandlers = {
    onSubmitGoal: async (data: CreateGoalData) => {
      try {
        addGoal({ ...data, goal_type: data.goal_type || 'normal' });
        setGoalDialogOpen(false);
      } catch (error) {
        console.error('골 추가 실패:', error);
        alert('골 추가 중 오류가 발생했습니다.');
      }
    },
    onSubmitAssist: async (data: CreateAssistData) => {
      try {
        addAssist({ ...data, goal_id: data.goal_id.toString() });
        setAssistDialogOpen(false);
      } catch (error) {
        console.error('어시스트 추가 실패:', error);
        alert('어시스트 추가 중 오류가 발생했습니다.');
      }
    },
    onSubmitLineup: async (data: CreateLineupData) => {
      try {
        addLineup(data);
        setLineupDialogOpen(false);
      } catch (error) {
        console.error('라인업 추가 실패:', error);
        alert('라인업 추가 중 오류가 발생했습니다.');
      }
    },
    onSubmitSubstitution: async (data: CreateSubstitutionData) => {
      try {
        addSubstitution(data);
        setSubstitutionDialogOpen(false);
      } catch (error) {
        console.error('교체 추가 실패:', error);
        alert('교체 추가 중 오류가 발생했습니다.');
      }
    },
    onSubmitPenalty: async (data: CreatePenaltyData) => {
      try {
        addPenalty(data);
        setPenaltyDialogOpen(false);
      } catch (error) {
        console.error('페널티킥 추가 실패:', error);
        alert('페널티킥 추가 중 오류가 발생했습니다.');
      }
    },
  };

  // 로딩 상태 처리
  if (isLoadingMatch) {
    return <MatchDetailPageSkeleton />;
  }

  // 에러 상태 처리
  if (matchError || !match) {
    return (
      <MatchErrorState
        errorMessage={matchError?.message}
        onBackClick={handleBackClick}
      />
    );
  }

  return (
    <Container className="py-8">
      <div className="space-y-8">
        <MatchHeader onBackClick={handleBackClick} />

        <Card className="p-6">
          <MatchInfo match={match} />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="score">스코어</TabsTrigger>
              <TabsTrigger value="goals">골</TabsTrigger>
              <TabsTrigger value="assists">어시스트</TabsTrigger>
              <TabsTrigger value="lineups">라인업</TabsTrigger>
              <TabsTrigger value="substitutions">교체</TabsTrigger>
              <TabsTrigger value="penalties">승부차기</TabsTrigger>
              <TabsTrigger value="coaches">감독</TabsTrigger>
            </TabsList>

            <TabsContent value="score">
              <ScoreTab match={match} onSubmit={handleScoreSubmit} />
            </TabsContent>

            <TabsContent value="goals">
              <GoalsTab
                goals={goals}
                isLoading={isLoadingGoals}
                onAddGoal={() => setGoalDialogOpen(true)}
                actualGoals={matchData.goals}
                onRemoveGoal={removeGoal}
              />
            </TabsContent>

            <TabsContent value="assists">
              <AssistsTab
                isLoading={isLoadingGoals}
                onAddAssist={() => setAssistDialogOpen(true)}
                actualAssists={matchData.assists}
                onRemoveAssist={removeAssist}
              />
            </TabsContent>

            <TabsContent value="lineups">
              <LineupsTab
                homeTeamName={match.home_team?.team_name || ''}
                awayTeamName={match.away_team?.team_name || ''}
                homePlayers={homePlayers}
                awayPlayers={awayPlayers}
                isLoadingHomePlayers={isLoadingHomePlayers}
                isLoadingAwayPlayers={isLoadingAwayPlayers}
                onAddLineup={() => setLineupDialogOpen(true)}
                actualLineups={matchData.lineups}
                substitutions={matchData.substitutions}
                onRemoveLineup={removeLineup}
              />
            </TabsContent>

            <TabsContent value="substitutions">
              <SubstitutionsTab
                isLoadingPlayers={isLoadingHomePlayers || isLoadingAwayPlayers}
                onAddSubstitution={() => setSubstitutionDialogOpen(true)}
                actualSubstitutions={matchData.substitutions}
                onRemoveSubstitution={removeSubstitution}
              />
            </TabsContent>

            <TabsContent value="penalties">
              <PenaltiesTab
                isLoadingPlayers={isLoadingHomePlayers || isLoadingAwayPlayers}
                onAddPenalty={() => setPenaltyDialogOpen(true)}
                actualPenalties={matchData.penalties}
                onRemovePenalty={removePenalty}
              />
            </TabsContent>

            <TabsContent value="coaches">
              <CoachesTab
                matchId={matchId}
                actualCoaches={coaches}
                onRemoveCoach={() => {
                  // 감독 삭제 후 목록 새로고침
                  window.location.reload();
                }}
              />
            </TabsContent>
          </Tabs>
        </Card>

        <MatchDataDisplay
          matchData={matchData}
          validationResult={validationResult}
          onRemoveGoal={removeGoal}
          onRemoveAssist={removeAssist}
          onRemoveLineup={removeLineup}
          onRemoveSubstitution={removeSubstitution}
          onRemovePenalty={removePenalty}
          onRemoveCoach={(coachId) => {
            removeCoach(coachId);
          }}
          onSubmit={handleFinalSubmit}
        />
      </div>

      {match && (
        <MatchDialogs
          match={match}
          goals={goals}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
          dialogStates={{
            goalDialogOpen,
            assistDialogOpen,
            lineupDialogOpen,
            substitutionDialogOpen,
            penaltyDialogOpen,
          }}
          onDialogStateChange={{
            setGoalDialogOpen,
            setAssistDialogOpen,
            setLineupDialogOpen,
            setSubstitutionDialogOpen,
            setPenaltyDialogOpen,
          }}
          onSubmitHandlers={dialogSubmitHandlers}
        />
      )}
    </Container>
  );
}
