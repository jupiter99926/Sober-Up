
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Puzzle, Headphones, Wind } from 'lucide-react'; // Icons for different distractions

export function DistractionGames() {
  const games = [
    {
      id: 'breathing',
      name: 'Box Breathing Exercise',
      description: 'Calm your nervous system. Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat.',
      icon: <Wind className="h-5 w-5 text-blue-500" />,
      action: () => alert('Practice Box Breathing: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s). Repeat 5-10 times.'),
    },
    {
      id: 'web-game',
      name: 'Simple Web Puzzle',
      description: 'Engage your mind with a quick puzzle game.',
      icon: <Puzzle className="h-5 w-5 text-green-500" />,
      action: () => window.open('https://www.google.com/search?q=simple+online+puzzle+games', '_blank'), // Example link
    },
    {
      id: 'music',
      name: 'Listen to Calming Music',
      description: 'Put on some soothing music or nature sounds.',
      icon: <Headphones className="h-5 w-5 text-purple-500" />,
      action: () => window.open('https://www.youtube.com/results?search_query=calming+music', '_blank'), // Example link
    },
    // Add more game/tool ideas here
  ];

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <Card key={game.id} className="bg-muted/50">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0">{game.icon}</div>
              <div>
                <p className="font-medium text-sm text-foreground">{game.name}</p>
                <p className="text-xs text-muted-foreground">{game.description}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={game.action}>
              Try Now
            </Button>
          </CardContent>
        </Card>
      ))}
       <p className="text-xs text-muted-foreground text-center pt-2">
            More games and tools coming soon!
       </p>
    </div>
  );
}
