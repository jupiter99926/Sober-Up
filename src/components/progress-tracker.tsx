'use client';

import * as React from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, formatDistanceStrict } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CalendarDays, HeartPulse } from 'lucide-react';

type ProgressTrackerProps = {
  sobrietyStartDate: Date;
};

// Helper function to calculate time difference in various units
const calculateTimeSober = (startDate: Date) => {
  const now = new Date();
  const days = differenceInDays(now, startDate);
  const hours = differenceInHours(now, startDate) % 24;
  const minutes = differenceInMinutes(now, startDate) % 60;
  const totalMonths = differenceInMonths(now, startDate);
  const formattedDistance = formatDistanceStrict(startDate, now);

  return { days, hours, minutes, totalMonths, formattedDistance };
};

// Helper function to get progress towards next milestone
const getMilestoneProgress = (daysSober: number): { nextMilestone: number, progress: number } => {
  if (daysSober < 7) return { nextMilestone: 7, progress: (daysSober / 7) * 100 };
  if (daysSober < 30) return { nextMilestone: 30, progress: (daysSober / 30) * 100 };
  if (daysSober < 90) return { nextMilestone: 90, progress: (daysSober / 90) * 100 };
  if (daysSober < 180) return { nextMilestone: 180, progress: (daysSober / 180) * 100 };
  if (daysSober < 365) return { nextMilestone: 365, progress: (daysSober / 365) * 100 };
  const yearsSober = Math.floor(daysSober / 365);
  const nextYearMilestone = (yearsSober + 1) * 365;
  return { nextMilestone: nextYearMilestone, progress: (daysSober / nextYearMilestone) * 100 };
};


export function ProgressTracker({ sobrietyStartDate }: ProgressTrackerProps) {
  const [timeSober, setTimeSober] = React.useState(calculateTimeSober(sobrietyStartDate));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeSober(calculateTimeSober(sobrietyStartDate));
    }, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, [sobrietyStartDate]);

  const { days, hours, minutes, formattedDistance } = timeSober;
  const { nextMilestone, progress } = getMilestoneProgress(days);


  return (
    <div className="space-y-4">
       <Card className="bg-primary/10 border-primary">
          <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm text-primary">
                  <CalendarDays className="h-4 w-4" /> Sobriety Clock
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-primary">{formattedDistance}</CardTitle>
          </CardHeader>
           <CardContent>
               <p className="text-xs text-muted-foreground">
                   {`${days} days, ${hours} hours, ${minutes} minutes sober.`}
               </p>
           </CardContent>
       </Card>

      <Card>
          <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm text-accent">
                <Award className="h-4 w-4"/> Next Milestone
              </CardDescription>
             <CardTitle className="text-xl font-semibold text-accent">
                {nextMilestone} Days
            </CardTitle>
          </CardHeader>
          <CardContent>
               <Progress value={progress} aria-label={`${Math.round(progress)}% towards next milestone`} className="h-2"/>
               <p className="mt-1 text-xs text-muted-foreground">{`${days} / ${nextMilestone} days`}</p>
           </CardContent>
       </Card>

      {/* Placeholder for future health improvements */}
      <Card className="bg-secondary/10 border-secondary">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-sm text-secondary-foreground">
                <HeartPulse className="h-4 w-4" /> Future Health Benefits
            </CardDescription>
            <CardTitle className="text-lg font-medium text-secondary-foreground">Potential Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
              <li>Improved sleep patterns (often within weeks)</li>
              <li>Better cardiovascular health (months to years)</li>
              <li>Reduced risk of certain cancers (long-term)</li>
              <li>Enhanced mental clarity and focus</li>
            </ul>
             <p className="mt-2 text-xs text-muted-foreground italic">Note: Health benefits vary based on substance, duration of use, and individual factors.</p>
          </CardContent>
        </Card>
    </div>
  );
}
