
'use client';

import * as React from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, formatDistanceStrict } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CalendarDays, HeartPulse, Trophy, Users, BarChart, Calendar } from 'lucide-react'; // Added Trophy, Users, BarChart, Calendar
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading states

type ProgressTrackerProps = {
  sobrietyStartDate: Date;
};

// --- Data Fetching (Simulated) ---
// In a real app, fetch this data from your backend/database

type UserPoints = { id: string; name: string; points: number };
type SuccessStory = { id: string; title: string; snippet: string; daysSober?: number };

const fetchLeaderboard = async (currentUserPoints: number): Promise<UserPoints[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));
  console.warn("fetchLeaderboard is returning mock data.");
  // Ensure 'You' is always in the list and updated
  const mockBoard: UserPoints[] = [
    { id: 'user1', name: 'CourageousLion', points: 150 },
    { id: 'user2', name: 'HopefulSparrow', points: 135 },
    { id: 'user3', name: 'RisingPhoenix', points: 120 },
    { id: 'user4', name: 'SteadyStream', points: 95 },
    { id: 'user5', name: 'You', points: currentUserPoints }, // Use calculated points
  ];
  // Filter out potential duplicate 'You' if accidentally added above, then add the updated one
  const filteredBoard = mockBoard.filter(u => u.id !== 'user5');
  filteredBoard.push({ id: 'user5', name: 'You', points: currentUserPoints });

  return filteredBoard.sort((a, b) => b.points - a.points);
};

const fetchSuccessStories = async (): Promise<SuccessStory[]> => {
  // Simulate API call
   await new Promise(resolve => setTimeout(resolve, 900));
   console.warn("fetchSuccessStories is returning mock data.");
   return [
     { id: 'story1', title: "One Day at a Time Led to Years", snippet: "It wasn't easy, but focusing on just getting through today made all the difference...", daysSober: 730 },
     { id: 'story2', title: "Finding Strength in Community", snippet: "Connecting with others who understood was a game-changer for my recovery journey...", daysSober: 180 },
     { id: 'story3', title: "Rediscovering Hobbies, Rediscovering Myself", snippet: "Picking up old passions helped fill the void and brought joy back into my life...", daysSober: 90 },
     { id: 'story4', title: "A Healthier Future", snippet: "My physical health improved drastically after the first few months. It motivated me to keep going.", daysSober: 120 },
     { id: 'story5', title: "Small Steps, Big Changes", snippet: "Didn't think I could make it a week, now celebrating milestones I never imagined.", daysSober: 60 },
   ];
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
    const estimatedDailySpending = 10; // Example: $10 per day
    return (daysSober * estimatedDailySpending).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};


// --- Component ---

