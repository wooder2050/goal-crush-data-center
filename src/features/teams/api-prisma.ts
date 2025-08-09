import type { TeamWithExtras } from '@/features/teams/types';
import { Player, PlayerTeamHistory, Team } from '@/lib/types';

// 추가 타입 정의
export type PlayerWithTeamHistory = Player & {
  player_team_history: PlayerTeamHistory[];
};

export type TeamStats = {
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
  win_rate: number; // percentage (0-100)
};

export type TeamSeasonStandingRow = {
  year: number;
  season_id: number | null;
  season_name: string | null;
  league: 'super' | 'challenge' | 'playoff' | 'cup' | 'other';
  participated: boolean;
  position: number | null;
  matches_played: number;
  points: number;
};

// Prisma 기반 Teams API 클라이언트 함수들
// 기존 Supabase API와 동일한 인터페이스를 제공하지만 Next.js API Routes를 사용

// ============== Basic Team CRUD Operations ==============

// Get all teams
export const getTeamsPrisma = async (): Promise<TeamWithExtras[]> => {
  const response = await fetch('/api/teams');
  if (!response.ok) {
    throw new Error(`Failed to fetch teams: ${response.statusText}`);
  }
  return response.json();
};

// Get team by ID (throws on not found)
export const getTeamByIdPrisma = async (teamId: number): Promise<Team> => {
  const response = await fetch(`/api/teams/${teamId}`);
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? 'Team not found'
        : `Failed to fetch team: ${response.statusText}`
    );
  }
  return response.json();
};

// Get teams by season
export const getTeamsBySeasonPrisma = async (
  seasonId: number
): Promise<Team[]> => {
  const response = await fetch(`/api/teams?season_id=${seasonId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch teams by season: ${response.statusText}`);
  }
  return response.json();
};

// Get team players
export const getTeamPlayersPrisma = async (
  teamId: number,
  scope: 'current' | 'all' = 'all'
): Promise<PlayerWithTeamHistory[]> => {
  const qs = scope ? `?scope=${scope}` : '';
  const response = await fetch(`/api/teams/${teamId}/players${qs}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch team players: ${response.statusText}`);
  }
  return response.json();
};

// Get team stats (optional seasonId)
export const getTeamStatsPrisma = async (
  teamId: number,
  seasonId?: number
): Promise<TeamStats> => {
  const qs = seasonId ? `?season_id=${seasonId}` : '';
  const response = await fetch(`/api/teams/${teamId}/stats${qs}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch team stats: ${response.statusText}`);
  }
  return response.json();
};

export const getTeamSeasonStandingsPrisma = async (
  teamId: number
): Promise<TeamSeasonStandingRow[]> => {
  const res = await fetch(`/api/teams/${teamId}/season-standings`);
  if (!res.ok) {
    throw new Error(`Failed to fetch team season standings: ${res.statusText}`);
  }
  return res.json();
};
