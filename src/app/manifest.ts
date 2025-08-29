import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '골 때리는 그녀들 데이터 센터',
    short_name: '골때녀 데이터',
    description:
      '골 때리는 그녀들 경기/선수/팀 데이터를 구조화하여 빠르게 탐색할 수 있는 데이터 아카이브',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
    categories: ['sports', 'entertainment', 'news'],
    lang: 'ko',
    dir: 'ltr',
    orientation: 'portrait',
    scope: '/',
  };
}
