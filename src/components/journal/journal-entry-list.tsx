
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Smile, Meh, Frown, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { JournalEntry, Mood } from '@/types/journal';
import { ScrollArea } from '@/components/ui/scroll-area';

type JournalEntryListProps = {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void; // Pass ID for deletion confirmation
};

const moodIcons: Record<Mood, React.ReactNode> = {
  happy: <Smile className="h-5 w-5 text-green-500" />,
  neutral: <Meh className="h-5 w-5 text-yellow-500" />,
  sad: <Frown className="h-5 w-5 text-blue-500" />,
};

export function JournalEntryList({ entries, onEdit, onDelete }: JournalEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-10 bg-muted/30 rounded-lg border border-dashed">
        <p className="text-lg font-medium mb-2">Your journal is empty.</p>
        <p className="text-sm">Click "Add New Entry" to start writing about your journey.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full"> {/* Make the list scrollable */}
      <div className="space-y-4 pr-4 pb-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
            <CardHeader className="flex flex-row justify-between items-start pb-3">
              <div>
                <CardTitle className="text-lg font-semibold text-card-foreground">
                  {format(entry.date, 'PPPP')} {/* e.g., Monday, August 26th, 2024 */}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  {moodIcons[entry.mood]}
                  <span>{entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</span>
                </CardDescription>
              </div>
              <div className="flex gap-1">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(entry)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Entry</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(entry.id)}>
                  <Trash2 className="h-4 w-4" />
                   <span className="sr-only">Delete Entry</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              {/* Basic rendering, improve with rich text support later */}
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </CardContent>
            {entry.tags && entry.tags.length > 0 && (
                <CardFooter className="flex flex-wrap gap-1 pt-0 pb-4">
                    {/* <Tag className="h-3 w-3 text-muted-foreground mr-1"/> */}
                    {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                    </Badge>
                    ))}
                </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
