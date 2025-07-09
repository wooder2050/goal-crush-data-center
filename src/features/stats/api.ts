import { supabase } from '@/lib/supabase/client';
import {
  PlayerMatchStats,
  PlayerMatchStatsInput,
  PlayerMatchStatsUpdate,
  PlayerSeasonStats,
  PlayerSeasonStatsInput,
  PlayerSeasonStatsUpdate,
  Standing,
  StandingInput,
  StandingUpdate,
  TeamSeasonStats,
  TeamSeasonStatsInput,
  TeamSeasonStatsUpdate,
} from '@/lib/types/database';

// ========== Player Match Statistics ==========

// Get player match statistics by match
export const getPlayerMatchStats = async (
  matchId: number
): Promise<PlayerMatchStats[]> => {
  const { data, error } = await supabase
    .from('player_match_stats')
    .select('*')
    .eq('match_id', matchId);

  if (error) {
    throw new Error(
      `Failed to fetch player match statistics: ${error.message}`
    );
  }

  return data || [];
};

// Get player match statistics by player
export const getPlayerMatchStatsByPlayer = async (
  playerId: number
): Promise<PlayerMatchStats[]> => {
  const { data, error } = await supabase
    .from('player_match_stats')
    .select('*')
    .eq('player_id', playerId)
    .order('match_id', { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch player match statistics: ${error.message}`
    );
  }

  return data || [];
};

// Create player match statistics
export const createPlayerMatchStats = async (
  statsData: PlayerMatchStatsInput
): Promise<PlayerMatchStats> => {
  const { data, error } = await supabase
    .from('player_match_stats')
    .insert(statsData)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to create player match statistics: ${error.message}`
    );
  }

  return data;
};

// Update player match statistics
export const updatePlayerMatchStats = async (
  statsId: number,
  statsData: PlayerMatchStatsUpdate
): Promise<PlayerMatchStats> => {
  const { data, error } = await supabase
    .from('player_match_stats')
    .update(statsData)
    .eq('id', statsId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update player match statistics: ${error.message}`
    );
  }

  return data;
};

// ========== Player Season Statistics ==========

// Get player season statistics by season
export const getPlayerSeasonStats = async (
  seasonId: number
): Promise<PlayerSeasonStats[]> => {
  const { data, error } = await supabase
    .from('player_season_stats')
    .select('*')
    .eq('season_id', seasonId)
    .order('total_goals', { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch player season statistics: ${error.message}`
    );
  }

  return data || [];
};

// Get player season statistics by player
export const getPlayerSeasonStatsByPlayer = async (
  playerId: number
): Promise<PlayerSeasonStats[]> => {
  const { data, error } = await supabase
    .from('player_season_stats')
    .select('*')
    .eq('player_id', playerId)
    .order('season_id', { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch player season statistics: ${error.message}`
    );
  }

  return data || [];
};

// Get top scorers
export const getTopScorers = async (
  seasonId: number,
  limit: number = 10
): Promise<PlayerSeasonStats[]> => {
  const { data, error } = await supabase
    .from('player_season_stats')
    .select('*')
    .eq('season_id', seasonId)
    .order('total_goals', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch top scorers: ${error.message}`);
  }

  return data || [];
};

// Create player season statistics
export const createPlayerSeasonStats = async (
  statsData: PlayerSeasonStatsInput
): Promise<PlayerSeasonStats> => {
  const { data, error } = await supabase
    .from('player_season_stats')
    .insert(statsData)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to create player season statistics: ${error.message}`
    );
  }

  return data;
};

// Update player season statistics
export const updatePlayerSeasonStats = async (
  statsId: number,
  statsData: PlayerSeasonStatsUpdate
): Promise<PlayerSeasonStats> => {
  const { data, error } = await supabase
    .from('player_season_stats')
    .update(statsData)
    .eq('id', statsId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update player season statistics: ${error.message}`
    );
  }

  return data;
};

// ========== Team Season Statistics ==========

// Get team season statistics by season
export const getTeamSeasonStats = async (
  seasonId: number
): Promise<TeamSeasonStats[]> => {
  const { data, error } = await supabase
    .from('team_season_stats')
    .select('*')
    .eq('season_id', seasonId)
    .order('points', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch team season statistics: ${error.message}`);
  }

  return data || [];
};

// Get team season statistics by team
export const getTeamSeasonStatsByTeam = async (
  teamId: number
): Promise<TeamSeasonStats[]> => {
  const { data, error } = await supabase
    .from('team_season_stats')
    .select('*')
    .eq('team_id', teamId)
    .order('season_id', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch team season statistics: ${error.message}`);
  }

  return data || [];
};

// Create team season statistics
export const createTeamSeasonStats = async (
  statsData: TeamSeasonStatsInput
): Promise<TeamSeasonStats> => {
  const { data, error } = await supabase
    .from('team_season_stats')
    .insert(statsData)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to create team season statistics: ${error.message}`
    );
  }

  return data;
};

// Update team season statistics
export const updateTeamSeasonStats = async (
  statsId: number,
  statsData: TeamSeasonStatsUpdate
): Promise<TeamSeasonStats> => {
  const { data, error } = await supabase
    .from('team_season_stats')
    .update(statsData)
    .eq('id', statsId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update team season statistics: ${error.message}`
    );
  }

  return data;
};

// ========== Standings ==========

// Get standings by season
export const getStandings = async (seasonId: number): Promise<Standing[]> => {
  const { data, error } = await supabase
    .from('standings')
    .select('*')
    .eq('season_id', seasonId)
    .order('rank', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch standings: ${error.message}`);
  }

  return data || [];
};

// Create standing
export const createStanding = async (
  standingData: StandingInput
): Promise<Standing> => {
  const { data, error } = await supabase
    .from('standings')
    .insert(standingData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create standing: ${error.message}`);
  }

  return data;
};

// Update standing
export const updateStanding = async (
  standingId: number,
  standingData: StandingUpdate
): Promise<Standing> => {
  const { data, error } = await supabase
    .from('standings')
    .update(standingData)
    .eq('id', standingId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update standing: ${error.message}`);
  }

  return data;
};

// Delete standing
export const deleteStanding = async (standingId: number): Promise<void> => {
  const { error } = await supabase
    .from('standings')
    .delete()
    .eq('id', standingId);

  if (error) {
    throw new Error(`Failed to delete standing: ${error.message}`);
  }
};
