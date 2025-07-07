import { supabase } from '@/lib/supabase/client';
import { Season, SeasonInput, SeasonUpdate } from '@/lib/types/database';

// Get all seasons
export const getSeasons = async (): Promise<Season[]> => {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .order('year', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch seasons: ${error.message}`);
  }

  return data || [];
};

// Get season by ID
export const getSeasonById = async (
  seasonId: number
): Promise<Season | null> => {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('season_id', seasonId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Season not found
    }
    throw new Error(`Failed to fetch season: ${error.message}`);
  }

  return data;
};

// Get seasons by year
export const getSeasonsByYear = async (year: number): Promise<Season[]> => {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('year', year)
    .order('season_name');

  if (error) {
    throw new Error(`Failed to fetch seasons by year: ${error.message}`);
  }

  return data || [];
};

// Get latest season
export const getLatestSeason = async (): Promise<Season | null> => {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .order('year', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch latest season: ${error.message}`);
  }

  return data;
};

// Search seasons by name
export const searchSeasonsByName = async (name: string): Promise<Season[]> => {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .ilike('season_name', `%${name}%`)
    .order('year', { ascending: false });

  if (error) {
    throw new Error(`Failed to search seasons: ${error.message}`);
  }

  return data || [];
};

// Create season
export const createSeason = async (
  seasonData: SeasonInput
): Promise<Season> => {
  const { data, error } = await supabase
    .from('seasons')
    .insert(seasonData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create season: ${error.message}`);
  }

  return data;
};

// Update season information
export const updateSeason = async (
  seasonId: number,
  seasonData: SeasonUpdate
): Promise<Season> => {
  const { data, error } = await supabase
    .from('seasons')
    .update(seasonData)
    .eq('season_id', seasonId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update season: ${error.message}`);
  }

  return data;
};

// Delete season
export const deleteSeason = async (seasonId: number): Promise<void> => {
  const { error } = await supabase
    .from('seasons')
    .delete()
    .eq('season_id', seasonId);

  if (error) {
    throw new Error(`Failed to delete season: ${error.message}`);
  }
};