export function ProgressTracker({ sobrietyStartDate }: ProgressTrackerProps) {
  const [timeSober, setTimeSober] = React.useState(calculateTimeSober(sobrietyStartDate));
  const [leaderboard, setLeaderboard] = React.useState<UserPoints[]>([]);
  const [stories, setStories] = React.useState<SuccessStory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [userPoints, setUserPoints] = React.useState(0);

  // Fetch data and set up timer
  React.useEffect(() => {
     const fetchData = async () => {
        setLoading(true);
        const currentDays = calculateTimeSober(sobrietyStartDate).days;
        const calculatedPoints = currentDays; // 1 point per day sober
        setUserPoints(calculatedPoints);

        try {
            // Pass current points to fetchLeaderboard
            const [board, fetchedStories] = await Promise.all([
                fetchLeaderboard(calculatedPoints),
                fetchSuccessStories()
            ]);
            setLeaderboard(board);
            setStories(fetchedStories);
        } catch (error) {
            console.error("Failed to fetch progress data:", error);
            // Set empty arrays or show error message in UI
             setLeaderboard([]);
             setStories([]);
        } finally {
            setLoading(false);
        }
    };

    fetchData();


    const interval = setInterval(() => {
      const newTimeSober = calculateTimeSober(sobrietyStartDate);
      setTimeSober(newTimeSober);
      // Increment points daily (check if day changed)
      const currentDays = newTimeSober.days;
      if(currentDays !== userPoints) { // Update only if the day number changes
          setUserPoints(currentDays);
          // Refetch leaderboard if points changed significantly or periodically
          // For simplicity, we don't refetch leaderboard on every point change here
           fetchLeaderboard(currentDays).then(setLeaderboard); // Update leaderboard with new points
      }

    }, 1000 * 60); // Update clock every minute

    return () => clearInterval(interval);
  }, [sobrietyStartDate]); // Rerun effect if start date changes

  const { days, formattedDistance } = timeSober;
  const earnedMilestones = getEarnedMilestones(days);
  const nextMilestone = getNextMilestone(days);
  const moneySaved = estimateMoneySaved(days);

  // --- Render ---

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Column 1: Core Stats & Milestones */}
        <div className="space-y-6 lg:col-span-1">
          {/* Sobriety Clock */}
          <Card className="bg-primary/10 border-primary shadow-md">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm text-primary font-medium">
                <CalendarDays className="h-4 w-4" /> Sobriety Clock
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
                   {nextMilestone.badgeIcon} {nextMilestone.name} ({nextMilestone.daysNeeded} Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={nextMilestone.progress} aria-label={`${Math.round(nextMilestone.progress)}% towards ${nextMilestone.name}`} className="h-3 mb-1.5" />
                <p className="text-xs text-muted-foreground">
                  {`${days} / ${nextMilestone.daysNeeded} days toward "${nextMilestone.reward}"`}
                </p>
              </CardContent>
            </Card>
           ) : (
             <Card className="shadow-sm"><CardContent className="pt-6 text-center text-sm text-muted-foreground">You've achieved all current milestones!</CardContent></Card>
          )}

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
                        <Badge key={m.days} variant="secondary" className="flex items-center gap-1.5 px-3 py-1 shadow-sm">
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

         {/* Column 2: Leaderboard & Savings */}
        <div className="space-y-6 lg:col-span-1">
           {/* Points & Leaderboard */}
           <Card className="shadow-md">
            <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <Users className="h-4 w-4"/> Community Rank
                </CardDescription>
                <CardTitle className="text-lg font-medium text-foreground">Daily Points Leaderboard</CardTitle>
                {/* Changed p to div to fix hydration error */}
                <div className="text-xs text-muted-foreground pt-1">
                    Your Points: <span className="font-semibold text-primary">
                    {loading ? <Skeleton className="inline-block h-3 w-8" /> : userPoints}
                    </span> (1 point per sober day)
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                   <div className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                   </div>
                ) :
                leaderboard.length > 0 ? (
                    <ScrollArea className="h-[150px]"> {/* Limit height */}
                        <ul className="space-y-2 pr-3">
                        {leaderboard.map((user, index) => (
                            <li key={user.id} className={`flex justify-between items-center text-xs p-1.5 rounded ${user.name === 'You' ? 'bg-primary/10 border border-primary/20' : ''}`}>
                            <span className="flex items-center gap-2">
                                <span className="font-semibold w-5 text-center text-muted-foreground">{index + 1}.</span>
                                {user.name === 'You' ? <strong className="text-primary font-semibold">{user.name}</strong> : <span className="text-foreground">{user.name}</span>}
                            </span>
                            <Badge variant={user.name === 'You' ? "default" : "outline"} className="text-xs px-2 py-0.5">{user.points} pts</Badge>
                            </li>
                        ))}
                        </ul>
                    </ScrollArea>
                ) : <p className="text-xs text-muted-foreground">Leaderboard data not available.</p>}
            </CardContent>
           </Card>

            {/* Estimated Money Saved */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <Calendar className="h-4 w-4" /> Estimated Savings
                    </CardDescription>
                    <CardTitle className="text-xl font-semibold text-green-700">{moneySaved}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">
                        Based on an estimate of $10 saved per day. You can adjust this in settings (feature coming soon!).
                    </p>
                </CardContent>
            </Card>

            {/* Health Improvements (Static Example) */}
            <Card className="bg-secondary/10 border-secondary shadow-sm">
                <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-sm text-secondary-foreground font-medium">
                    <HeartPulse className="h-4 w-4" /> Potential Health Benefits
                </CardDescription>
                <CardTitle className="text-lg font-medium text-secondary-foreground">Recovery Gains</CardTitle>
                </CardHeader>
                <CardContent>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-secondary-foreground/90">
                    <li><span className="font-semibold">Days:</span> Reduced immediate risks, clearer thinking.</li>
                    <li><span className="font-semibold">Weeks:</span> Improved sleep, lower anxiety levels.</li>
                    <li><span className="font-semibold">Months:</span> Better cardiovascular health, restored organ function.</li>
                    <li><span className="font-semibold">Year+:</span> Significantly reduced long-term health risks, enhanced mental clarity.</li>
                </ul>
                <p className="mt-3 text-xs text-muted-foreground italic">Note: Benefits vary per individual. Consult a healthcare professional.</p>
                </CardContent>
            </Card>
        </div>

         {/* Column 3: Success Stories */}
        <div className="space-y-6 lg:col-span-1">
            {/* Success Stories */}
            <Card className="shadow-md">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <Trophy className="h-4 w-4"/> Inspiration from the Community
                    </CardDescription>
                    <CardTitle className="text-lg font-medium text-foreground">Shared Journeys</CardTitle>
                </CardHeader>
                <CardContent>
                      {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                      ) :
                      stories.length > 0 ? (
                      <ScrollArea className="h-[300px]"> {/* Adjust height as needed */}
                          <div className="space-y-4 pr-3">
                              {stories.map((story) => (
                                  <div key={story.id} className="text-xs border-b border-border/50 pb-3 last:border-b-0">
                                      <p className="font-semibold text-primary mb-0.5">{story.title} {story.daysSober && <span className="text-muted-foreground font-normal text-xs">({story.daysSober} days)</span>}</p>
                                      <p className="text-muted-foreground leading-relaxed">{story.snippet}</p>
                                  </div>
                              ))}
                          </div>
                      </ScrollArea>
                      ) : <p className="text-xs text-muted-foreground">No success stories available right now.</p>}
                </CardContent>
            </Card>
        </div>


    </div>
  );
}
