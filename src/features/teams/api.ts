import { supabase } from '@/lib/supabase/client';
import { Player, PlayerTeamHistory, Team } from '@/lib/types/database';

export type PlayerWithTeamHistory = Player & {
  player_team_history: PlayerTeamHistory[];
};

// Get all teams
export const getTeams = async (): Promise<Team[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('team_name');

  if (error) {
    throw new Error(`Failed to fetch teams: ${error.message}`);
  }

  return data || [];
};

// Get team by ID
export const getTeamById = async (teamId: number): Promise<Team | null> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('team_id', teamId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Team not found
    }
    throw new Error(`Failed to fetch team: ${error.message}`);
  }

  return data;
};

// Get teams by season
export const getTeamsBySeason = async (seasonId: number): Promise<Team[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select(
      `
      *,
      team_seasons!inner(season_id)
    `
    )
    .eq('team_seasons.season_id', seasonId)
    .order('team_name');

  if (error) {
    throw new Error(`Failed to fetch teams by season: ${error.message}`);
  }

  return data || [];
};

// Get team players
export const getTeamPlayers = async (
  teamId: number
): Promise<PlayerWithTeamHistory[]> => {
  const { data, error } = await supabase
    .from('players')
    .select(
      `
      *,
      player_team_history!inner(
        team_id,
        start_date,
        end_date
      )
    `
    )
    .eq('player_team_history.team_id', teamId)
    .is('player_team_history.end_date', null)
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch team players: ${error.message}`);
  }
  return data || [];
};
