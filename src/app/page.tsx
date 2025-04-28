
'use client';

import * as React from 'react';
import { RecoveryPlanForm } from '@/components/recovery-plan-form';
import { ProgressTracker } from '@/components/progress-tracker';
import { ChatSupport } from '@/components/chat-support'; // Import ChatSupport
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Target, TrendingUp, MessageSquareHeart } from 'lucide-react'; // Add MessageSquareHeart

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

      {/* Use a 3-column layout on larger screens */}
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-3">
        {/* Column 1: Form & Progress */}
        <div className="space-y-8 lg:col-span-1">
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

        {/* Column 2: Chat Support */}
        <div className="lg:col-span-1">
          <ChatSupport />
        </div>


        {/* Column 3: Recovery Plan (if generated) */}
        {recoveryPlan && (
            <div className="lg:col-span-1">
                <Card className="shadow-lg bg-secondary/10 border-secondary sticky top-12"> {/* Make plan sticky */}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium text-secondary-foreground">
                        Your Recovery Plan
                        </CardTitle>
                        <HeartPulse className="h-5 w-5 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        {/* Use prose for better markdown formatting */}
                        <div className="prose prose-sm max-w-none text-secondary-foreground whitespace-pre-wrap">
                            {/* Replace newline characters potentially missed by whitespace-pre-wrap */}
                            {recoveryPlan.split('\\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line.startsWith('## ') ? <h2>{line.substring(3)}</h2> :
                                     line.startsWith('# ') ? <h1>{line.substring(2)}</h1> :
                                     line.startsWith('* ') || line.startsWith('- ') ? <li>{line.substring(2)}</li> :
                                     line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ') || line.startsWith('6. ') || line.startsWith('7. ') ? <p>{line}</p> : /* Assuming numbered list is part of paragraph */
                                     line === '' ? <br/> :
                                     <p>{line}</p>}
                                </React.Fragment>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
         {/* Placeholder if no recovery plan */}
         {!recoveryPlan && <div className="lg:col-span-1 hidden lg:block"></div>}

      </div>
    </main>
  );
}
