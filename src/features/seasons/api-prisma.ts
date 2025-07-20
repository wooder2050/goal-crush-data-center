import { Season } from '@/lib/types';

// 확장된 시즌 타입 정의
export interface SeasonWithStats extends Season {
  status?: 'upcoming' | 'ongoing' | 'completed';
  match_count?: number;
}

// Prisma 기반 Seasons API 클라이언트 함수들
// 기존 Supabase API와 동일한 인터페이스를 제공하지만 Next.js API Routes를 사용

// ============== Basic Season CRUD Operations ==============

// 모든 시즌 목록 가져오기
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
