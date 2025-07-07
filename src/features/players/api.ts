import { supabase } from '@/lib/supabase/client';
import {
  Player,
  PlayerInput,
  PlayerUpdate,
  PlayerWithTeam,
} from '@/lib/types/database';

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

// Create player
export const createPlayer = async (
  playerData: PlayerInput
): Promise<Player> => {
  const { data, error } = await supabase
    .from('players')
    .insert(playerData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create player: ${error.message}`);
  }

  return data;
};

// Update player information
export const updatePlayer = async (
  playerId: number,
  playerData: PlayerUpdate
): Promise<Player> => {
  const { data, error } = await supabase
    .from('players')
    .update(playerData)
    .eq('player_id', playerId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update player: ${error.message}`);
  }

  return data;
};

// Delete player
export const deletePlayer = async (playerId: number): Promise<void> => {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('player_id', playerId);

  if (error) {
    throw new Error(`Failed to delete player: ${error.message}`);
  }
};
