
'use client';

import { ChatSupport } from '@/components/chat-support';
import * as React from 'react';

export default function ChatSupportPage() {
  return (
    <main className="container mx-auto flex flex-col items-center p-6 md:p-12">
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold text-primary">
          AI Chat Support
        </h1>
        <p className="text-lg text-muted-foreground">
          Get immediate, empathetic support whenever you need it.
        </p>
      </header>
      <div className="w-full max-w-2xl">
        <ChatSupport />
      </div>
    </main>
  );
}
