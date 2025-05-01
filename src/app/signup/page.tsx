'use client';

import { SignupForm } from '@/components/auth/signup-form'; // Adjust path as needed
import * as React from 'react';

export default function SignupPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-6 md:p-12">
      <SignupForm />
    </main>
  );
}
