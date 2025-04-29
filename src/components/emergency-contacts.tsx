
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardHeader, CardTitle, CardDescription
import { UserPlus, Trash2, PhoneCall } from 'lucide-react'; // Icons for actions
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

const CONTACTS_STORAGE_KEY = 'emergencyContacts';

export function EmergencyContacts() {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [newContactName, setNewContactName] = React.useState('');
  const [newContactPhone, setNewContactPhone] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const { toast } = useToast();

  // Load contacts from local storage on mount
  React.useEffect(() => {
    const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  // Save contacts to local storage whenever they change
  React.useEffect(() => {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter both name and phone number.',
      });
      return;
    }
    // Basic phone number validation (optional, enhance as needed)
    if (!/^\+?[\d\s-()]{7,}$/.test(newContactPhone)) {
       toast({
        variant: 'destructive',
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number.',
      });
      return;
    }

    const newContact: Contact = {
      id: crypto.randomUUID(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
    };
    setContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    setIsAdding(false); // Close add form
    toast({
      title: 'Contact Added',
      description: `${newContact.name} has been added to your emergency list.`,
    });
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    toast({
      title: 'Contact Removed',
      description: 'The contact has been removed from your list.',
    });
  };

  return (
    <div className="space-y-4">
      {/* Add Contact Form (conditional) */}
      {isAdding ? (
        <Card className="bg-muted/30 p-4 space-y-3">
          <Input
            placeholder="Contact Name (e.g., Sponsor, Therapist)"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Phone Number"
            type="tel"
            value={newContactPhone}
            onChange={(e) => setNewContactPhone(e.target.value)}
            className="text-sm"
          />
          <div className="flex justify-end gap-2">
             <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
             <Button size="sm" onClick={handleAddContact}>Save Contact</Button>
          </div>
        </Card>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setIsAdding(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New Contact
        </Button>
      )}


      {/* List of Contacts */}
      {contacts.length === 0 && !isAdding && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Your emergency contact list is empty. Add trusted people you can reach out to for support.
        </p>
      )}

      {contacts.map((contact) => (
        <Card key={contact.id} className="bg-card">
          <CardContent className="p-3 flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-sm text-card-foreground">{contact.name}</p>
              <a href={`tel:${contact.phone}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                 <PhoneCall className="h-3 w-3" /> {contact.phone}
              </a>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete {contact.name}</span>
                 </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove {contact.name} from your emergency contacts.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={() => handleDeleteContact(contact.id)}
                     className="bg-destructive text-destructive-foreground hover:bg-destructive/90" // Destructive variant styling
                    >
                    Delete Contact
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ))}

       {/* Static Important Helplines */}
       <Card className="mt-6 border-primary/50 bg-primary/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-primary">National Helplines</CardTitle>
                <CardDescription className="text-xs">Always available resources for immediate support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                    <span>SAMHSA National Helpline:</span>
                    <a href="tel:1-800-662-HELP" className="font-medium text-primary hover:underline">1-800-662-HELP (4357)</a>
                </div>
                 <div className="flex justify-between items-center">
                    <span>988 Suicide & Crisis Lifeline:</span>
                    <a href="tel:988" className="font-medium text-primary hover:underline">Call or Text 988</a>
                </div>
                 {/* Add more relevant helplines */}
            </CardContent>
       </Card>
    </div>
  );
}
