import type {
  CoachDetail,
  CoachFull,
  CoachOverview,
  CoachSeasonStats,
  CoachTrophies,
  CoachWithHistory,
  TeamCurrentHeadCoach,
} from '@/lib/types/database';

export async function fetchCoaches(): Promise<{
  coaches: CoachWithHistory[];
  total: number;
}> {
  const response = await fetch('/api/coaches');
  if (!response.ok) {
    throw new Error('Failed to fetch coaches');
  }
  return response.json();
}

export async function fetchCoachDetail(
  coachId: number
): Promise<CoachDetail | null> {
  const response = await fetch(`/api/coaches/${coachId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch coach detail');
  }
  return response.json();
}

export async function fetchCoachStats(
  coachId: number
): Promise<{ season_stats: CoachSeasonStats[] }> {
  const response = await fetch(`/api/coaches/${coachId}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch coach stats');
  }
  return response.json();
}

export async function fetchCoachCurrentTeam(
  coachId: number
): Promise<TeamCurrentHeadCoach | null> {
  const res = await fetch(`/api/coaches/${coachId}/current-team`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCoachTrophies(
  coachId: number
): Promise<CoachTrophies> {
  const res = await fetch(`/api/coaches/${coachId}/trophies`);
  if (!res.ok) {
    throw new Error('Failed to fetch trophies');
  }
  return res.json();
}

export async function fetchCoachOverview(
  coachId: number
): Promise<CoachOverview> {
  const res = await fetch(`/api/coaches/${coachId}/overview`);
  if (!res.ok) {
    throw new Error('Failed to fetch coach overview');
  }
  return res.json();
}

export async function fetchCoachFull(coachId: number): Promise<CoachFull> {
  const res = await fetch(`/api/coaches/${coachId}/full`);
  if (!res.ok) {
    throw new Error('Failed to fetch full coach data');
  }
  return res.json();
}
