
'use client';

import * as React from 'react';
import { ProgressTracker } from '@/components/progress-tracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription
import { Target, Info } from 'lucide-react'; // Added Info icon
import { RecoveryPlanDialog } from '@/components/recovery-plan-dialog';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function ProgressPage() {
  const [sobrietyStartDate, setSobrietyStartDate] = React.useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isLoadingDate, setIsLoadingDate] = React.useState(true); // Add loading state

   // Load start date from localStorage on initial mount
   React.useEffect(() => {
    setIsLoadingDate(true);
    // Simulate loading delay for visual feedback if needed
    // await new Promise(resolve => setTimeout(resolve, 300));
    const storedDate = localStorage.getItem('sobrietyStartDate');
    if (storedDate) {
      setSobrietyStartDate(new Date(storedDate));
    } else {
        console.log("No sobriety start date found in localStorage.");
    }
    setIsLoadingDate(false); // Set loading to false after checking localStorage
  }, []);

  // Handler for plan generation
  const handlePlanGenerated = (plan: string) => {
    console.log("Recovery Plan generated on Progress page.");
     const startDate = new Date(); // Set start date upon plan generation
     setSobrietyStartDate(startDate);
     localStorage.setItem('sobrietyStartDate', startDate.toISOString()); // Save to localStorage
     setIsFormOpen(false); // Close dialog
  };


  return (
    <main className="container mx-auto flex flex-col items-center p-6 md:p-12">
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold text-primary">
          Your Progress Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your journey, celebrate milestones, and find inspiration.
        </p>
      </header>

       {/* Use grid layout for consistency */}
       <div className="grid w-full max-w-6xl gap-8">
         {isLoadingDate ? (
            // Show skeleton loaders while checking for the start date
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full md:col-span-2 lg:col-span-1" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>

         ) : sobrietyStartDate ? (
             // If date exists, show the tracker (which now spans multiple columns)
            <ProgressTracker sobrietyStartDate={sobrietyStartDate} />
         ) : (
            // If no date, show the prompt card (center it or span columns)
            <div className="col-span-full flex justify-center"> {/* Center the card */}
                <Card className="w-full max-w-lg text-center shadow-lg border-accent bg-accent/5">
                    <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-accent">
                        <Info className="h-5 w-5"/> Start Your Recovery Journey
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        To track your progress and access milestones, you first need to generate your personalized recovery plan. This will set your sobriety start date.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Button onClick={() => setIsFormOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Target className="mr-2 h-4 w-4" /> Create Your Recovery Plan
                    </Button>
                    </CardContent>
                </Card>
            </div>
         )}
        </div>


        {/* Dialog for Recovery Plan Form (Conditionally rendered) */}
        {!sobrietyStartDate && (
            <RecoveryPlanDialog
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                onPlanGenerated={handlePlanGenerated}
            />
        )}
    </main>
  );
}
