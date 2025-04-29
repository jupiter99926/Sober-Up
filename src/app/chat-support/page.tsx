
'use client';

import { ChatSupport } from '@/components/chat-support';
import * as React from 'react';

export default function ChatSupportPage() {
  return (
    // Changed flex direction to column and added items-center for centering
    <main className="container mx-auto flex flex-col items-center justify-center p-6 md:p-12 h-[calc(100vh-theme(spacing.14))]">
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold text-primary">
          AI Chat Support
        </h1>
        <p className="text-lg text-muted-foreground">
          Get immediate, empathetic support whenever you need it.
        </p>
      </header>
      {/* Adjusted width to ensure it doesn't stretch full width on large screens */}
      <div className="w-full max-w-3xl">
        <ChatSupport />
      </div>
    </main>
  );
}
