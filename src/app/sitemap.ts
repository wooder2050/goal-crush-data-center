import { MetadataRoute } from 'next';

import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://goal-crush-data-center.vercel.app';

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/seasons`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/coaches`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/supports`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  try {
    // 데이터베이스에서 실제 데이터 가져오기
    const [seasons, teams, players, coaches, matches, posts] =
      await Promise.all([
        prisma.season.findMany({
          select: { season_id: true, updated_at: true },
          orderBy: { updated_at: 'desc' },
          take: 10, // 최근 10개 시즌만
        }),
        prisma.team.findMany({
          select: { team_id: true, updated_at: true },
          orderBy: { updated_at: 'desc' },
          take: 50, // 최근 50개 팀만
        }),
        prisma.player.findMany({
          select: { player_id: true, updated_at: true },
          orderBy: { updated_at: 'desc' },
          take: 100, // 최근 100명 선수만
        }),
        prisma.coach.findMany({
          select: { coach_id: true, created_at: true },
          orderBy: { created_at: 'desc' },
          take: 30, // 최근 30명 감독만
        }),
        prisma.match.findMany({
          select: { match_id: true, updated_at: true },
          orderBy: { updated_at: 'desc' },
          take: 100, // 최근 100개 경기만
        }),
        prisma.communityPost.findMany({
          select: { post_id: true, updated_at: true },
          where: { is_deleted: false },
          orderBy: { updated_at: 'desc' },
          take: 50, // 최근 50개 포스트만
        }),
      ]);

    // 시즌 페이지들
    const seasonPages: MetadataRoute.Sitemap = seasons.map((season) => ({
      url: `${baseUrl}/seasons/${season.season_id}`,
      lastModified: season.updated_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 팀 페이지들
    const teamPages: MetadataRoute.Sitemap = teams.map((team) => ({
      url: `${baseUrl}/teams/${team.team_id}`,
      lastModified: team.updated_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 선수 페이지들
    const playerPages: MetadataRoute.Sitemap = players.map((player) => ({
      url: `${baseUrl}/players/${player.player_id}`,
      lastModified: player.updated_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 감독 페이지들
    const coachPages: MetadataRoute.Sitemap = coaches.map((coach) => ({
      url: `${baseUrl}/coaches/${coach.coach_id}`,
      lastModified: coach.created_at || new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    // 경기 페이지들
    const matchPages: MetadataRoute.Sitemap = matches.map((match) => ({
      url: `${baseUrl}/matches/${match.match_id}`,
      lastModified: match.updated_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // 커뮤니티 포스트 페이지들
    const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/community/posts/${post.post_id}`,
      lastModified: post.updated_at || new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [
      ...staticPages,
      ...seasonPages,
      ...teamPages,
      ...playerPages,
      ...coachPages,
      ...matchPages,
      ...postPages,
    ];
  } catch (error) {
    console.error('Sitemap 생성 중 오류 발생:', error);
    // 오류 발생 시 정적 페이지만 반환
    return staticPages;
  }
}
