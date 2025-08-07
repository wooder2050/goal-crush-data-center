import {
  PlayerMatchStats,
  PlayerSeasonStats,
  Standing,
  TeamSeasonStats,
} from '@/lib/types';

// Prisma 기반 Stats API 클라이언트 함수들
// 기존 Supabase API와 동일한 인터페이스를 제공하지만 Next.js API Routes를 사용

// ========== Player Match Statistics ==========

// Get player match statistics by match
export const getPlayerMatchStatsPrisma = async (
  matchId: number
): Promise<PlayerMatchStats[]> => {
  const response = await fetch(`/api/stats/player-match?match_id=${matchId}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch player match statistics: ${response.statusText}`
    );
  }
  return response.json();
};

// Get player match statistics by player
export const getPlayerMatchStatsByPlayerPrisma = async (
  playerId: number
): Promise<PlayerMatchStats[]> => {
  const response = await fetch(`/api/stats/player-match?player_id=${playerId}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch player match statistics: ${response.statusText}`
    );
  }
  return response.json();
};

// ========== Player Season Statistics ==========

// Get player season statistics by season
export const getPlayerSeasonStatsPrisma = async (
  seasonId: number
): Promise<PlayerSeasonStats[]> => {
  const response = await fetch(
    `/api/stats/player-season?season_id=${seasonId}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch player season statistics: ${response.statusText}`
    );
  }
  return response.json();
};

// Get player season statistics by player
export const getPlayerSeasonStatsByPlayerPrisma = async (
  playerId: number
): Promise<PlayerSeasonStats[]> => {
  const response = await fetch(
    `/api/stats/player-season?player_id=${playerId}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch player season statistics: ${response.statusText}`
    );
  }
  return response.json();
};

// Get top scorers
export const getTopScorersPrisma = async (
  seasonId: number,
  limit: number = 10
): Promise<PlayerSeasonStats[]> => {
  const response = await fetch(
    `/api/stats/player-season?season_id=${seasonId}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch top scorers: ${response.statusText}`);
  }
  return response.json();
};

// ========== Team Season Statistics ==========

// Get team season statistics by season
export const getTeamSeasonStatsPrisma = async (
  seasonId: number
): Promise<TeamSeasonStats[]> => {
  const response = await fetch(`/api/stats/team-season?season_id=${seasonId}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch team season statistics: ${response.statusText}`
    );
  }
  return response.json();
};

// Get team season statistics by team
export const getTeamSeasonStatsByTeamPrisma = async (
  teamId: number
): Promise<TeamSeasonStats[]> => {
  const response = await fetch(`/api/stats/team-season?team_id=${teamId}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch team season statistics: ${response.statusText}`
    );
  }
  return response.json();
};

// ========== Standings ==========

// Get standings by season
export const getStandingsPrisma = async (
  seasonId: number
): Promise<Standing[]> => {
  const response = await fetch(`/api/stats/standings?season_id=${seasonId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch standings: ${response.statusText}`);
  }
  return response.json();
};

// Get standings with team name by season
export const getStandingsWithTeamPrisma = async (seasonId: number) => {
  const response = await fetch(`/api/stats/standings?season_id=${seasonId}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch standings with team: ${response.statusText}`
    );
  }
  return response.json();
};

// ========== Group League Standings ==========

// Get group league standings by season and tournament stage
export const getGroupLeagueStandingsPrisma = async (
  seasonId: number,
  tournamentStage?: string,
  groupStage?: string
) => {
  const params = new URLSearchParams({
    season_id: seasonId.toString(),
  });

  if (tournamentStage && tournamentStage !== 'all') {
    params.append('tournament_stage', tournamentStage);
  }

  if (groupStage && groupStage !== 'all') {
    params.append('group_stage', groupStage);
  }

  const response = await fetch(`/api/stats/group-league-standings?${params}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch group league standings: ${response.statusText}`
    );
  }
  return response.json();
};
