import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
      <h1 className="text-2xl font-semibold text-gray-900">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-gray-500">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link href="/" className="mt-2 text-blue-600 hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
