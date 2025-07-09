import { supabase } from '@/lib/supabase/client';
import {
  Player,
  PlayerTeamHistory,
  Team,
  TeamInput,
  TeamUpdate,
} from '@/lib/types/database';

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

// Search teams by name
export const searchTeamsByName = async (name: string): Promise<Team[]> => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .ilike('team_name', `%${name}%`)
    .order('team_name');

  if (error) {
    throw new Error(`Failed to search teams: ${error.message}`);
  }

  return data || [];
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

// Create team
export const createTeam = async (teamData: TeamInput): Promise<Team> => {
  const { data, error } = await supabase
    .from('teams')
    .insert(teamData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create team: ${error.message}`);
  }

  return data;
};

// Update team
export const updateTeam = async (
  teamId: number,
  teamData: TeamUpdate
): Promise<Team> => {
  const { data, error } = await supabase
    .from('teams')
    .update(teamData)
    .eq('team_id', teamId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update team: ${error.message}`);
  }

  return data;
};

// Delete team
export const deleteTeam = async (teamId: number): Promise<void> => {
  const { error } = await supabase.from('teams').delete().eq('team_id', teamId);

  if (error) {
    throw new Error(`Failed to delete team: ${error.message}`);
  }
};
