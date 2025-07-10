import { supabase } from '@/lib/supabase/client';
import { Player, PlayerWithTeam } from '@/lib/types/database';

// Get all players
export const getPlayers = async (): Promise<Player[]> => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch players: ${error.message}`);
  }

  return data || [];
};

// Get player by ID
export const getPlayerById = async (
  playerId: number
): Promise<Player | null> => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('player_id', playerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Player not found
    }
    throw new Error(`Failed to fetch player: ${error.message}`);
  }

  return data;
};

// Get player with current team information
export const getPlayerWithCurrentTeam = async (
  playerId: number
): Promise<PlayerWithTeam | null> => {
  const { data, error } = await supabase
    .from('players')
    .select(
      `
      *,
      team:player_team_history!inner(
        team:teams(*)
      )
    `
    )
    .eq('player_id', playerId)
    .is('player_team_history.end_date', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch player with team: ${error.message}`);
  }

  return data as PlayerWithTeam;
};

// Search players by name
export const searchPlayersByName = async (name: string): Promise<Player[]> => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .ilike('name', `%${name}%`)
    .order('name');

  if (error) {
    throw new Error(`Failed to search players: ${error.message}`);
  }

  return data || [];
};

// Get players by position
export const getPlayersByPosition = async (
  position: string
): Promise<Player[]> => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('position', position)
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch players by position: ${error.message}`);
  }

  return data || [];
};
