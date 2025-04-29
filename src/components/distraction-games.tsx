
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Puzzle, Headphones } from 'lucide-react'; // Keep Headphones icon

export function DistractionGames() {
  const games = [
    {
      id: 'web-game',
      name: 'Simple Web Puzzle',
      description: 'Engage your mind with a quick puzzle game.',
      icon: <Puzzle className="h-5 w-5 text-green-500" />,
      action: () => window.open('https://www.google.com/search?q=simple+online+puzzle+games', '_blank'), // Updated link to search results
    },
    {
      id: 'music',
      name: 'Listen to Calming Sounds on Spotify', // Updated name slightly
      description: 'Put on some soothing music, nature sounds (like rain or waves), or ambient tracks.', // Kept description general
      icon: <Headphones className="h-5 w-5 text-purple-500" />,
      action: () => window.open('https://open.spotify.com/search/calming%20music%20nature%20sounds%20ambient', '_blank'), // Updated link to Spotify search
    },
    // Add more game/tool ideas here
  ];

  // Handle the case where there are no games left after removal
   if (games.length === 0) {
    return (
        <p className="text-sm text-muted-foreground text-center py-4">
            More distraction tools coming soon!
        </p>
    );
  }


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

