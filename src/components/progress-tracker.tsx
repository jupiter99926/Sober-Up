
'use client';

import * as React from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, formatDistanceStrict } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CalendarDays, HeartPulse, Trophy, Users, BarChart } from 'lucide-react'; // Added Trophy, Users, BarChart
import { Badge } from '@/components/ui/badge'; // Import Badge for visual representation
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea
import { Separator } from '@/components/ui/separator'; // Import Separator

type ProgressTrackerProps = {
  sobrietyStartDate: Date;
};

// --- Data Fetching (Simulated) ---
// In a real app, fetch this data from your backend/database

type UserPoints = { id: string; name: string; points: number };
type SuccessStory = { id: string; title: string; snippet: string; daysSober?: number };

const fetchLeaderboard = async (): Promise<UserPoints[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));
  console.warn("fetchLeaderboard is returning mock data.");
  return [
    { id: 'user1', name: 'CourageousLion', points: 150 },
    { id: 'user2', name: 'HopefulSparrow', points: 135 },
    { id: 'user3', name: 'RisingPhoenix', points: 120 },
    { id: 'user4', name: 'SteadyStream', points: 95 },
    { id: 'user5', name: 'You', points: 88 }, // Simulate current user
  ].sort((a, b) => b.points - a.points);
};

const fetchSuccessStories = async (): Promise<SuccessStory[]> => {
  // Simulate API call
   await new Promise(resolve => setTimeout(resolve, 900));
   console.warn("fetchSuccessStories is returning mock data.");
   return [
     { id: 'story1', title: "One Day at a Time Led to Years", snippet: "It wasn't easy, but focusing on just getting through today made all the difference...", daysSober: 730 },
     { id: 'story2', title: "Finding Strength in Community", snippet: "Connecting with others who understood was a game-changer for my recovery journey...", daysSober: 180 },
     { id: 'story3', title: "Rediscovering Hobbies, Rediscovering Myself", snippet: "Picking up old passions helped fill the void and brought joy back into my life...", daysSober: 90 },
   ];
};

// --- Helper Functions ---

const calculateTimeSober = (startDate: Date) => {
  const now = new Date();
  const days = differenceInDays(now, startDate);
  const hours = differenceInHours(now, startDate) % 24;
  const minutes = differenceInMinutes(now, startDate) % 60;
  const totalMonths = differenceInMonths(now, startDate);
  const formattedDistance = formatDistanceStrict(startDate, now, { addSuffix: false }); // Remove "ago"

  return { days, hours, minutes, totalMonths, formattedDistance };
};

// Define milestones and corresponding badges/rewards
const milestones = [
  { days: 1, name: 'Day 1', badgeIcon: <Award className="h-4 w-4 text-green-500" />, reward: 'First Step Badge' },
  { days: 7, name: '1 Week', badgeIcon: <Award className="h-4 w-4 text-blue-500" />, reward: 'Week Milestone Badge' },
  { days: 30, name: '1 Month', badgeIcon: <Award className="h-4 w-4 text-purple-500" />, reward: 'Month Milestone Badge' },
  { days: 90, name: '3 Months', badgeIcon: <Trophy className="h-4 w-4 text-yellow-500" />, reward: 'Quarter Year Trophy' }, // Use Trophy for bigger milestones
  { days: 180, name: '6 Months', badgeIcon: <Trophy className="h-4 w-4 text-orange-500" />, reward: 'Half Year Trophy' },
  { days: 365, name: '1 Year', badgeIcon: <Trophy className="h-4 w-4 text-red-500" />, reward: 'One Year Anniversary Trophy' },
  // Add more milestones as needed
];

const getEarnedMilestones = (daysSober: number) => {
  return milestones.filter(m => daysSober >= m.days);
};

const getNextMilestone = (daysSober: number): { name: string, daysNeeded: number, progress: number } | null => {
    const upcoming = milestones.find(m => daysSober < m.days);
    if (!upcoming) return null; // All milestones achieved (or define yearly milestones)

    const daysNeeded = upcoming.days;
    const progress = Math.min(100, (daysSober / daysNeeded) * 100); // Cap progress at 100
    return { name: upcoming.name, daysNeeded: daysNeeded, progress };
};

// --- Component ---

