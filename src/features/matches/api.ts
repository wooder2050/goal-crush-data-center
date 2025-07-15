/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: 추후 리팩토링 필요
import { supabase } from '@/lib/supabase/client';
import {
  Match,
  MatchWithTeams,
  PenaltyShootoutDetailWithPlayers,
  Substitution,
  SubstitutionInput,
} from '@/lib/types/database';

// ============== Basic Match CRUD Operations ==============

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

// ============== Season-Specific Match Lists ==============

// Universal function to get matches by season ID with teams and season info
export const getMatchesBySeasonId = async (
  seasonId: number
): Promise<MatchWithTeams[]> => {
  try {
    // 관계형 조인 쿼리로 한 번에 모든 정보 조회
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
      .eq('season_id', seasonId)
      .order('match_date', { ascending: true });

    if (error) {
      console.error('Matches query error:', error);
      throw new Error(`Failed to fetch matches: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log(`No matches found for season ${seasonId}`);
      return [];
    }

    return data as MatchWithTeams[];
  } catch (error) {
    console.error(`getMatchesBySeasonId error for season ${seasonId}:`, error);
    throw error;
  }
};

// Legacy functions - kept for backward compatibility, but now use the universal function
export const getPilotSeasonMatches = async (): Promise<MatchWithTeams[]> => {
  return getMatchesBySeasonId(3);
};

export const getSeason1Matches = async (): Promise<MatchWithTeams[]> => {
  return getMatchesBySeasonId(4);
};

export const getSeason2Matches = async (): Promise<MatchWithTeams[]> => {
  return getMatchesBySeasonId(5);
};

// Original getPilotSeasonMatches implementation (now replaced)
export const getPilotSeasonMatchesOriginal = async (): Promise<
  MatchWithTeams[]
> => {
  try {
    // Get all matches for pilot season (season_id = 3)
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .eq('season_id', 3)
      .order('match_date', { ascending: true });

    if (matchesError) {
      console.error('Matches query error:', matchesError);
      throw new Error(`Failed to fetch matches: ${matchesError.message}`);
    }

    if (!matches || matches.length === 0) {
      console.log('No matches found for pilot season');
      return [];
    }

    // Get all teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*');

    if (teamsError) {
      console.error('Teams query error:', teamsError);
      throw new Error(`Failed to fetch teams: ${teamsError.message}`);
    }

    // Get season info
    const { data: season, error: seasonError } = await supabase
      .from('seasons')
      .select('*')
      .eq('season_id', 3)
      .single();

    if (seasonError) {
      console.error('Season query error:', seasonError);
      throw new Error(`Failed to fetch season: ${seasonError.message}`);
    }

    // Manually join the data
    const matchesWithTeams: MatchWithTeams[] = matches.map((match) => {
      const homeTeam = teams?.find((t) => t.team_id === match.home_team_id);
      const awayTeam = teams?.find((t) => t.team_id === match.away_team_id);

      if (!homeTeam || !awayTeam) {
        throw new Error(`Team not found for match ${match.match_id}`);
      }

      return {
        ...match,
        home_team: homeTeam,
        away_team: awayTeam,
        season: season,
      };
    });

    console.log('Processed pilot season matches:', matchesWithTeams);
    return matchesWithTeams;
  } catch (error) {
    console.error('getPilotSeasonMatches error:', error);
    throw error;
  }
};

// Get matches by season name
export const getMatchesBySeasonName = async (
  seasonName: string
): Promise<MatchWithTeams[]> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(*),
        away_team:teams!matches_away_team_id_fkey(*),
        season:seasons!inner(*)
      `
      )
      .eq('season.season_name', seasonName)
      .order('match_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch matches: ${error.message}`);
    }

    return data as MatchWithTeams[];
  } catch (error) {
    console.error('getMatchesBySeasonName error:', error);
    throw error;
  }
};

// ============== Substitution Management ==============

/**
 * Create a substitution record
 */
export async function createSubstitution(
  substitution: SubstitutionInput
): Promise<Substitution> {
  const { data, error } = await supabase
    .from('substitutions')
    .insert(substitution)
    .select()
    .single();

  if (error) {
    console.error('Error creating substitution:', error);
    throw error;
  }

  return data;
}

// ============== Universal API Functions for All Seasons ==============

// Get penalty shootout details
export const getPenaltyShootoutDetails = async (
  matchId: number
): Promise<PenaltyShootoutDetailWithPlayers[]> => {
  return getMatchPenaltyDetails(matchId);
};

/**
 * Universal function to get match details with teams and season info
 */
export async function getMatchDetails(
  matchId: number
): Promise<MatchWithTeams | null> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(
        `
        *,
        home_team:teams!matches_home_team_id_fkey(
          team_id,
          team_name
        ),
        away_team:teams!matches_away_team_id_fkey(
          team_id,
          team_name
        ),
        season:seasons(
          season_id,
          season_name,
          start_date,
          end_date
        )
      `
      )
      .eq('match_id', matchId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Match not found
      }
      throw new Error(`Failed to fetch match details: ${error.message}`);
    }

    return data as MatchWithTeams;
  } catch (error) {
    console.error('Error in getMatchDetails:', error);
    throw error;
  }
}

