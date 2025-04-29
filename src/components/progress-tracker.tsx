
'use client';

import * as React from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, formatDistanceStrict } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CalendarDays, HeartPulse, Trophy, BarChart, Calendar, DollarSign, Brain } from 'lucide-react'; // Added DollarSign, Brain
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading states

type ProgressTrackerProps = {
  sobrietyStartDate: Date;
};


// --- Helper Functions ---

const calculateTimeSober = (startDate: Date) => {
  const now = new Date();
  const days = differenceInDays(now, startDate);
  const hours = differenceInHours(now, startDate) % 24;
  const minutes = differenceInMinutes(now, startDate) % 60;
  const totalMonths = differenceInMonths(now, startDate);

  // Build a more detailed string
  let detailedDistance = formatDistanceStrict(startDate, now, { addSuffix: false });
  // Add hours and minutes for the first day
  if (days < 1) {
     const totalHours = differenceInHours(now, startDate);
     const totalMinutes = differenceInMinutes(now, startDate) % 60;
     detailedDistance = `${totalHours} hours, ${totalMinutes} minutes`;
  } else if (days < 30) {
     // Add hours for the first month
     const totalHours = differenceInHours(now, startDate) % 24;
     detailedDistance = `${days} days, ${totalHours} hours`;
  }
  // formatDistanceStrict handles months/years well

  return { days, hours, minutes, totalMonths, formattedDistance: detailedDistance };
};

// Define milestones and corresponding badges/rewards
const milestones = [
  { days: 1, name: 'Day 1', badgeIcon: <Award className="h-4 w-4 text-green-500" />, reward: 'First Step Badge' },
  { days: 7, name: '1 Week', badgeIcon: <Award className="h-4 w-4 text-blue-500" />, reward: 'Week Milestone Badge' },
  { days: 30, name: '1 Month', badgeIcon: <Award className="h-4 w-4 text-purple-500" />, reward: 'Month Milestone Badge' },
  { days: 90, name: '3 Months', badgeIcon: <Trophy className="h-4 w-4 text-yellow-500" />, reward: 'Quarter Year Trophy' },
  { days: 180, name: '6 Months', badgeIcon: <Trophy className="h-4 w-4 text-orange-500" />, reward: 'Half Year Trophy' },
  { days: 365, name: '1 Year', badgeIcon: <Trophy className="h-4 w-4 text-red-500" />, reward: 'One Year Anniversary Trophy' },
  // Add more milestones as needed
];

const getEarnedMilestones = (daysSober: number) => {
  return milestones.filter(m => daysSober >= m.days).sort((a, b) => b.days - a.days); // Show newest first
};

const getNextMilestone = (daysSober: number): { name: string, daysNeeded: number, progress: number, reward: string, badgeIcon: React.ReactNode } | null => {
    const upcoming = milestones.find(m => daysSober < m.days);
    if (!upcoming) return null; // All milestones achieved (or define yearly milestones)

    const daysNeeded = upcoming.days;
    // Calculate progress based on days *since the last milestone* for better visual representation
    const previousMilestoneDays = milestones
        .filter(m => m.days <= daysSober)
        .reduce((max, m) => Math.max(max, m.days), 0);

    const daysTowardsNext = daysSober - previousMilestoneDays;
    const daysTotalForNext = upcoming.days - previousMilestoneDays;
    const progress = daysTotalForNext > 0 ? Math.min(100, (daysTowardsNext / daysTotalForNext) * 100) : 0; // Cap progress at 100

    return { name: upcoming.name, daysNeeded: upcoming.days, progress, reward: upcoming.reward, badgeIcon: upcoming.badgeIcon };
};

