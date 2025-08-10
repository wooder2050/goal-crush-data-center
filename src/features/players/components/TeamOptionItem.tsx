'use client';

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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt="팀 로고"
          className="h-4 w-4 rounded-full object-cover"
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
