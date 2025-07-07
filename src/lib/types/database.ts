// Goal Crush Data Center database type definitions

export interface Player {
  player_id: number;
  name: string;
  birth_date: Date | null;
  position: string | null;
  created_at: Date;
}

export interface Team {
  team_id: number;
  team_name: string;
}

export interface Season {
  season_id: number;
  season_name: string;
  year: number;
}

export interface TeamSeason {
  id: number;
  team_id: number;
  season_id: number;
}

export interface PlayerTeamHistory {
  id: number;
  player_id: number;
  team_id: number;
  start_date: Date;
  end_date: Date | null;
}

export interface Match {
  match_id: number;
  match_date: Date;
  season_id: number;
  home_team_id: number;
  away_team_id: number;
  home_score: number | null;
  away_score: number | null;
  location: string | null;
}

export interface PlayerMatchStats {
  id: number;
  match_id: number;
  player_id: number;
  team_id: number;
  goals: number;
  played: boolean;
}

export interface PlayerSeasonStats {
  id: number;
  player_id: number;
  season_id: number;
  team_id: number;
  total_matches: number;
  total_goals: number;
  total_assists: number | null;
  minutes_played: number | null;
}

export interface TeamSeasonStats {
  id: number;
  team_id: number;
  season_id: number;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_scored: number;
  goals_conceded: number;
  points: number;
}

export interface Standing {
  id: number;
  season_id: number;
  team_id: number;
  rank: number;
  points: number;
  goal_difference: number;
  last_updated: Date;
}

// Input types (for auto-generated IDs)
export type PlayerInput = Omit<Player, 'player_id' | 'created_at'>;
export type TeamInput = Omit<Team, 'team_id'>;
export type SeasonInput = Omit<Season, 'season_id'>;
export type TeamSeasonInput = Omit<TeamSeason, 'id'>;
export type PlayerTeamHistoryInput = Omit<PlayerTeamHistory, 'id'>;
export type MatchInput = Omit<Match, 'match_id'>;
export type PlayerMatchStatsInput = Omit<PlayerMatchStats, 'id'>;
export type PlayerSeasonStatsInput = Omit<PlayerSeasonStats, 'id'>;
export type TeamSeasonStatsInput = Omit<TeamSeasonStats, 'id'>;
export type StandingInput = Omit<Standing, 'id' | 'last_updated'>;

// Update types (all fields optional)
export type PlayerUpdate = Partial<Omit<Player, 'player_id' | 'created_at'>>;
export type TeamUpdate = Partial<Omit<Team, 'team_id'>>;
export type SeasonUpdate = Partial<Omit<Season, 'season_id'>>;
export type TeamSeasonUpdate = Partial<Omit<TeamSeason, 'id'>>;
export type PlayerTeamHistoryUpdate = Partial<Omit<PlayerTeamHistory, 'id'>>;
export type MatchUpdate = Partial<Omit<Match, 'match_id'>>;
export type PlayerMatchStatsUpdate = Partial<Omit<PlayerMatchStats, 'id'>>;
export type PlayerSeasonStatsUpdate = Partial<Omit<PlayerSeasonStats, 'id'>>;
export type TeamSeasonStatsUpdate = Partial<Omit<TeamSeasonStats, 'id'>>;
export type StandingUpdate = Partial<Omit<Standing, 'id' | 'last_updated'>>;

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

// Table name types
export type TableName =
  | 'players'
  | 'teams'
  | 'seasons'
  | 'team_seasons'
  | 'player_team_history'
  | 'matches'
  | 'player_match_stats'
  | 'player_season_stats'
  | 'team_season_stats'
  | 'standings';

// Database schema types
export interface Database {
  public: {
    Tables: {
      players: {
        Row: Player;
        Insert: PlayerInput;
        Update: PlayerUpdate;
      };
      teams: {
        Row: Team;
        Insert: TeamInput;
        Update: TeamUpdate;
      };
      seasons: {
        Row: Season;
        Insert: SeasonInput;
        Update: SeasonUpdate;
      };
      team_seasons: {
        Row: TeamSeason;
        Insert: TeamSeasonInput;
        Update: TeamSeasonUpdate;
      };
      player_team_history: {
        Row: PlayerTeamHistory;
        Insert: PlayerTeamHistoryInput;
        Update: PlayerTeamHistoryUpdate;
      };
      matches: {
        Row: Match;
        Insert: MatchInput;
        Update: MatchUpdate;
      };
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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
