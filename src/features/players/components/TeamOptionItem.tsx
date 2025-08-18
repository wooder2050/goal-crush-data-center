'use client';
import Image from 'next/image';

export default function TeamOptionItem({
  name,
  logo,
}: {
  name: string;
  logo: string | null | undefined;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {logo ? (
        <span className="relative h-5 w-5 overflow-hidden rounded-full flex-shrink-0">
          <Image
            src={logo}
            alt="팀 로고"
            fill
            sizes="20px"
            className="object-cover"
          />
        </span>
      ) : (
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-700">
          {name.charAt(0)}
        </span>
      )}
      <span className="truncate">{name}</span>
    </div>
  );
}
