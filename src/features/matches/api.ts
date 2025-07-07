import { supabase } from '@/lib/supabase/client';
import {
  Match,
  MatchInput,
  MatchUpdate,
  MatchWithTeams,
} from '@/lib/types/database';

// Get all matches
export const getMatches = async (): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch matches: ${error.message}`);
  }

  return data || [];
};

// Get match by ID
export const getMatchById = async (matchId: number): Promise<Match | null> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('match_id', matchId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Match not found
    }
    throw new Error(`Failed to fetch match: ${error.message}`);
  }

  return data;
};

// Get match with teams
export const getMatchWithTeams = async (
  matchId: number
): Promise<MatchWithTeams | null> => {
  const { data, error } = await supabase
    .from('matches')
    .select(
      `
      *,
      home_team:teams!matches_home_team_id_fkey(*),
      away_team:teams!matches_away_team_id_fkey(*),
      season:seasons(*)
    `
    )
    .eq('match_id', matchId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch match with teams: ${error.message}`);
  }

  return data as MatchWithTeams;
};

// Get matches by season
export const getMatchesBySeason = async (
  seasonId: number
): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('season_id', seasonId)
    .order('match_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch matches by season: ${error.message}`);
  }

  return data || [];
};

// Get matches by team (home or away)
export const getMatchesByTeam = async (teamId: number): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .order('match_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch matches by team: ${error.message}`);
  }

  return data || [];
};

// Get matches by date range
export const getMatchesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .gte('match_date', startDate)
    .lte('match_date', endDate)
    .order('match_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch matches by date range: ${error.message}`);
  }

  return data || [];
};

// Get completed matches (matches with scores)
export const getCompletedMatches = async (): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .not('home_score', 'is', null)
    .not('away_score', 'is', null)
    .order('match_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch completed matches: ${error.message}`);
  }

  return data || [];
};

// Get upcoming matches (matches without scores)
export const getUpcomingMatches = async (): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or('home_score.is.null,away_score.is.null')
    .order('match_date', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch upcoming matches: ${error.message}`);
  }

  return data || [];
};

// Create match
export const createMatch = async (matchData: MatchInput): Promise<Match> => {
  const { data, error } = await supabase
    .from('matches')
    .insert(matchData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create match: ${error.message}`);
  }

  return data;
};

// Update match information
export const updateMatch = async (
  matchId: number,
  matchData: MatchUpdate
): Promise<Match> => {
  const { data, error } = await supabase
    .from('matches')
    .update(matchData)
    .eq('match_id', matchId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update match: ${error.message}`);
  }

  return data;
};

// Delete match
export const deleteMatch = async (matchId: number): Promise<void> => {
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('match_id', matchId);

  if (error) {
    throw new Error(`Failed to delete match: ${error.message}`);
  }
};
