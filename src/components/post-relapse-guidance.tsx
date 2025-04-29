
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, MessageSquareHeart, RefreshCw, Users } from 'lucide-react'; // Icons for guidance points

export function PostRelapseGuidance() {
  return (
    <div className="space-y-4 text-sm text-primary-foreground/90">
      <p className="font-semibold text-base text-primary-foreground">If You Slip or Relapse: Be Kind to Yourself</p>
      <p>
        Relapse can be part of the recovery process for many. It doesn't mean failure, and it doesn't erase the progress you've made. Here’s how to navigate it:
      </p>

      <ul className="space-y-3 pl-4 list-outside">
        <li className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 mt-0.5 text-primary-foreground/80 shrink-0" />
          <div>
            <span className="font-medium text-primary-foreground">Acknowledge Without Judgment:</span> Recognize what happened without harsh self-criticism. Treat yourself with the same compassion you'd offer a friend.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <Users className="h-5 w-5 mt-0.5 text-primary-foreground/80 shrink-0" />
          <div>
            <span className="font-medium text-primary-foreground">Reach Out Immediately:</span> Connect with someone from your support network – a sponsor, therapist, trusted friend, or family member. Don't isolate yourself. Use your <a href="/relapse-prevention" className="underline font-medium hover:text-primary-foreground">Emergency Contacts</a>.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <RefreshCw className="h-5 w-5 mt-0.5 text-primary-foreground/80 shrink-0" />
          <div>
            <span className="font-medium text-primary-foreground">Reflect and Learn:</span> Once you feel stable, gently explore what led to the slip. What were the triggers? What coping strategies could have helped? This isn't about blame, but understanding.
          </div>
        </li>
         <li className="flex items-start gap-3">
          <MessageSquareHeart className="h-5 w-5 mt-0.5 text-primary-foreground/80 shrink-0" />
          <div>
            <span className="font-medium text-primary-foreground">Get Back to Basics:</span> Recommit to your recovery plan. Attend meetings, engage in therapy, use coping tools (like the AI Chat or Distraction Games), and prioritize self-care.
          </div>
        </li>
      </ul>

      <p className="pt-2">
        Remember, your journey is unique. This is a setback, not the end of the road. You have the strength to continue.
      </p>

      {/* Optional: Link to AI Chat for immediate support */}
       <Button variant="secondary" size="sm" className="w-full mt-4" onClick={() => window.location.href='/chat-support'}>
          <MessageSquareHeart className="mr-2 h-4 w-4" /> Talk to AI Support Now
       </Button>
    </div>
  );
}
