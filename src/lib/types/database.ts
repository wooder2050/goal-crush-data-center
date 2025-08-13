// Goal Crush Data Center database type definitions (Supabase-aligned)

export interface Player {
  player_id: number;
  name: string;
  birth_date?: string | null;
  nationality?: string | null;
  height_cm?: number | null;
  profile_image_url?: string | null;
  jersey_number?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Team {
  team_id: number;
  team_name: string;
  logo?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  founded_year?: number | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Season {
  season_id: number;
  season_name: string;
  year: number;
  start_date: string | null;
  end_date: string | null;
  // New: season category (G_LEAGUE, SUPER_LEAGUE, CHALLENGE_LEAGUE, PLAYOFF, OTHER)
  category?:
    | 'G_LEAGUE'
    | 'SUPER_LEAGUE'
    | 'CHALLENGE_LEAGUE'
    | 'PLAYOFF'
    | 'SBS_CUP'
    | 'OTHER'
    | 'CHAMPION_MATCH'
    | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface TeamSeason {
  team_season_id: number;
  team_id: number | null;
  season_id: number | null;
  is_active?: boolean | null;
  created_at?: string | null;
}

export interface PlayerTeamHistory {
  history_id: number;
  player_id: number | null;
  team_id: number | null;
  season_id: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
}

export interface Match {
  match_id: number;
  match_date: string; // ISO
  season_id: number | null;
  home_team_id: number | null;
  away_team_id: number | null;
  home_score: number | null;
  away_score: number | null;
  penalty_home_score: number | null;
  penalty_away_score: number | null;
  location: string | null;
  status: string | null;
  description: string | null;
  group_stage?: string | null;
  tournament_stage?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PlayerMatchStats {
  stat_id: number;
  match_id: number | null;
  player_id: number | null;
  team_id: number | null;
  goals: number | null;
  assists: number | null;
  yellow_cards: number | null;
  red_cards: number | null;
  minutes_played: number | null;
  saves: number | null;
  position?: string | null;
  card_type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PlayerSeasonStats {
  stat_id: number;
  player_id: number | null;
  season_id: number | null;
  team_id: number | null;
  matches_played: number | null;
  goals: number | null;
  assists: number | null;
  yellow_cards: number | null;
  red_cards: number | null;
  minutes_played: number | null;
  saves: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface TeamSeasonStats {
  stat_id: number;
  team_id: number | null;
  season_id: number | null;
  matches_played: number | null;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  goals_for: number | null;
  goals_against: number | null;
  points: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Standing {
  standing_id: number;
  season_id: number | null;
  team_id: number | null;
  position: number; // rank
  matches_played: number | null;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  goals_for: number | null;
  goals_against: number | null;
  goal_difference: number | null;
  points: number | null;
  form?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Goal {
  goal_id: number;
  match_id: number;
  player_id: number;
  goal_time?: number | null;
  goal_type: string | null;
  description?: string | null;
  assist_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Assist {
  assist_id: number;
  match_id: number;
  player_id: number;
  goal_id: number;
  assist_time?: number | null;
  assist_type?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Substitution {
  substitution_id: number;
  match_id: number;
  player_in_id: number;
  player_out_id: number | null;
  team_id: number;
  substitution_time?: number | null;
  substitution_reason?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SubstitutionInput {
  match_id: number;
  player_in_id: number;
  player_out_id?: number | null;
  team_id: number;
  substitution_time?: number | null;
  substitution_reason?: string | null;
}

export interface SubstitutionUpdate {
  substitution_time?: number | null;
  substitution_reason?: string | null;
}

export interface SubstitutionWithDetails extends Substitution {
  player_in: Player;
  player_out: Player | null;
  team: Team;
  match: Match;
}

export interface PenaltyShootoutDetail {
  penalty_detail_id: number;
  match_id: number;
  team_id: number;
  goalkeeper_id: number | null;
  kicker_order: number;
  kicker_id: number;
  is_successful: boolean;
  kick_description: string | null;
  created_at: string | null;
}

export interface PenaltyShootoutDetailWithPlayers
  extends PenaltyShootoutDetail {
  goalkeeper: Player | null;
  kicker: Player;
  team: Team;
}

// New tables reflected from schema.json
export interface GroupLeagueStanding {
  group_standing_id: number;
  season_id: number;
  group_stage: string;
  group_name: string | null;
  team_id: number;
  position: number;
  matches_played: number | null;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  goals_for: number | null;
  goals_against: number | null;
  goal_difference: number | null;
  points: number | null;
  form: string | null;
  created_at: string | null;
  updated_at: string | null;
  tournament_stage: string | null;
}

export interface PlayerPosition {
  player_position_id: number;
  player_id: number;
  position: string;
  season_id: number | null;
  start_date: string; // date
  end_date: string | null; // date
  created_at: string | null;
  updated_at: string | null;
}

export interface TeamSeasonName {
  id: number;
  team_id: number;
  season_id: number;
  team_name: string;
  is_current: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface PlayerCurrentPositionRow {
  player_id: number | null;
  position: string | null;
}

// Input types (for auto-generated IDs)
export type PlayerInput = Omit<
  Player,
  'player_id' | 'created_at' | 'updated_at'
>;
export type TeamInput = Omit<Team, 'team_id' | 'created_at' | 'updated_at'>;
export type SeasonInput = Omit<
  Season,
  'season_id' | 'created_at' | 'updated_at'
>;
export type TeamSeasonInput = Omit<TeamSeason, 'team_season_id' | 'created_at'>;
export type PlayerTeamHistoryInput = Omit<
  PlayerTeamHistory,
  'history_id' | 'created_at'
>;
export type MatchInput = Omit<Match, 'match_id'>;
export type PlayerMatchStatsInput = Omit<
  PlayerMatchStats,
  'stat_id' | 'created_at' | 'updated_at'
>;
export type PlayerSeasonStatsInput = Omit<
  PlayerSeasonStats,
  'stat_id' | 'created_at' | 'updated_at'
>;
export type TeamSeasonStatsInput = Omit<
  TeamSeasonStats,
  'stat_id' | 'created_at' | 'updated_at'
>;
export type StandingInput = Omit<
  Standing,
  'standing_id' | 'created_at' | 'updated_at'
>;
export type GoalInput = Omit<Goal, 'goal_id' | 'created_at' | 'updated_at'>;
export type AssistInput = Omit<
  Assist,
  'assist_id' | 'created_at' | 'updated_at'
>;

// Update types (all fields optional)
export type PlayerUpdate = Partial<
  Omit<Player, 'player_id' | 'created_at' | 'updated_at'>
>;
export type TeamUpdate = Partial<Omit<Team, 'team_id'>>;
export type SeasonUpdate = Partial<Omit<Season, 'season_id'>>;
export type TeamSeasonUpdate = Partial<Omit<TeamSeason, 'team_season_id'>>;
export type PlayerTeamHistoryUpdate = Partial<
  Omit<PlayerTeamHistory, 'history_id'>
>;
export type MatchUpdate = Partial<Omit<Match, 'match_id'>>;
export type PlayerMatchStatsUpdate = Partial<Omit<PlayerMatchStats, 'stat_id'>>;
export type PlayerSeasonStatsUpdate = Partial<
  Omit<PlayerSeasonStats, 'stat_id'>
>;
export type TeamSeasonStatsUpdate = Partial<Omit<TeamSeasonStats, 'stat_id'>>;
export type StandingUpdate = Partial<Omit<Standing, 'standing_id'>>;
export type GoalUpdate = Partial<
  Omit<Goal, 'goal_id' | 'created_at' | 'updated_at'>
>;
export type AssistUpdate = Partial<
  Omit<Assist, 'assist_id' | 'created_at' | 'updated_at'>
>;

// Joined data types
export interface PlayerWithTeam extends Player {
  team: Team;
}

export interface MatchWithTeams extends Match {
  home_team: Team;
  away_team: Team;
  season: Season;
}

export interface PlayerMatchStatsWithDetails extends PlayerMatchStats {
  player: Player;
  team: Team;
  match: Match;
}

export interface PlayerSeasonStatsWithDetails extends PlayerSeasonStats {
  player: Player;
  team: Team;
  season: Season;
}

export interface TeamSeasonStatsWithDetails extends TeamSeasonStats {
  team: Team;
  season: Season;
}

export interface StandingWithDetails extends Standing {
  team: Team;
  season: Season;
}

export interface GoalWithDetails extends Goal {
  player: Player;
  match: MatchWithTeams;
  assists?: AssistWithDetails[];
}

export interface AssistWithDetails extends Assist {
  player: Player;
  goal: GoalWithDetails;
  match: MatchWithTeams;
}

// Table name types
export type TableName =
  | 'players'
  | 'teams'
  | 'seasons'
  | 'team_seasons'
  | 'team_season_names'
  | 'player_team_history'
  | 'matches'
  | 'player_match_stats'
  | 'player_season_stats'
  | 'team_season_stats'
  | 'standings'
  | 'group_league_standings'
  | 'goals'
  | 'assists'
  | 'substitutions'
  | 'penalty_shootout_details'
  | 'player_positions'
  | 'player_current_position';

// Database schema types
export interface Database {
  public: {
    Tables: {
      players: { Row: Player; Insert: PlayerInput; Update: PlayerUpdate };
      teams: { Row: Team; Insert: TeamInput; Update: TeamUpdate };
      seasons: { Row: Season; Insert: SeasonInput; Update: SeasonUpdate };
      team_seasons: {
        Row: TeamSeason;
        Insert: TeamSeasonInput;
        Update: TeamSeasonUpdate;
      };
      team_season_names: { Row: TeamSeasonName };
      player_team_history: {
        Row: PlayerTeamHistory;
        Insert: PlayerTeamHistoryInput;
        Update: PlayerTeamHistoryUpdate;
      };
      matches: { Row: Match; Insert: MatchInput; Update: MatchUpdate };
      player_match_stats: {
        Row: PlayerMatchStats;
        Insert: PlayerMatchStatsInput;
        Update: PlayerMatchStatsUpdate;
      };
      player_season_stats: {
        Row: PlayerSeasonStats;
        Insert: PlayerSeasonStatsInput;
        Update: PlayerSeasonStatsUpdate;
      };
      team_season_stats: {
        Row: TeamSeasonStats;
        Insert: TeamSeasonStatsInput;
        Update: TeamSeasonStatsUpdate;
      };
      standings: {
        Row: Standing;
        Insert: StandingInput;
        Update: StandingUpdate;
      };
      group_league_standings: { Row: GroupLeagueStanding };
      goals: { Row: Goal; Insert: GoalInput; Update: GoalUpdate };
      assists: { Row: Assist; Insert: AssistInput; Update: AssistUpdate };
      substitutions: {
        Row: Substitution;
        Insert: SubstitutionInput;
        Update: SubstitutionUpdate;
      };
      penalty_shootout_details: { Row: PenaltyShootoutDetail };
      player_positions: { Row: PlayerPosition };
      player_current_position: { Row: PlayerCurrentPositionRow };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never } & {
      season_category:
        | 'G_LEAGUE'
        | 'SUPER_LEAGUE'
        | 'CHALLENGE_LEAGUE'
        | 'PLAYOFF'
        | 'SBS_CUP'
        | 'OTHER'
        | 'CHAMPION_MATCH';
    };
    CompositeTypes: { [_ in never]: never };
  };
}
