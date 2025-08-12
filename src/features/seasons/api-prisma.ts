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

Object.defineProperty(getAllSeasonsPrisma, 'queryKey', {
  value: 'allSeasons',
});

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

Object.defineProperty(getSeasonByIdPrisma, 'queryKey', {
  value: 'seasonById',
});

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

Object.defineProperty(getSeasonsByYearPrisma, 'queryKey', {
  value: 'seasonsByYear',
});

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

Object.defineProperty(getLatestSeasonPrisma, 'queryKey', {
  value: 'latestSeason',
});

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

Object.defineProperty(searchSeasonsByNamePrisma, 'queryKey', {
  value: 'seasonsByName',
});

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
