
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from '@/components/app-layout'; // Import AppLayout
import { AuthProvider } from '@/context/auth-context'; // Import AuthProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Road to Recovery',
  description: 'Your personalized path to overcoming addiction.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <AuthProvider> {/* Wrap everything with AuthProvider */}
            {/* Wrap children with AppLayout */}
            {/* Conditionally render AppLayout based on route if needed (e.g., hide for signup/login) */}
            <AppLayout>
                {children}
            </AppLayout>
            <Toaster /> {/* Toaster remains outside AppLayout or inside depending on preference/structure */}
         </AuthProvider>
      </body>
    </html>
  );
}
