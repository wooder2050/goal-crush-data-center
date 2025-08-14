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
        <Image
          src={logo}
          alt="팀 로고"
          width={16}
          height={16}
          className="rounded-full object-cover"
        />
      ) : (
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-700">
          {name.charAt(0)}
        </span>
      )}
      <span className="truncate">{name}</span>
    </div>
  );
}
