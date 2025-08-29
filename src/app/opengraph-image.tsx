import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '골 때리는 그녀들 데이터 센터';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          골 때리는 그녀들
        </div>
        <div
          style={{
            fontSize: '48px',
            textAlign: 'center',
            marginBottom: '40px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          데이터 센터
        </div>
        <div
          style={{
            fontSize: '24px',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.4',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          경기/선수/팀 데이터를 구조화하여 빠르게 탐색할 수 있는 데이터 아카이브
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '18px',
            opacity: 0.8,
          }}
        >
          www.gtndatacenter.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
