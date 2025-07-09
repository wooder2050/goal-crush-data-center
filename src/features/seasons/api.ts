import { supabase } from '@/lib/supabase/client';
import { Season, SeasonInput, SeasonUpdate } from '@/lib/types/database';

// 확장된 시즌 타입 정의
export interface SeasonWithStats extends Season {
  status?: 'upcoming' | 'ongoing' | 'completed';
  match_count?: number;
}

// 모든 시즌 목록 가져오기
export const getAllSeasons = async (): Promise<SeasonWithStats[]> => {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .order('year', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch seasons: ${error.message}`);
  }

  // 각 시즌의 경기 수와 상태 계산
  const seasonsWithStats = await Promise.all(
    (data || []).map(async (season) => {
      // 경기 수 계산
      const { count: matchCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('season_id', season.season_id);

      // 상태 계산
      let status: 'upcoming' | 'ongoing' | 'completed' = 'upcoming';
      const now = new Date();
      const startDate = season.start_date ? new Date(season.start_date) : null;
      const endDate = season.end_date ? new Date(season.end_date) : null;

      if (startDate && endDate) {
        if (now < startDate) {
          status = 'upcoming';
        } else if (now >= startDate && now <= endDate) {
          status = 'ongoing';
        } else {
          status = 'completed';
        }
      } else if (matchCount && matchCount > 0) {
        status = 'completed';
      }

      return {
        ...season,
        match_count: matchCount || 0,
        status,
      };
    })
  );

  return seasonsWithStats;
};

// 시즌별 라우팅 경로 매핑
export const getSeasonRoute = (seasonName: string): string => {
  const routeMap: Record<string, string> = {
    '골때리는 그녀들 파일럿': '/seasons/pilot-season',
    '골때리는 그녀들 시즌 1': '/seasons/season-1',
    '골때리는 그녀들 시즌 2': '/seasons/season-2',
    '골때리는 그녀들 시즌 3': '/seasons/season-3',
    '골때리는 그녀들 시즌 4': '/seasons/season-4',
    '골때리는 그녀들 제1회 SBS컵': '/seasons/sbs-cup-1',
    '골때리는 그녀들 시즌 5': '/seasons/season-5',
    '골때리는 그녀들 제2회 SBS컵': '/seasons/sbs-cup-2',
    '골때리는 그녀들 시즌 6': '/seasons/season-6',
    '골때리는 그녀들 시즌 7': '/seasons/season-7',
  };

  // 매핑되지 않은 시즌은 기본 경로 생성
  return routeMap[seasonName] || `/seasons/unknown`;
};

// 시즌명으로 시즌 정보 가져오기
export const getSeasonByName = async (
  seasonName: string
): Promise<Season | null> => {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('season_name', seasonName)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Season not found
    }
    throw new Error(`Failed to fetch season: ${error.message}`);
  }

  return data;
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