// Simple function to estimate money saved (replace with user input later)
const estimateMoneySaved = (daysSober: number) => {
    // TODO: Allow user to input their estimated daily/weekly spending
    const estimatedDailySpending = 10; // Example: $10 per day
    const totalSaved = daysSober * estimatedDailySpending;
    // Format as currency
    return totalSaved.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

// Simple function to estimate calories saved (example for alcohol)
const estimateCaloriesSaved = (daysSober: number) => {
     // TODO: Allow user to select substance and estimate intake
    const estimatedDailyCalories = 300; // Example: Calories from 2-3 alcoholic drinks
    return (daysSober * estimatedDailyCalories).toLocaleString();
}


// --- Component ---

export function ProgressTracker({ sobrietyStartDate }: ProgressTrackerProps) {
  const [timeSober, setTimeSober] = React.useState(() => calculateTimeSober(sobrietyStartDate));
  const [loading, setLoading] = React.useState(false); // Keep loading state for potential future async ops if needed

  // Set up timer to update the clock
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeSober(calculateTimeSober(sobrietyStartDate));
    }, 1000 * 60); // Update clock every minute

    return () => clearInterval(interval);
  }, [sobrietyStartDate]); // Rerun effect if start date changes

  const { days, formattedDistance } = timeSober;
  const earnedMilestones = getEarnedMilestones(days);
  const nextMilestone = getNextMilestone(days);
  const moneySaved = estimateMoneySaved(days);
  const caloriesSaved = estimateCaloriesSaved(days); // Example calculation

  // --- Render ---

  return (
    // Updated grid to span all columns for the main tracker view
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:col-span-3">

        {/* Column 1: Core Stats & Milestones */}
        <div className="space-y-6 lg:col-span-1">
          {/* Sobriety Clock */}
          <Card className="bg-primary/10 border-primary shadow-md">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm text-primary font-medium">
                <CalendarDays className="h-4 w-4" /> Time Sober
              </CardDescription>
              <CardTitle className="text-3xl font-bold text-primary">{formattedDistance}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {`Day ${days}`} - Keep up the great work!
              </p>
            </CardContent>
          </Card>

          {/* Next Milestone Progress */}
          {loading ? <Skeleton className="h-[130px] w-full" /> : nextMilestone ? (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-sm text-accent font-medium">
                  <BarChart className="h-4 w-4" /> Next Milestone Target
                </CardDescription>
                <CardTitle className="text-xl font-semibold text-accent flex items-center gap-2">
                   {React.cloneElement(nextMilestone.badgeIcon as React.ReactElement, { className: "h-5 w-5" })} {/* Adjust icon size */}
                   {nextMilestone.name} ({nextMilestone.daysNeeded} Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={nextMilestone.progress} aria-label={`${Math.round(nextMilestone.progress)}% towards ${nextMilestone.name}`} className="h-3 mb-1.5 bg-accent/20 [&>div]:bg-accent" />
                <p className="text-xs text-muted-foreground">
                  {`${days} / ${nextMilestone.daysNeeded} days toward "${nextMilestone.reward}"`}
                </p>
              </CardContent>
            </Card>
           ) : (
             <Card className="shadow-sm"><CardContent className="pt-6 text-center text-sm text-muted-foreground">You've achieved all current milestones!</CardContent></Card>
          )}

        </div>

         {/* Column 2: Savings & Earned Milestones */}
        <div className="space-y-6 lg:col-span-1">

            {/* Estimated Money Saved */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <DollarSign className="h-4 w-4" /> Estimated Money Saved
                    </CardDescription>
                    <CardTitle className="text-xl font-semibold text-green-700">{moneySaved}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">
                        Based on a placeholder estimate. (Feature to customize coming soon).
                    </p>
                </CardContent>
            </Card>

            {/* Earned Milestones/Badges */}
           <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-sm text-secondary-foreground font-medium">
                <Award className="h-4 w-4" /> Milestones Achieved
                </CardDescription>
                <CardTitle className="text-lg font-medium text-secondary-foreground">Your Rewards</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-[60px] w-full" /> :
                earnedMilestones.length > 0 ? (
                <ScrollArea className="h-[100px] pr-3"> {/* Limit height for scrolling */}
                    <div className="flex flex-wrap gap-2">
                    {earnedMilestones.map((m) => (
                        <Badge key={m.days} variant="secondary" className="flex items-center gap-1.5 px-3 py-1 shadow-sm border border-secondary-foreground/10">
                           {React.cloneElement(m.badgeIcon as React.ReactElement, { className: "h-4 w-4" })} {/* Ensure consistent icon size */}
                        <span className="text-xs font-medium">{m.reward}</span>
                        </Badge>
                    ))}
                    </div>
                </ScrollArea>

                ) : (
                <p className="text-xs text-muted-foreground">Your first milestone badge awaits at Day 1!</p>
                )}
            </CardContent>
            </Card>
        </div>

         {/* Column 3: Health Benefits */}
        <div className="space-y-6 lg:col-span-1">

            {/* Health Improvements (Can be dynamic based on days/substance) */}
            <Card className="bg-blue-50 border-blue-200 shadow-sm">
                <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <HeartPulse className="h-4 w-4" /> Potential Health Benefits
                </CardDescription>
                <CardTitle className="text-lg font-medium text-blue-700">Recovery Gains</CardTitle>
                </CardHeader>
                <CardContent>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-blue-900/90">
                    <li><span className="font-semibold">Est. Calories Avoided:</span> {caloriesSaved}</li>
                    {/* Add more benefits based on `days` */}
                    {days >= 1 && <li>Clearer thinking emerging.</li>}
                    {days >= 7 && <li>Sleep quality likely improving.</li>}
                    {days >= 30 && <li>Noticeable reduction in anxiety possible.</li>}
                    {days >= 90 && <li>Cardiovascular health improving.</li>}
                    {days >= 180 && <li>Liver function may be significantly better.</li>}
                    {days >= 365 && <li>Reduced long-term health risks.</li>}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground italic">Note: Benefits vary. Consult a healthcare professional.</p>
                </CardContent>
            </Card>

            {/* Placeholder for Substance Specific Tracking */}
             <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <Brain className="h-4 w-4"/> Substance Tracking
                    </CardDescription>
                    <CardTitle className="text-lg font-medium">Track Multiple Substances</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground text-center py-4">
                        Feature to track days sober for specific substances (e.g., Alcohol, Caffeine) coming soon!
                    </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