/**
 * Universal function to get goals for any match
 */
export async function getMatchGoals(matchId: number): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('goals')
      .select(
        `
        goal_id,
        match_id,
        player_id,
        goal_time,
        goal_type,
        player:players(name),
        player_match_stats!inner(
          team:teams(team_id, team_name)
        )
      `
      )
      .eq('match_id', matchId);

    if (error) {
      throw new Error(`Failed to fetch match goals: ${error.message}`);
    }
    // player_match_stats는 배열로 반환될 수 있으므로 첫 번째 값만 사용
    const goalsWithTeam =
      data?.map((goal) => ({
        ...goal,
        team: extractTeam(goal.player_match_stats),
      })) || [];

    return goalsWithTeam;
  } catch (error) {
    console.error('Error in getMatchGoals:', error);
    throw error;
  }
}

function extractTeam(
  pms: unknown
): { team_id: number; team_name: string } | null {
  if (Array.isArray(pms)) {
    return pms[0]?.team ?? null;
  }
  if (pms && typeof pms === 'object' && 'team' in pms) {
    return (
      (pms as { team: { team_id: number; team_name: string } }).team ?? null
    );
  }
  return null;
}

/**
 * Position 값을 정규화하는 함수
 */
const normalizePosition = (position: string): string => {
  if (!position) return 'Unknown';
  const lowerPos = position.toLowerCase();
  switch (lowerPos) {
    case 'goalkeeper':
    case 'gk':
      return 'Goalkeeper';
    case 'defender':
    case 'df':
      return 'Defender';
    case 'midfielder':
    case 'mf':
      return 'Midfielder';
    case 'forward':
    case 'fw':
      return 'Forward';
    default:
      return position;
  }
};

/**
 * Universal function to get lineups for any match
 */
