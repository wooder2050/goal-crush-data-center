'use client';

import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

import { Container } from '@/components/ui/container';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/admin/matches';

  return (
    <Container className="flex justify-center items-center min-h-[60vh]">
      <SignUp
        routing="path"
        path="/sign-up"
        redirectUrl={redirectUrl}
        signInUrl="/sign-in"
      />
    </Container>
  );
}
