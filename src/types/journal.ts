
export type Mood = 'happy' | 'neutral' | 'sad';

export interface JournalEntry {
  id: string; // Unique identifier for the entry
  date: Date; // Date of the entry
  mood: Mood; // Mood associated with the entry
  content: string; // The main text content of the journal entry
  tags: string[]; // Array of tags for organization and search
  // Optional fields for future enhancements
  image?: string; // URL or data URI of an attached image
  voiceNote?: string; // URL or data URI of an attached voice note
}