export async function getMatchLineups(
  matchId: number
): Promise<Record<string, any[]>> {
  try {
    // Get match details first to know which teams are playing
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('match_id, home_team_id, away_team_id')
      .eq('match_id', matchId)
      .single();

    if (matchError) {
      throw new Error(`Failed to fetch match: ${matchError.message}`);
    }

    // Get player match stats for this match (실제 출전한 선수들)
    const { data: playerStats, error: statsError } = await supabase
      .from('player_match_stats')
      .select(
        `
        stat_id,
        match_id,
        player_id,
        team_id,
        goals,
        assists,
        yellow_cards,
        red_cards,
        minutes_played,
        saves,
        position,
        player:players(
          player_id,
          name,
          jersey_number
        ),
        team:teams(
          team_id,
          team_name
        )
      `
      )
      .eq('match_id', matchId);

    if (statsError) {
      throw new Error(`Failed to fetch player stats: ${statsError.message}`);
    }

    // Get substitutions for this match
    const { data: substitutions, error: subsError } = await supabase
      .from('substitutions')
      .select(
        `
        substitution_id,
        match_id,
        player_in_id,
        player_out_id,
        team_id,
        substitution_time,
        substitution_reason
      `
      )
      .eq('match_id', matchId);

    if (subsError) {
      throw new Error(`Failed to fetch substitutions: ${subsError.message}`);
    }

    // Create substitution lookup
    const substitutionsByMatch: Record<number, any[]> = {};
    substitutions?.forEach((sub) => {
      if (!substitutionsByMatch[sub.match_id]) {
        substitutionsByMatch[sub.match_id] = [];
      }
      substitutionsByMatch[sub.match_id].push(sub);
    });

    // Group by match and team
    const lineupsByMatch: Record<string, any[]> = {};
    const homeTeamKey = `${match.match_id}_${match.home_team_id}`;
    const awayTeamKey = `${match.match_id}_${match.away_team_id}`;

    lineupsByMatch[homeTeamKey] = [];
    lineupsByMatch[awayTeamKey] = [];

    // Process player match stats (실제 출전한 선수들만 처리)
    const processedPlayers = new Set<string>(); // 중복 방지를 위한 Set

    playerStats?.forEach((stat) => {
      const playerKey = `${stat.player_id}_${stat.team_id}`;

      // 이미 처리된 선수는 스킵
      if (processedPlayers.has(playerKey)) {
        return;
      }
      processedPlayers.add(playerKey);

      const teamKey = `${match.match_id}_${stat.team_id}`;

      // Check if this player was substituted
      const matchSubs = substitutionsByMatch[match.match_id] || [];
      const playerSubstitution = matchSubs.find(
        (sub) =>
          sub.player_in_id === stat.player_id ||
          sub.player_out_id === stat.player_id
      );

      // Determine participation status
      let participationStatus = 'bench'; // Default to bench

      if (playerSubstitution) {
        if (playerSubstitution.player_in_id === stat.player_id) {
          participationStatus = 'substitute';
        } else if (playerSubstitution.player_out_id === stat.player_id) {
          // 교체로 나간 선수는 선발로 간주
          participationStatus = 'starting';
        }
      } else if (stat.minutes_played === null || stat.minutes_played === 0) {
        participationStatus = 'bench';
      } else if (stat.minutes_played > 0 && stat.minutes_played >= 15) {
        participationStatus = 'starting';
      } else {
        // 15분 미만 출전했지만 교체 기록이 없는 경우는 벤치로 분류
        participationStatus = 'bench';
      }

      const playerData = {
        stat_id: stat.stat_id,
        match_id: match.match_id,
        player_id: stat.player_id,
        team_id: stat.team_id,
        goals: stat.goals || 0,
        assists: stat.assists || 0,
        yellow_cards: stat.yellow_cards || 0,
        red_cards: stat.red_cards || 0,
        minutes_played: stat.minutes_played || 0,
        saves: stat.saves || 0,
        position: normalizePosition(stat.position), // position 정규화
        player_name: (stat.player as any)?.name || 'Unknown',
        jersey_number: (stat.player as any)?.jersey_number ?? null,
        team_name: (stat.team as any)?.team_name || 'Unknown',
        participation_status: participationStatus,
      };

      if (lineupsByMatch[teamKey]) {
        lineupsByMatch[teamKey].push(playerData);
      }
    });

    const getPositionOrder = (position: string): number => {
      switch (position) {
        case 'Forward':
          return 0;
        case 'Midfielder':
          return 1;
        case 'Defender':
          return 2;
        case 'Goalkeeper':
          return 3;
        default:
          return 4;
      }
    };

    // Sort lineups: starting players first, then substitutes, then bench
    Object.keys(lineupsByMatch).forEach((key) => {
      lineupsByMatch[key].sort((a, b) => {
        const statusOrder = { starting: 0, substitute: 1, bench: 2 };
        const aOrder =
          statusOrder[a.participation_status as keyof typeof statusOrder] || 3;
        const bOrder =
          statusOrder[b.participation_status as keyof typeof statusOrder] || 3;

        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }

        // Within same status, sort by position
        const positionOrderA = getPositionOrder(a.position);
        const positionOrderB = getPositionOrder(b.position);
        if (positionOrderA !== positionOrderB) {
          return positionOrderA - positionOrderB;
        }

        // Within same position, sort by player name
        return (a.player_name || '').localeCompare(b.player_name || '', 'ko');
      });
    });

    return lineupsByMatch;
  } catch (error) {
    console.error('Error in getMatchLineups:', error);
    throw error;
  }
}

/**
 * Universal function to get penalty shootout details for any match
 */
export async function getMatchPenaltyDetails(matchId: number): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('penalty_shootout_details')
      .select(
        `
        penalty_detail_id,
        match_id,
        kicker_id,
        goalkeeper_id,
        team_id,
        kicker_order,
        is_successful,
        kick_description,
        kicker:players!penalty_shootout_details_kicker_id_fkey(
          player_id,
          name,
          jersey_number
        ),
        goalkeeper:players!penalty_shootout_details_goalkeeper_id_fkey(
          player_id,
          name,
          jersey_number
        ),
        team:teams(
          team_id,
          team_name
        )
      `
      )
      .eq('match_id', matchId)
      .order('kicker_order', { ascending: true });

    if (error) {
      throw new Error(
        `Failed to fetch penalty shootout details: ${error.message}`
      );
    }

    return data || [];
  } catch (error) {
    console.error('Error in getMatchPenaltyDetails:', error);
    throw error;
  }
}

// 시즌별 통계 요약 테이블 조회
export const getSeasonSummaries = async () => {
  const { data, error } = await supabase
    .from('season_summaries')
    .select('*')
    .order('season_id', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch season summaries: ${error.message}`);
  }

  return data || [];
};

// 시즌별 요약만 반환 (season_summaries 뷰 활용)
export const getSeasonSummaryBySeasonId = async (seasonId: number) => {
  const { data, error } = await supabase
    .from('season_summaries')
    .select('*')
    .eq('season_id', seasonId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch season summary: ${error.message}`);
  }

  return data;
};

// 특정 시즌 요약만 배열로 반환 (season_summaries 뷰 활용)
export const getSeasonSummarie = async (seasonId: number) => {
  const { data, error } = await supabase
    .from('season_summaries')
    .select('*')
    .eq('season_id', seasonId);

  if (error) {
    throw new Error(`Failed to fetch season summary: ${error.message}`);
  }

  return data || [];
};
