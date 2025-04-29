
'use client';

import * as React from 'react';
import { MeditationPlan } from '@/components/meditation-plan';
import { BoxBreathingPlan } from '@/components/box-breathing-plan'; // Import the new component
import { DistractionGames } from '@/components/distraction-games';
import { EmergencyContacts } from '@/components/emergency-contacts';
import { PostRelapseGuidance } from '@/components/post-relapse-guidance';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldCheck, Brain, Gamepad2, Phone, HeartHandshake, Wind } from 'lucide-react'; // Added Wind icon

export default function RelapsePreventionPage() {
  return (
    <main className="container mx-auto flex flex-col items-center p-6 md:p-12">
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <ShieldCheck className="h-8 w-8" /> Relapse Prevention Toolkit
        </h1>
        <p className="text-lg text-muted-foreground">
          Tools and resources to help you stay strong on your recovery journey.
        </p>
      </header>

      {/* Updated grid layout to accommodate Box Breathing Plan */}
      <div className="grid w-full max-w-6xl gap-8 md:grid-cols-1 lg:grid-cols-2">

         {/* Box Breathing Plan Section (New) */}
        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Wind className="h-5 w-5" /> 4-Week Box Breathing Plan
            </CardTitle>
            <CardDescription>
              Learn a simple technique to calm your nervous system and manage stress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BoxBreathingPlan />
          </CardContent>
        </Card>


        {/* Meditation Plan Section */}
        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Brain className="h-5 w-5" /> 6-Month Meditation Plan
            </CardTitle>
            <CardDescription>
              Cultivate mindfulness and manage stress with guided practices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeditationPlan />
          </CardContent>
        </Card>

        {/* Distraction Games Section */}
        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary">
              <Gamepad2 className="h-5 w-5" /> Distraction Tools & Games
            </CardTitle>
            <CardDescription>
              Engage your mind during cravings or difficult moments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DistractionGames />
          </CardContent>
        </Card>

        {/* Emergency Contacts Section */}
        <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Phone className="h-5 w-5" /> Emergency Contacts
            </CardTitle>
            <CardDescription>
              Keep important support numbers readily available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmergencyContacts />
          </CardContent>
        </Card>

        {/* Post-Relapse Guidance Section (Spanning full width on large screens) */}
        <Card className="shadow-lg bg-primary/10 border-primary lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <HeartHandshake className="h-5 w-5" /> Post-Relapse Guidance
            </CardTitle>
            <CardDescription>
              Support and steps for getting back on track with self-compassion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostRelapseGuidance />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
