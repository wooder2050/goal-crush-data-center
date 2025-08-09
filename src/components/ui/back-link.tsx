'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from './button';

interface BackLinkProps {
  href: string;
  label: string;
  className?: string;
}

export default function BackLink({ href, label, className }: BackLinkProps) {
  return (
    <Link href={href} className={className}>
      <Button variant="outline">
        <ArrowLeft className="h-4 w-4 mr-2" /> {label}
      </Button>
    </Link>
  );
}
