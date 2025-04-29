
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus, Trash2, PhoneCall, Globe } from 'lucide-react'; // Added Globe icon
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface CountryHelpline {
    countryCode: string;
    countryName: string;
    addictionHelpline?: { name: string; number: string; url?: string }; // General mental health/addiction helpline
    crisisHelpline: { name: string; number: string; url?: string }; // Suicide/Crisis helpline
}

// Disclaimer: Helpline numbers are examples and require verification for production use.
// Finding exact SAMHSA equivalents globally is difficult. Focus is on crisis lines and general support.
const countryHelplines: CountryHelpline[] = [
  {
    countryCode: 'US',
    countryName: 'United States',
    addictionHelpline: { name: 'SAMHSA National Helpline', number: '1-800-662-HELP (4357)', url: 'https://www.samhsa.gov/find-help/national-helpline' },
    crisisHelpline: { name: '988 Suicide & Crisis Lifeline', number: 'Call or Text 988', url: 'https://988lifeline.org/' },
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    addictionHelpline: { name: 'Wellness Together Canada', number: '1-866-585-0445 or Text WELLNESS to 741741', url: 'https://www.wellnesstogether.ca/' }, // General mental wellness/substance use portal
    crisisHelpline: { name: 'Talk Suicide Canada', number: '1-833-456-4566', url: 'https://talksuicide.ca/' },
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    addictionHelpline: { name: 'FRANK (National Drugs Helpline)', number: '0300 123 6600 or Text 82111', url: 'https://www.talktofrank.com/' },
    crisisHelpline: { name: 'Samaritans', number: '116 123', url: 'https://www.samaritans.org/' },
  },
   {
    countryCode: 'AU',
    countryName: 'Australia',
    addictionHelpline: { name: 'National Alcohol and Other Drug Hotline', number: '1800 250 015', url: 'https://www.health.gov.au/contacts/national-alcohol-and-other-drug-hotline' },
    crisisHelpline: { name: 'Lifeline Australia', number: '13 11 14', url: 'https://www.lifeline.org.au/' },
  },
  // Add more countries as needed
];


const CONTACTS_STORAGE_KEY = 'emergencyContacts';

export function EmergencyContacts() {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [newContactName, setNewContactName] = React.useState('');
  const [newContactPhone, setNewContactPhone] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState<string>('US'); // Default to US
  const { toast } = useToast();

  // Load contacts from local storage on mount
  React.useEffect(() => {
    const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
    // Could also store/retrieve selected country if desired
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

  const currentHelplines = countryHelplines.find(h => h.countryCode === selectedCountry);

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
          <UserPlus className="mr-2 h-4 w-4" /> Add Personal Contact
        </Button>
      )}


      {/* List of Personal Contacts */}
      {contacts.length > 0 && (
         <div className="space-y-2 pt-2">
             <p className="text-xs font-medium text-muted-foreground px-1">Your Personal Contacts:</p>
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
                        This action cannot be undone. This will permanently remove {contact.name} from your personal contacts.
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
         </div>
      )}
      {contacts.length === 0 && !isAdding && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Your personal contact list is empty. Add trusted people you can reach out to for support.
        </p>
      )}

       {/* National Helplines */}
       <Card className="mt-6 border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                   <Globe className="h-4 w-4"/> National Helplines
                </CardTitle>
                <CardDescription className="text-xs">Select your country to find relevant support resources.</CardDescription>
                 {/* Country Selector */}
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full mt-2 h-9 text-xs">
                        <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                        {countryHelplines.map((country) => (
                        <SelectItem key={country.countryCode} value={country.countryCode} className="text-xs">
                            {country.countryName}
                        </SelectItem>
                        ))}
                         <SelectItem value="other" disabled className="text-xs">More countries coming soon...</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="space-y-2 text-xs pt-0">
                 {currentHelplines ? (
                    <>
                        {currentHelplines.addictionHelpline && (
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <span className="font-medium text-primary/90">{currentHelplines.addictionHelpline.name}:</span>
                                <a
                                    href={currentHelplines.addictionHelpline.url || `tel:${currentHelplines.addictionHelpline.number.replace(/[^\d+]/g, '')}`} // Create tel link from number
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-primary hover:underline"
                                >
                                    {currentHelplines.addictionHelpline.number}
                                </a>
                            </div>
                        )}
                         <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                            <span className="font-medium text-primary/90">{currentHelplines.crisisHelpline.name}:</span>
                             <a
                                href={currentHelplines.crisisHelpline.url || `tel:${currentHelplines.crisisHelpline.number.replace(/[^\d+]/g, '')}`} // Create tel link from number
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:underline"
                            >
                                {currentHelplines.crisisHelpline.number}
                            </a>
                         </div>
                         <p className="text-xs text-muted-foreground pt-2 italic">
                             Helpline information is for {currentHelplines.countryName}. Please verify numbers before calling.
                         </p>
                    </>
                ) : (
                     <p className="text-xs text-muted-foreground text-center py-2">
                         Please select a country to view national helplines.
                     </p>
                 )}
            </CardContent>
       </Card>
    </div>
  );
}

    