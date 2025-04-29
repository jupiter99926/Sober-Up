
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Loader2, Smile, Meh, Frown, Tag, Bold, Italic, List, Image as ImageIcon, Mic, X } from 'lucide-react'; // Import X
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { JournalEntry, Mood } from '@/types/journal';

// Define moods
const moods: { value: Mood; label: string; icon: React.ReactNode }[] = [
  { value: 'happy', label: 'Happy', icon: <Smile className="h-5 w-5 text-green-500" /> },
  { value: 'neutral', label: 'Neutral', icon: <Meh className="h-5 w-5 text-yellow-500" /> },
  { value: 'sad', label: 'Sad', icon: <Frown className="h-5 w-5 text-blue-500" /> },
];

// Form schema definition using Zod
const formSchema = z.object({
  date: z.date({
    required_error: 'A date for the entry is required.',
  }),
  mood: z.enum(['happy', 'neutral', 'sad'], {
    required_error: 'You need to select a mood.',
  }),
  content: z.string().min(10, {
    message: 'Journal entry must be at least 10 characters.',
  }),
  tags: z.array(z.string()).optional(), // Tags are optional strings
  // image: z.string().optional(), // Placeholder for image data URL or link
  // voiceNote: z.string().optional(), // Placeholder for voice note data URL or link
});

type JournalEntryFormProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: JournalEntry) => void;
  entryToEdit?: JournalEntry | null;
};

export function JournalEntryForm({ isOpen, onOpenChange, onSave, entryToEdit }: JournalEntryFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentTags, setCurrentTags] = React.useState<string[]>(entryToEdit?.tags || []);
  const [tagInput, setTagInput] = React.useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: entryToEdit?.date || new Date(),
      mood: entryToEdit?.mood || 'neutral',
      content: entryToEdit?.content || '',
      tags: entryToEdit?.tags || [],
      // image: entryToEdit?.image || undefined,
      // voiceNote: entryToEdit?.voiceNote || undefined,
    },
  });

   // Effect to reset form when entryToEdit changes or dialog opens/closes
   React.useEffect(() => {
     if (isOpen) {
         form.reset({
             date: entryToEdit?.date || new Date(),
             mood: entryToEdit?.mood || 'neutral',
             content: entryToEdit?.content || '',
             tags: entryToEdit?.tags || [],
         });
         setCurrentTags(entryToEdit?.tags || []);
     } else {
         // Optional: Clear form fully when closing if not editing next time
         // form.reset();
         // setCurrentTags([]);
     }
   }, [isOpen, entryToEdit, form]);


  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault(); // Prevent form submission on Enter key in tag input
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !currentTags.includes(newTag)) {
         const updatedTags = [...currentTags, newTag];
         setCurrentTags(updatedTags);
         form.setValue('tags', updatedTags); // Update form state
      }
      setTagInput(''); // Clear input field
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = currentTags.filter((tag) => tag !== tagToRemove);
    setCurrentTags(updatedTags);
    form.setValue('tags', updatedTags); // Update form state
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const entryData: JournalEntry = {
      id: entryToEdit?.id || crypto.randomUUID(), // Use existing ID or generate new one
      date: values.date,
      mood: values.mood as Mood,
      content: values.content,
      tags: values.tags || [],
      // image: values.image, // Add image handling later
      // voiceNote: values.voiceNote, // Add voice note handling later
    };

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));

    onSave(entryData);
    setIsLoading(false);
    // Dialog closing is handled by parent via onOpenChange(false) after onSave
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]"> {/* Adjust width and height */}
        <DialogHeader>
          <DialogTitle>{entryToEdit ? 'Edit Journal Entry' : 'New Journal Entry'}</DialogTitle>
          <DialogDescription>
            {entryToEdit ? 'Update your thoughts and feelings.' : 'Record your thoughts, feelings, and experiences for today.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {/* Make form content scrollable */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-y-auto p-1 pr-4">
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP') // Pretty date format e.g., Aug 23, 2024
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mood Tracker */}
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>How are you feeling today?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      {moods.map((mood) => (
                        <FormItem key={mood.value} className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={mood.value} id={`mood-${mood.value}`} />
                          </FormControl>
                          <FormLabel htmlFor={`mood-${mood.value}`} className="flex items-center gap-2 font-normal cursor-pointer">
                             {mood.icon} {mood.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rich Text Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Journal Entry</FormLabel>
                    {/* Basic Toolbar Placeholder */}
                     <div className="flex space-x-2 mb-1 border rounded-t-md p-1 bg-muted/50">
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled title="Bold (Coming Soon)"> <Bold className="h-4 w-4"/> </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled title="Italic (Coming Soon)"> <Italic className="h-4 w-4"/> </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled title="Bullet List (Coming Soon)"> <List className="h-4 w-4"/> </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 ml-auto" disabled title="Add Image (Coming Soon)"> <ImageIcon className="h-4 w-4"/> </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" disabled title="Add Voice Note (Coming Soon)"> <Mic className="h-4 w-4"/> </Button>
                    </div>
                  <FormControl>
                    <Textarea
                      placeholder="Write about your day, your thoughts, feelings, or challenges..."
                      className="resize-y min-h-[150px] rounded-t-none focus-visible:ring-offset-0 focus-visible:ring-1" // Adjust min-height
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* Tagging System */}
              <FormItem>
                 <FormLabel className="flex items-center gap-2"><Tag className="h-4 w-4"/> Tags</FormLabel>
                 <FormControl>
                     <Input
                        type="text"
                        placeholder="Add tags (e.g., gratitude, challenge) and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="mb-2"
                     />
                 </FormControl>
                  <div className="flex flex-wrap gap-1">
                    {currentTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 rounded-full hover:bg-background/50 p-0.5"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormDescription className="text-xs">
                     Organize your entries with tags for easy searching.
                  </FormDescription>
                </FormItem>


            {/* Placeholder for Attachments (Image/Voice) - To be implemented */}
             {/* <FormItem>
                <FormLabel>Attachments</FormLabel>
                 <div className="flex gap-4">
                     <Button type="button" variant="outline" disabled> <ImageIcon className="mr-2 h-4 w-4"/> Add Photo (Soon)</Button>
                     <Button type="button" variant="outline" disabled> <Mic className="mr-2 h-4 w-4"/> Add Voice Note (Soon)</Button>
                 </div>
            </FormItem> */}

          </form>
        </Form>
         <DialogFooter className="mt-auto pt-4 border-t"> {/* Ensure footer is at bottom */}
            <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button type="submit" form="journal-entry-form" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                    </>
                ) : (
                    entryToEdit ? 'Update Entry' : 'Save Entry'
                )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
