'use client';

import { SignIn } from '@clerk/nextjs';

import { Container } from '@/components/ui/container';

export default function SignInPage() {
  return (
    <Container className="flex justify-center items-center min-h-[60vh]">
      <SignIn
        routing="path"
        path="/sign-in"
        redirectUrl="/admin/matches"
        signUpUrl="/sign-up"
      />
    </Container>
  );
}
