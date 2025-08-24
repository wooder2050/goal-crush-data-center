'use client';

import { SignUp } from '@clerk/nextjs';

import { Container } from '@/components/ui/container';

export default function SignUpPage() {
  return (
    <Container className="flex justify-center items-center min-h-[60vh]">
      <SignUp
        routing="path"
        path="/sign-up"
        redirectUrl="/admin/matches"
        signInUrl="/sign-in"
      />
    </Container>
  );
}
