import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '골 때리는 그녀들 데이터 센터';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 600,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)',
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
            fontSize: '64px',
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
            fontSize: '42px',
            textAlign: 'center',
            marginBottom: '30px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          데이터 센터
        </div>
        <div
          style={{
            fontSize: '22px',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: '1.4',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          여자축구 데이터의 모든 것
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            fontSize: '16px',
            opacity: 0.8,
          }}
        >
          @GoalCrushData
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
