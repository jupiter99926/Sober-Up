
'use client';

import * as React from 'react';
import { PlusCircle, Search, Calendar, NotebookPen } from 'lucide-react'; // Import NotebookPen
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JournalEntryForm } from '@/components/journal/journal-entry-form';
import { JournalEntryList } from '@/components/journal/journal-entry-list';
import type { JournalEntry } from '@/types/journal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// Key for storing journal entries in local storage
const JOURNAL_STORAGE_KEY = 'journalEntries';

export default function JournalingPage() {
  const [entries, setEntries] = React.useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [entryToEdit, setEntryToEdit] = React.useState<JournalEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = React.useState<string | null>(null); // Store ID of entry to delete
  const { toast } = useToast();

  // Load entries from local storage on mount
  React.useEffect(() => {
    const storedEntries = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (storedEntries) {
      try {
         // Parse and ensure date is a Date object
        const parsedEntries = JSON.parse(storedEntries).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        }));
        setEntries(parsedEntries);
      } catch (error) {
        console.error("Failed to parse journal entries from storage:", error);
        setEntries([]); // Fallback to empty array on parse error
      }
    }
  }, []);

  // Save entries to local storage whenever they change
  React.useEffect(() => {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = (entry: JournalEntry) => {
    setEntries((prevEntries) => {
      const existingIndex = prevEntries.findIndex((e) => e.id === entry.id);
      if (existingIndex > -1) {
        // Update existing entry
        const updatedEntries = [...prevEntries];
        updatedEntries[existingIndex] = entry;
        return updatedEntries.sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort after update
      } else {
        // Add new entry
        return [...prevEntries, entry].sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort after add
      }
    });
    setIsFormOpen(false); // Close the form dialog/modal
    setEntryToEdit(null); // Clear editing state
     toast({
        title: entryToEdit ? 'Entry Updated' : 'Entry Saved',
        description: 'Your journal entry has been saved successfully.',
    });
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEntryToEdit(entry);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (entryToDelete) {
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== entryToDelete));
      toast({
        title: 'Entry Deleted',
        description: 'The journal entry has been removed.',
      });
      setEntryToDelete(null); // Close the confirmation dialog
    }
  };

  const openDeleteConfirmation = (id: string) => {
    setEntryToDelete(id);
  }

  const closeDeleteConfirmation = () => {
    setEntryToDelete(null);
  }

  const openNewEntryForm = () => {
    setEntryToEdit(null); // Ensure we are creating a new entry
    setIsFormOpen(true);
  };

  // Filter entries based on search term (content or tags)
  const filteredEntries = entries.filter((entry) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const contentMatch = entry.content.toLowerCase().includes(lowerSearchTerm);
    const tagsMatch = entry.tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm));
    return contentMatch || tagsMatch;
  });

  return (
    <main className="container mx-auto flex flex-col p-6 md:p-12 h-[calc(100vh-theme(spacing.14))]"> {/* Adjust height */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="mb-1 text-3xl font-bold text-primary flex items-center gap-2">
             <NotebookPen className="h-7 w-7" /> Personal Journal
          </h1>
          <p className="text-md text-muted-foreground">
            Reflect on your journey, track your mood, and capture your thoughts.
          </p>
        </div>
        <Button onClick={openNewEntryForm} className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Entry
        </Button>
      </header>

       {/* Search and View Options */}
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search entries by text or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          {/* Placeholder for Calendar View Toggle */}
           {/* <Button variant="outline" size="icon" disabled>
            <Calendar className="h-4 w-4" />
             <span className="sr-only">Calendar View (Coming Soon)</span>
           </Button> */}
        </div>


      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden"> {/* Make list area scrollable */}
        <JournalEntryList
          entries={filteredEntries}
          onEdit={handleEditEntry}
          onDelete={openDeleteConfirmation} // Pass function to open confirmation
        />
      </div>

      {/* Form Dialog/Modal */}
      <JournalEntryForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveEntry}
        entryToEdit={entryToEdit}
      />

       {/* Delete Confirmation Dialog */}
       <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && closeDeleteConfirmation()}>
          {/* <AlertDialogTrigger> // Triggered programmatically */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this journal entry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteConfirmation}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Entry
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
       </AlertDialog>
    </main>
  );
}
