'use client';

import {
  CreateAssistData,
  CreateGoalData,
  CreateLineupData,
  CreatePenaltyData,
  CreateSubstitutionData,
  TeamInfo,
} from '@/features/admin/api';
import AddAssistDialog from '@/features/admin/components/AddAssistDialog';
import AddGoalDialog from '@/features/admin/components/AddGoalDialog';
import AddLineupDialog from '@/features/admin/components/AddLineupDialog';
import AddPenaltyDialog from '@/features/admin/components/AddPenaltyDialog';
import AddSubstitutionDialog from '@/features/admin/components/AddSubstitutionDialog';

interface Goal {
  goal_id: number;
  match_id: number;
  player_id: number;
  goal_time: number | null;
  goal_type: string | null;
  description?: string | null;
  team?: { team_name: string } | null;
  player?: { name: string; jersey_number: number | null } | null;
}

interface Player {
  player_id: number;
  name: string;
  jersey_number: number | null;
  position?: string;
}

interface MatchDialogsProps {
  match: {
    home_team: TeamInfo;
    away_team: TeamInfo;
  };
  goals: Goal[];
  homePlayers: Player[];
  awayPlayers: Player[];
  dialogStates: {
    goalDialogOpen: boolean;
    assistDialogOpen: boolean;
    lineupDialogOpen: boolean;
    substitutionDialogOpen: boolean;
    penaltyDialogOpen: boolean;
  };
  onDialogStateChange: {
    setGoalDialogOpen: (open: boolean) => void;
    setAssistDialogOpen: (open: boolean) => void;
    setLineupDialogOpen: (open: boolean) => void;
    setSubstitutionDialogOpen: (open: boolean) => void;
    setPenaltyDialogOpen: (open: boolean) => void;
  };
  onSubmitHandlers: {
    onSubmitGoal: (data: CreateGoalData) => Promise<void>;
    onSubmitAssist: (data: CreateAssistData) => Promise<void>;
    onSubmitLineup: (data: CreateLineupData) => Promise<void>;
    onSubmitSubstitution: (data: CreateSubstitutionData) => Promise<void>;
    onSubmitPenalty: (data: CreatePenaltyData) => Promise<void>;
  };
}

export default function MatchDialogs({
  match,
  goals,
  homePlayers,
  awayPlayers,
  dialogStates,
  onDialogStateChange,
  onSubmitHandlers,
}: MatchDialogsProps) {
  // Player 타입을 다이얼로그에서 요구하는 타입으로 변환
  const convertPlayers = (players: Player[]) =>
    players.map((player) => ({
      ...player,
      position: player.position || 'Unknown',
    }));

  const convertedHomePlayers = convertPlayers(homePlayers);
  const convertedAwayPlayers = convertPlayers(awayPlayers);

  // Goal 타입을 다이얼로그에서 요구하는 타입으로 변환
  const convertedGoals = goals.map((goal) => ({
    ...goal,
    goal_time: goal.goal_time || 0, // null인 경우 0으로 변환
    goal_type: goal.goal_type || 'regular', // null인 경우 'regular'로 변환
    description: goal.description ?? null, // undefined인 경우 null로 변환
    player: goal.player
      ? {
          ...goal.player,
          player_id: goal.player_id, // player_id 추가
        }
      : null,
    team: goal.team
      ? {
          ...goal.team,
          team_id: 0, // team_id 추가 (임시값)
        }
      : null,
  }));

  return (
    <>
      <AddGoalDialog
        open={dialogStates.goalDialogOpen}
        onOpenChange={onDialogStateChange.setGoalDialogOpen}
        homePlayers={convertedHomePlayers}
        awayPlayers={convertedAwayPlayers}
        onSubmit={onSubmitHandlers.onSubmitGoal}
      />

      <AddAssistDialog
        open={dialogStates.assistDialogOpen}
        onOpenChange={onDialogStateChange.setAssistDialogOpen}
        goals={convertedGoals}
        homePlayers={convertedHomePlayers}
        awayPlayers={convertedAwayPlayers}
        onSubmit={onSubmitHandlers.onSubmitAssist}
      />

      <AddLineupDialog
        open={dialogStates.lineupDialogOpen}
        onOpenChange={onDialogStateChange.setLineupDialogOpen}
        homeTeam={match.home_team}
        awayTeam={match.away_team}
        homePlayers={convertedHomePlayers}
        awayPlayers={convertedAwayPlayers}
        onSubmit={onSubmitHandlers.onSubmitLineup}
      />

      <AddSubstitutionDialog
        open={dialogStates.substitutionDialogOpen}
        onOpenChange={onDialogStateChange.setSubstitutionDialogOpen}
        homeTeam={match.home_team}
        awayTeam={match.away_team}
        homePlayers={convertedHomePlayers}
        awayPlayers={convertedAwayPlayers}
        onSubmit={onSubmitHandlers.onSubmitSubstitution}
      />

      <AddPenaltyDialog
        open={dialogStates.penaltyDialogOpen}
        onOpenChange={onDialogStateChange.setPenaltyDialogOpen}
        homeTeam={match.home_team}
        awayTeam={match.away_team}
        homePlayers={convertedHomePlayers}
        awayPlayers={convertedAwayPlayers}
        onSubmit={onSubmitHandlers.onSubmitPenalty}
      />
    </>
  );
}