export function ProgressTracker({ sobrietyStartDate }: ProgressTrackerProps) {
  const [timeSober, setTimeSober] = React.useState(calculateTimeSober(sobrietyStartDate));
  const [leaderboard, setLeaderboard] = React.useState<UserPoints[]>([]);
  const [stories, setStories] = React.useState<SuccessStory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [userPoints, setUserPoints] = React.useState(0); // Placeholder for user points

  // Fetch data and set up timer
  React.useEffect(() => {
     const fetchData = async () => {
        setLoading(true);
        try {
            const [board, fetchedStories] = await Promise.all([
                fetchLeaderboard(),
                fetchSuccessStories()
            ]);
            setLeaderboard(board);
            setStories(fetchedStories);
            // Simulate getting user points based on days sober (replace with real logic)
             const calculatedPoints = calculateTimeSober(sobrietyStartDate).days; // 1 point per day
             setUserPoints(calculatedPoints);

        } catch (error) {
            console.error("Failed to fetch progress data:", error);
            // Handle error state if needed
        } finally {
            setLoading(false);
        }
    };

    fetchData();


    const interval = setInterval(() => {
      setTimeSober(calculateTimeSober(sobrietyStartDate));
      // Increment points daily (example logic)
       const currentDays = calculateTimeSober(sobrietyStartDate).days;
       setUserPoints(currentDays); // Update points based on current days
    }, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, [sobrietyStartDate]);

  const { days, formattedDistance } = timeSober;
  const earnedMilestones = getEarnedMilestones(days);
  const nextMilestone = getNextMilestone(days);

  // --- Render ---

  return (
    <div className="space-y-6">
      {/* Sobriety Clock */}
      <Card className="bg-primary/10 border-primary">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2 text-sm text-primary font-medium">
            <CalendarDays className="h-4 w-4" /> Sobriety Clock
          </CardDescription>
          <CardTitle className="text-3xl font-bold text-primary">{formattedDistance}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Celebrating {days} days of progress. Keep going!
          </p>
        </CardContent>
      </Card>

      {/* Next Milestone Progress */}
      {nextMilestone && (
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-sm text-accent font-medium">
              <BarChart className="h-4 w-4" /> Next Milestone
            </CardDescription>
            <CardTitle className="text-xl font-semibold text-accent">
              {nextMilestone.name} ({nextMilestone.daysNeeded} Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={nextMilestone.progress} aria-label={`${Math.round(nextMilestone.progress)}% towards ${nextMilestone.name}`} className="h-3" />
            <p className="mt-1.5 text-xs text-muted-foreground">{`${days} / ${nextMilestone.daysNeeded} days completed`}</p>
          </CardContent>
        </Card>
      )}

      {/* Earned Milestones/Badges */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2 text-sm text-secondary-foreground font-medium">
            <Award className="h-4 w-4" /> Milestones Achieved
          </CardDescription>
          <CardTitle className="text-lg font-medium text-secondary-foreground">Your Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-xs text-muted-foreground">Loading badges...</p> :
           earnedMilestones.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {earnedMilestones.map((m) => (
                <Badge key={m.days} variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
                  {m.badgeIcon}
                  <span className="text-xs font-medium">{m.reward} ({m.name})</span>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Your first milestone badge awaits!</p>
          )}
        </CardContent>
      </Card>

       {/* Points & Leaderboard Placeholder */}
       <Card>
        <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Users className="h-4 w-4"/> Community Ranking
            </CardDescription>
             <CardTitle className="text-lg font-medium text-foreground">Leaderboard</CardTitle>
             <p className="text-xs text-muted-foreground pt-1">Your Points: <span className="font-semibold text-primary">{loading ? '...' : userPoints}</span> (1 point per day)</p>
        </CardHeader>
        <CardContent>
             {loading ? <p className="text-xs text-muted-foreground">Loading leaderboard...</p> :
              leaderboard.length > 0 ? (
                <ScrollArea className="h-[150px]"> {/* Limit height */}
                    <ul className="space-y-2 pr-3">
                    {leaderboard.map((user, index) => (
                        <li key={user.id} className={`flex justify-between items-center text-xs p-1.5 rounded ${user.name === 'You' ? 'bg-primary/10' : ''}`}>
                        <span className="flex items-center gap-2">
                            <span className="font-semibold w-5 text-center">{index + 1}.</span>
                            {user.name === 'You' ? <strong className="text-primary">{user.name}</strong> : user.name}
                        </span>
                        <span className="font-medium text-primary">{user.points} pts</span>
                        </li>
                    ))}
                    </ul>
                </ScrollArea>
             ) : <p className="text-xs text-muted-foreground">Leaderboard data not available.</p>}
        </CardContent>
       </Card>


      {/* Health Improvements (Static Example) */}
      <Card className="bg-secondary/10 border-secondary">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2 text-sm text-secondary-foreground font-medium">
            <HeartPulse className="h-4 w-4" /> Potential Health Benefits
          </CardDescription>
          <CardTitle className="text-lg font-medium text-secondary-foreground">Recovery Gains</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-muted-foreground">
            <li><span className="font-semibold text-secondary-foreground">Weeks:</span> Improved sleep, reduced anxiety.</li>
            <li><span className="font-semibold text-secondary-foreground">Months:</span> Better cardiovascular health, clearer skin.</li>
            <li><span className="font-semibold text-secondary-foreground">1 Year+:</span> Significantly reduced risk of related diseases, enhanced mental clarity.</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground italic">Note: Benefits vary. Consult a healthcare professional for personalized advice.</p>
        </CardContent>
      </Card>

        {/* Success Stories */}
      <Card>
          <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Trophy className="h-4 w-4"/> Inspiration
              </CardDescription>
              <CardTitle className="text-lg font-medium text-foreground">Shared Journeys</CardTitle>
          </CardHeader>
          <CardContent>
                {loading ? <p className="text-xs text-muted-foreground">Loading stories...</p> :
                 stories.length > 0 ? (
                <ScrollArea className="h-[150px]"> {/* Limit height */}
                    <div className="space-y-3 pr-3">
                        {stories.map((story) => (
                            <div key={story.id} className="text-xs border-b pb-2 last:border-b-0">
                                <p className="font-semibold text-primary mb-0.5">{story.title} {story.daysSober && <span className="text-muted-foreground font-normal">({story.daysSober} days)</span>}</p>
                                <p className="text-muted-foreground">{story.snippet}</p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                ) : <p className="text-xs text-muted-foreground">No success stories available right now.</p>}
          </CardContent>
      </Card>


    </div>
  );
}
