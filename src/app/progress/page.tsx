
'use client';

import * as React from 'react';
import { ProgressTracker } from '@/components/progress-tracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, Info, TrendingUp } from 'lucide-react'; // Added TrendingUp
import { RecoveryPlanDialog } from '@/components/recovery-plan-dialog';
import { Skeleton } from '@/components/ui/skeleton';

// Key for storing sobriety start date in local storage
const SOBRIETY_START_DATE_KEY = 'sobrietyStartDate';
const RECOVERY_PLAN_KEY = 'recoveryPlan'; // Use the same key as home page


export default function ProgressPage() {
  const [sobrietyStartDate, setSobrietyStartDate] = React.useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isLoadingDate, setIsLoadingDate] = React.useState(true); // Start in loading state

   // Load start date from localStorage on initial mount
   React.useEffect(() => {
    // No need to explicitly set isLoadingDate to true here, it starts as true

    // Directly check localStorage
    const storedDate = localStorage.getItem(SOBRIETY_START_DATE_KEY);
    if (storedDate) {
      try {
          const parsedDate = new Date(storedDate);
          // Basic validation if the date is valid
          if (!isNaN(parsedDate.getTime())) {
              setSobrietyStartDate(parsedDate);
          } else {
               console.error("Invalid date found in localStorage:", storedDate);
               localStorage.removeItem(SOBRIETY_START_DATE_KEY); // Clear invalid date
          }
      } catch (error) {
          console.error("Error parsing date from localStorage:", error);
          localStorage.removeItem(SOBRIETY_START_DATE_KEY); // Clear potentially corrupt data
      }

    } else {
        console.log("No sobriety start date found in localStorage.");
    }

    // Finish loading after checking (and potential parsing)
    // Use setTimeout to ensure skeleton is visible for a brief moment even if data loads instantly
    const timer = setTimeout(() => {
       setIsLoadingDate(false);
    }, 100); // Small delay (e.g., 100ms)

    return () => clearTimeout(timer); // Cleanup timer on unmount


  }, []);

  // Handler for plan generation (sets start date and saves plan - similar to home)
  const handlePlanGenerated = (plan: string) => {
    console.log("Recovery Plan generated on Progress page.");
     const startDate = new Date(); // Set start date upon plan generation
     setSobrietyStartDate(startDate);
     localStorage.setItem(SOBRIETY_START_DATE_KEY, startDate.toISOString()); // Save to localStorage
     localStorage.setItem(RECOVERY_PLAN_KEY, plan); // Save plan too
     setIsLoadingDate(false); // Ensure loading is false after setting date
     setIsFormOpen(false); // Close dialog
  };


  return (
    <main className="container mx-auto flex flex-col items-center p-6 md:p-12">
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold text-primary flex items-center justify-center gap-3">
            <TrendingUp className="h-8 w-8" /> Your Progress Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your journey, celebrate milestones, and view your progress.
        </p>
      </header>

       {/* Use grid layout for consistency */}
       <div className="grid w-full max-w-6xl gap-8">
         {isLoadingDate ? (
            // Show skeleton loaders while checking for the start date
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:col-span-3 animate-pulse">
                {/* Simulate ProgressTracker layout */}
                 {/* Column 1 */}
                 <div className="space-y-6 lg:col-span-1">
                     <Skeleton className="h-28 w-full rounded-lg" /> {/* Sobriety Clock */}
                     <Skeleton className="h-36 w-full rounded-lg" /> {/* Next Milestone */}
                 </div>
                  {/* Column 2 */}
                 <div className="space-y-6 lg:col-span-1">
                     <Skeleton className="h-24 w-full rounded-lg" /> {/* Money Saved */}
                     <Skeleton className="h-32 w-full rounded-lg" /> {/* Earned Milestones */}
                 </div>
                  {/* Column 3 */}
                  <div className="space-y-6 lg:col-span-1">
                     <Skeleton className="h-48 w-full rounded-lg" /> {/* Health Benefits */}
                     <Skeleton className="h-32 w-full rounded-lg" /> {/* Substance Tracking */}
                 </div>
            </div>

         ) : sobrietyStartDate ? (
             // If date exists, show the tracker (which now spans multiple columns)
            <ProgressTracker sobrietyStartDate={sobrietyStartDate} />
         ) : (
            // If no date, show the prompt card (center it or span columns)
            <div className="col-span-full flex justify-center"> {/* Center the card */}
                <Card className="w-full max-w-lg text-center shadow-lg border-accent bg-accent/5 transition-shadow hover:shadow-xl"> {/* Added hover effect */}
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


        {/* Dialog for Recovery Plan Form (Conditionally rendered if no start date or during loading) */}
        {!isLoadingDate && !sobrietyStartDate && (
            <RecoveryPlanDialog
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                onPlanGenerated={handlePlanGenerated}
            />
        )}
    </main>
  );
}

    