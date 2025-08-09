'use client';

import Link from 'next/link';

interface TeamMatchesShortcutProps {
  href: string;
  label?: string;
}

export default function TeamMatchesShortcut({
  href,
  label,
}: TeamMatchesShortcutProps) {
  return (
    <div className="text-sm text-blue-600">
      <Link href={href}>{label ?? '해당 시즌 경기 보기'}</Link>
    </div>
  );
}
