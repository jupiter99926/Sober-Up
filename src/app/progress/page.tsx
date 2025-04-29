
'use client';

import * as React from 'react';
import { ProgressTracker } from '@/components/progress-tracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { RecoveryPlanDialog } from '@/components/recovery-plan-dialog'; // Import the dialog

export default function ProgressPage() {
  const [sobrietyStartDate, setSobrietyStartDate] = React.useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false); // State for dialog visibility

   // Load start date from localStorage on initial mount
   React.useEffect(() => {
    const storedDate = localStorage.getItem('sobrietyStartDate');
    if (storedDate) {
      setSobrietyStartDate(new Date(storedDate));
    } else {
        // If no start date, prompt user to create a plan (optional)
        // Consider showing a different message or component
        console.log("No sobriety start date found. Prompting user might be needed.");
    }
  }, []);

  // Dummy handler for plan generation - in a real app, this might be handled differently
  // if the plan generation is only on the main page.
  const handlePlanGenerated = (plan: string) => {
    console.log("Plan generated (from Progress page - likely needs adjustment):", plan);
     if (!sobrietyStartDate) {
       const startDate = new Date();
       setSobrietyStartDate(startDate);
       localStorage.setItem('sobrietyStartDate', startDate.toISOString());
     }
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

      <div className="w-full max-w-3xl"> {/* Adjusted width */}
        {sobrietyStartDate ? (
          <ProgressTracker sobrietyStartDate={sobrietyStartDate} />
        ) : (
          <Card className="shadow-lg text-center">
            <CardHeader>
              <CardTitle>Start Tracking Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                You need a sobriety start date to track your progress. Generate your personalized recovery plan to begin.
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Target className="mr-2 h-4 w-4" /> Create Recovery Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

        {/* Dialog for Recovery Plan Form (Conditional) */}
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
