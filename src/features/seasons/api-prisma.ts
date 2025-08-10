import { Season } from '@/lib/types';

// Extended season type definition
export interface SeasonWithStats extends Season {
  status?: 'upcoming' | 'ongoing' | 'completed';
  match_count?: number;
}

// Prisma-based Seasons API client functions
// Provides the same interface as Supabase but uses Next.js API Routes

// ============== Basic Season CRUD Operations ==============

// Get all seasons
export const getAllSeasonsPrisma = async (): Promise<SeasonWithStats[]> => {
  const response = await fetch('/api/seasons');
  if (!response.ok) {
    throw new Error(`Failed to fetch seasons: ${response.statusText}`);
  }
  return response.json();
};

// Get season by ID
export const getSeasonByIdPrisma = async (
  seasonId: number
): Promise<Season | null> => {
  const response = await fetch(`/api/seasons/${seasonId}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null; // Season not found
    }
    throw new Error(`Failed to fetch season: ${response.statusText}`);
  }
  return response.json();
};

// Get seasons by year
export const getSeasonsByYearPrisma = async (
  year: number
): Promise<Season[]> => {
  const response = await fetch(`/api/seasons?year=${year}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch seasons by year: ${response.statusText}`);
  }
  return response.json();
};

// Get latest season
export const getLatestSeasonPrisma = async (): Promise<Season | null> => {
  const response = await fetch('/api/seasons/latest');
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch latest season: ${response.statusText}`);
  }
  return response.json();
};

// Search seasons by name
export const searchSeasonsByNamePrisma = async (
  name: string
): Promise<Season[]> => {
  const response = await fetch(`/api/seasons?name=${encodeURIComponent(name)}`);
  if (!response.ok) {
    throw new Error(`Failed to search seasons: ${response.statusText}`);
  }
  return response.json();
};

// Season route mapping
export const getSeasonRoute = (seasonName: string): string => {
  const routeMap: Record<string, string> = {
    '골때리는 그녀들 파일럿': '/seasons/pilot-season',
    '골때리는 그녀들 시즌 1': '/seasons/season-1',
    '골때리는 그녀들 시즌 2 조별리그': '/seasons/season-2',
    '골때리는 그녀들 시즌 2 슈퍼리그': '/seasons/season-2-super',
    '골때리는 그녀들 시즌 2 플레이오프': '/seasons/season-2-playoff',
    '골때리는 그녀들 시즌 2 챌린지리그': '/seasons/season-2-challenge',
    '골때리는 그녀들 시즌 3 슈퍼리그': '/seasons/season-3-super',
    '골때리는 그녀들 시즌 3 챌린지리그': '/seasons/season-3-challenge',
    '골때리는 그녀들 시즌 3 플레이오프': '/seasons/season-3-playoff',
    '골때리는 그녀들 시즌 4 슈퍼리그': '/seasons/season-4-super',
    '골때리는 그녀들 시즌 4 챌린지리그': '/seasons/season-4-challenge',
    '골때리는 그녀들 시즌 4 플레이오프': '/seasons/season-4-playoff',
    '골때리는 그녀들 제1회 SBS컵': '/seasons/sbs-cup-1',
    '골때리는 그녀들 시즌 5 슈퍼리그': '/seasons/season-5-super',
    '골때리는 그녀들 시즌 5 챌린지리그': '/seasons/season-5-challenge',
    '골때리는 그녀들 시즌 5 플레이오프': '/seasons/season-5-playoff',
    '골때리는 그녀들 제2회 SBS컵': '/seasons/sbs-cup-2',
    '골때리는 그녀들 시즌 6 슈퍼리그': '/seasons/season-6-super',
    '골때리는 그녀들 시즌 6 챌린지리그': '/seasons/season-6-challenge',
    '골때리는 그녀들 시즌 6 플레이오프': '/seasons/season-6-playoff',
    '골때리는 그녀들 시즌 7 G리그': '/seasons/season-7-g-league',
  };
  // For unmapped seasons, return default route
  return routeMap[seasonName] || `/seasons/unknown`;
};

// Get season by name
export const getSeasonByNamePrisma = async (
  seasonName: string
): Promise<Season | null> => {
  const response = await fetch(
    `/api/seasons?name=${encodeURIComponent(seasonName)}`
  );
  if (!response.ok) {
    if (response.status === 404) {
      return null; // Season not found
    }
    throw new Error(`Failed to fetch season: ${response.statusText}`);
  }
  const seasons = await response.json();
  return seasons.length > 0 ? seasons[0] : null;
};
