import { Player, PlayerTeamHistory, Team } from '@/lib/types';

// 추가 타입 정의
export type PlayerWithTeamHistory = Player & {
  player_team_history: PlayerTeamHistory[];
};

// Prisma 기반 Teams API 클라이언트 함수들
// 기존 Supabase API와 동일한 인터페이스를 제공하지만 Next.js API Routes를 사용

// ============== Basic Team CRUD Operations ==============

// Get all teams
export const getTeamsPrisma = async (): Promise<Team[]> => {
  const response = await fetch('/api/teams');
  if (!response.ok) {
    throw new Error(`Failed to fetch teams: ${response.statusText}`);
  }
  return response.json();
};

// Get team by ID
export const getTeamByIdPrisma = async (
  teamId: number
): Promise<Team | null> => {
  const response = await fetch(`/api/teams/${teamId}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null; // Team not found
    }
    throw new Error(`Failed to fetch team: ${response.statusText}`);
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
  teamId: number
): Promise<PlayerWithTeamHistory[]> => {
  const response = await fetch(`/api/teams/${teamId}/players`);
  if (!response.ok) {
    throw new Error(`Failed to fetch team players: ${response.statusText}`);
  }
  return response.json();
};
