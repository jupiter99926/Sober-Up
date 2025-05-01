'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config'; // Adjust path as needed
import { useRouter } from 'next/navigation'; // Use next/navigation
import type { AuthError } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const signup = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Signed up user:', user);
      toast({
        title: 'Signup Successful',
        description: `Welcome, ${user.email}!`,
      });
      setIsLoading(false);
       // Redirect to home page or dashboard after successful signup
      router.push('/'); // Or '/dashboard' or any other route
      return true; // Indicate success
    } catch (err) {
      const authError = err as AuthError;
      console.error('Signup Error:', authError);
      let friendlyError = 'An unexpected error occurred during signup. Please try again.';
      // Provide more specific error messages based on Firebase error codes
      switch (authError.code) {
        case 'auth/email-already-in-use':
          friendlyError = 'This email address is already in use.';
          break;
        case 'auth/invalid-email':
          friendlyError = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          friendlyError = 'Password should be at least 6 characters long.';
          break;
        // Add more cases as needed
      }
      setError(friendlyError);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: friendlyError,
      });
      setIsLoading(false);
      return false; // Indicate failure
    }
  };

  return { signup, isLoading, error };
};
