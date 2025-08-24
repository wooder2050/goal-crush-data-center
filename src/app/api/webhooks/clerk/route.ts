import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Clerk 웹훅 시크릿 키 확인
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET 환경변수가 설정되지 않았습니다');
  }

  // 웹훅 헤더 가져오기
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // 필수 헤더 검증
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('웹훅 헤더가 누락되었습니다', {
      status: 400,
    });
  }

  // 요청 본문 파싱
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 웹훅 서명 검증
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('웹훅 서명 검증 실패:', err);
    return new Response('웹훅 서명 검증에 실패했습니다', {
      status: 400,
    });
  }

  // 이벤트 타입별 처리
  try {
    switch (evt.type) {
      case 'user.created': {
        // 신규 사용자 생성 시 DB에 기본 레코드 생성 (닉네임은 나중에 설정)
        console.log('신규 사용자 생성:', evt.data.id);

        // 이미 존재하는 사용자인지 확인
        const existingUser = await prisma.user.findUnique({
          where: { user_id: evt.data.id },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              user_id: evt.data.id,
              korean_nickname: `임시사용자${evt.data.id.slice(-6)}`, // 임시 닉네임
              display_name: null,
              profile_image_url: evt.data.image_url || null,
              bio: null,
              is_active: true,
            },
          });
          console.log('사용자 DB 레코드 생성 완료:', evt.data.id);
        }
        break;
      }

      case 'user.updated':
        // 사용자 정보 업데이트 시 프로필 이미지만 동기화
        console.log('사용자 정보 업데이트:', evt.data.id);

        await prisma.user.updateMany({
          where: { user_id: evt.data.id },
          data: {
            profile_image_url: evt.data.image_url || null,
            updated_at: new Date(),
          },
        });
        break;

      case 'user.deleted':
        // 사용자 삭제 시 DB에서도 삭제 (또는 비활성화)
        console.log('사용자 삭제:', evt.data.id);

        await prisma.user.updateMany({
          where: { user_id: evt.data.id as string },
          data: {
            is_active: false,
            updated_at: new Date(),
          },
        });
        break;

      default:
        console.log('처리되지 않은 웹훅 이벤트:', evt.type);
        break;
    }

    return new Response('웹훅 처리 완료', { status: 200 });
  } catch (error) {
    console.error('웹훅 처리 중 오류 발생:', error);
    return new Response('웹훅 처리 중 오류가 발생했습니다', {
      status: 500,
    });
  }
}
