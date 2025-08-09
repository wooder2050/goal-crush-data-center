import type { Team } from '@/lib/types';

export type SeasonBasic = {
  season_id: number;
  season_name: string;
  year: number;
};

export type TeamWithExtras = Team & {
  _count?: { team_seasons?: number };
  team_seasons?: { season?: SeasonBasic }[];
  representative_players?: {
    player_id: number;
    name: string;
    jersey_number: number | null;
    appearances: number;
  }[];
};
