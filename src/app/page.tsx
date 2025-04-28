'use client';

import * as React from 'react';
import { RecoveryPlanForm } from '@/components/recovery-plan-form';
import { ProgressTracker } from '@/components/progress-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Target, TrendingUp } from 'lucide-react';

export default function Home() {
  const [recoveryPlan, setRecoveryPlan] = React.useState<string | null>(null);
  const [sobrietyStartDate, setSobrietyStartDate] = React.useState<Date | null>(null);

  // Simulate setting a start date when the plan is generated
  const handlePlanGenerated = (plan: string) => {
    setRecoveryPlan(plan);
    if (!sobrietyStartDate) {
      setSobrietyStartDate(new Date());
    }
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center p-6 md:p-12">
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold text-primary">
          Road to Recovery
        </h1>
        <p className="text-lg text-muted-foreground">
          Your personalized path to overcoming addiction.
        </p>
      </header>

      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Start Your Journey
            </CardTitle>
             <Target className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Answer a few questions to generate your personalized recovery plan.
            </p>
            <RecoveryPlanForm onPlanGenerated={handlePlanGenerated} />
          </CardContent>
        </Card>

        <div className="space-y-8">
           {recoveryPlan && (
            <Card className="shadow-lg bg-secondary/10 border-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-secondary-foreground">
                  Your Recovery Plan
                </CardTitle>
                <HeartPulse className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-secondary-foreground">
                  {recoveryPlan}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Your Progress</CardTitle>
               <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
               {sobrietyStartDate ? (
                 <ProgressTracker sobrietyStartDate={sobrietyStartDate} />
               ) : (
                 <p className="text-sm text-muted-foreground">Complete the questionnaire to start tracking your progress.</p>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
