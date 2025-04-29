
'use client';

import * as React from 'react';
import { RecoveryPlanDialog } from '@/components/recovery-plan-dialog'; // Renamed import
import { ProgressTracker } from '@/components/progress-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button


export default function Home() {
  const [recoveryPlan, setRecoveryPlan] = React.useState<string | null>(null);
  const [sobrietyStartDate, setSobrietyStartDate] = React.useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false); // State to control dialog

  // Simulate setting a start date when the plan is generated
  const handlePlanGenerated = (plan: string) => {
    setRecoveryPlan(plan);
    if (!sobrietyStartDate) {
      const startDate = new Date();
      setSobrietyStartDate(startDate);
       // Store start date in localStorage
       localStorage.setItem('sobrietyStartDate', startDate.toISOString());
    }
    setIsFormOpen(false); // Close the dialog
  };

   // Load start date from localStorage on initial mount
   React.useEffect(() => {
    const storedDate = localStorage.getItem('sobrietyStartDate');
    if (storedDate) {
      setSobrietyStartDate(new Date(storedDate));
    }
    // TODO: Persist recovery plan as well if needed
  }, []);

  return (
    <main className="container mx-auto flex flex-col items-center p-6 md:p-12">
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold text-primary">
          Road to Recovery
        </h1>
        <p className="text-lg text-muted-foreground">
          Your personalized path to overcoming addiction.
        </p>
      </header>

      {/* Use a 2-column layout on larger screens, stacking on smaller */}
       <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-3">

         {/* Column 1: Progress Tracking */}
         <div className="space-y-8 lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Your Progress</CardTitle>
               <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
               {sobrietyStartDate ? (
                 <ProgressTracker sobrietyStartDate={sobrietyStartDate} />
               ) : (
                 <div className="text-center">
                     <p className="text-sm text-muted-foreground mb-4">Generate your recovery plan to start tracking your progress.</p>
                     <Button onClick={() => setIsFormOpen(true)}>
                       <Target className="mr-2 h-4 w-4" /> Start Your Journey
                    </Button>
                 </div>
               )}
            </CardContent>
          </Card>

           {/* Dialog for Recovery Plan Form */}
           <RecoveryPlanDialog
             isOpen={isFormOpen}
             onOpenChange={setIsFormOpen}
             onPlanGenerated={handlePlanGenerated}
           />
        </div>


        {/* Column 2 & 3: Recovery Plan (if generated) */}
        {recoveryPlan && (
            <div className="lg:col-span-2"> {/* Span 2 columns */}
                <Card className="shadow-lg bg-secondary/10 border-secondary sticky top-12"> {/* Make plan sticky */}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium text-secondary-foreground">
                        Your Recovery Plan
                        </CardTitle>
                        <HeartPulse className="h-5 w-5 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        {/* Use prose for better markdown formatting */}
                         {/* Apply max-h and overflow for long plans */}
                         <div className="prose prose-sm max-w-none text-secondary-foreground whitespace-pre-wrap max-h-[70vh] overflow-y-auto">
                            {/* Replace newline characters potentially missed by whitespace-pre-wrap */}
                            {recoveryPlan.split('\\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line.startsWith('## ') ? <h2>{line.substring(3)}</h2> :
                                     line.startsWith('# ') ? <h1>{line.substring(2)}</h1> :
                                     line.startsWith('* ') || line.startsWith('- ') ? <li className="ml-4">{line.substring(2)}</li> : // Add margin for list items
                                     /^\d+\.\s/.test(line) ? <li className="ml-4">{line}</li> : // Match numbered lists and add margin
                                     line === '' ? <br/> :
                                     <p>{line}</p>}
                                </React.Fragment>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
         {/* Placeholder if no recovery plan yet */}
         {!recoveryPlan && <div className="lg:col-span-2 hidden lg:block"></div>}

      </div>
    </main>
  );
}

