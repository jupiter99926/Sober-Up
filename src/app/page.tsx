
'use client';

import * as React from 'react';
import Image from 'next/image'; // Import next/image
import { RecoveryPlanDialog } from '@/components/recovery-plan-dialog';
import { ProgressTracker } from '@/components/progress-tracker'; // Keep for potential future integration or summary view
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse, Target, TrendingUp, CheckSquare, ImagePlus, Smile, Heart, Brain, Goal, Flame, Trophy, BookOpen, Check } from 'lucide-react'; // Added icons
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress'; // Import Progress component
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// --- Types (Consider moving to src/types if complex) ---
type Motivation = {
    id: string;
    type: 'image' | 'text';
    content: string; // URL for image placeholder, text content otherwise
};

type Goal = {
    id: string;
    text: string;
    completed: boolean;
};

// Example type for Workbook items
type WorkbookItem = {
  id: string;
  title: string;
  description?: string; // Optional description
  icon: React.ReactNode; // Icon for the item
  completed: boolean;
};


// --- LocalStorage Keys ---
const RECOVERY_PLAN_KEY = 'recoveryPlan';
const SOBRIETY_START_DATE_KEY = 'sobrietyStartDate';
const MOTIVATIONS_KEY = 'motivations';
const GOALS_KEY = 'goals';
const DAILY_PLEDGE_DATE_KEY = 'dailyPledgeDate'; // Store the date of the last pledge
const PLEDGE_STREAK_KEY = 'pledgeStreak'; // Track consecutive pledge days
const WORKBOOK_ITEMS_KEY = 'workbookItems'; // Store workbook item state


// --- Sample Workbook Data (Replace with dynamic/fetched data later) ---
const initialWorkbookItems: WorkbookItem[] = [
  { id: 'wb1', title: 'A perfect day', icon: <Smile className="h-5 w-5 text-blue-500" />, completed: false }, // Changed icon for variety
  { id: 'wb2', title: 'Advice on habits', description: "If someone asked you what they...", icon: <BookOpen className="h-5 w-5 text-green-500" />, completed: false },
  { id: 'wb3', title: 'Practice Mindfulness', description: "Spend 5 minutes meditating.", icon: <Brain className="h-5 w-5 text-purple-500" />, completed: false },
];


export default function Home() {
  const [recoveryPlan, setRecoveryPlan] = React.useState<string | null>(null);
  const [sobrietyStartDate, setSobrietyStartDate] = React.useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [motivations, setMotivations] = React.useState<Motivation[]>([]);
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [pledgedToday, setPledgedToday] = React.useState(false);
  const [newGoalText, setNewGoalText] = React.useState('');
  const [newMotivationText, setNewMotivationText] = React.useState('');
  const [streakDays, setStreakDays] = React.useState(0);
  const [pledgeStreak, setPledgeStreak] = React.useState(0); // Add state for pledge streak
  const [workbookItems, setWorkbookItems] = React.useState<WorkbookItem[]>(initialWorkbookItems);
  const [isLoading, setIsLoading] = React.useState(true); // Added loading state
  const { toast } = useToast();

  // --- Load data from localStorage on mount ---
  React.useEffect(() => {
    setIsLoading(true); // Start loading
    try {
      const storedPlan = localStorage.getItem(RECOVERY_PLAN_KEY);
      if (storedPlan) setRecoveryPlan(storedPlan);

      const storedDate = localStorage.getItem(SOBRIETY_START_DATE_KEY);
      if (storedDate) {
        const startDate = new Date(storedDate);
        setSobrietyStartDate(startDate);
        // Calculate initial sobriety streak
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        setStreakDays(diffDays); // Simple streak based on start date for now
      }

      const storedMotivations = localStorage.getItem(MOTIVATIONS_KEY);
      if (storedMotivations) setMotivations(JSON.parse(storedMotivations));
      else {
          // Add default placeholder motivations if none exist
           setMotivations([
              { id: 'm1', type: 'image', content: 'https://picsum.photos/seed/family/150/150', "data-ai-hint": "family goal" },
              { id: 'm2', type: 'text', content: 'I want my family to respect me.' },
              { id: 'm3', type: 'text', content: 'No more hangovers! 💪' },
              { id: 'm4', type: 'image', content: 'https://picsum.photos/seed/health/150/150', "data-ai-hint": "health fitness" },
          ]);
      }

      const storedGoals = localStorage.getItem(GOALS_KEY);
      if (storedGoals) setGoals(JSON.parse(storedGoals));

      const storedPledgeDate = localStorage.getItem(DAILY_PLEDGE_DATE_KEY);
      if (storedPledgeDate) {
        const todayStr = new Date().toDateString();
        setPledgedToday(storedPledgeDate === todayStr);
      }

      // Load pledge streak
       const storedPledgeStreak = localStorage.getItem(PLEDGE_STREAK_KEY);
       setPledgeStreak(storedPledgeStreak ? parseInt(storedPledgeStreak, 10) : 0);

       // Load workbook items state
       const storedWorkbookItems = localStorage.getItem(WORKBOOK_ITEMS_KEY);
       if (storedWorkbookItems) {
           try {
              const parsedItems: WorkbookItem[] = JSON.parse(storedWorkbookItems);
              // Map over initial items to keep structure and update completion status
              setWorkbookItems(initialWorkbookItems.map(initialItem => {
                  const savedItem = parsedItems.find(saved => saved.id === initialItem.id);
                  return savedItem ? { ...initialItem, completed: savedItem.completed } : initialItem;
              }));
           } catch (e) {
               console.error("Failed to parse workbook items:", e);
               setWorkbookItems(initialWorkbookItems); // Fallback
           }

       } else {
          setWorkbookItems(initialWorkbookItems);
       }
    } catch (error) {
        console.error("Error loading data from localStorage:", error);
        // Optionally set default states or show an error message
    } finally {
        // Simulate a slight delay to show loading skeleton if needed
        // setTimeout(() => setIsLoading(false), 300);
        setIsLoading(false); // Finish loading
    }

  }, []);

  // --- Save functions for localStorage ---
  const saveRecoveryPlan = (plan: string) => {
    setRecoveryPlan(plan);
    localStorage.setItem(RECOVERY_PLAN_KEY, plan);
  };

  const saveSobrietyStartDate = (date: Date) => {
     setSobrietyStartDate(date);
     localStorage.setItem(SOBRIETY_START_DATE_KEY, date.toISOString());
      // Reset streak on new start date
     setStreakDays(0);
     setPledgedToday(false); // Reset pledge status too
     localStorage.removeItem(DAILY_PLEDGE_DATE_KEY);
     setPledgeStreak(0); // Reset pledge streak
     localStorage.removeItem(PLEDGE_STREAK_KEY);
  };

  const saveMotivations = (newMotivations: Motivation[]) => {
    setMotivations(newMotivations);
    localStorage.setItem(MOTIVATIONS_KEY, JSON.stringify(newMotivations));
  };

   const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem(GOALS_KEY, JSON.stringify(newGoals));
  };

    const saveWorkbookItems = (items: WorkbookItem[]) => {
        setWorkbookItems(items);
        // Only save essential data (id, completed status) to avoid storing icons/complex objects
        const dataToStore = items.map(({ id, completed }) => ({ id, completed }));
        localStorage.setItem(WORKBOOK_ITEMS_KEY, JSON.stringify(dataToStore));
    };

  const savePledge = () => {
     const today = new Date();
     const todayStr = today.toDateString();
     const yesterday = new Date(today);
     yesterday.setDate(today.getDate() - 1);
     const yesterdayStr = yesterday.toDateString();

     const lastPledgeDate = localStorage.getItem(DAILY_PLEDGE_DATE_KEY);
     let currentStreak = pledgeStreak;

     if (lastPledgeDate === yesterdayStr) {
         // Continued streak
         currentStreak += 1;
     } else if (lastPledgeDate !== todayStr) {
         // Reset streak if missed a day or starting new
         currentStreak = 1;
     } // If lastPledgeDate === todayStr, do nothing (already pledged today)

     setPledgedToday(true);
     localStorage.setItem(DAILY_PLEDGE_DATE_KEY, todayStr);
     setPledgeStreak(currentStreak);
     localStorage.setItem(PLEDGE_STREAK_KEY, currentStreak.toString());

      toast({ title: "Pledge Made!", description: `You've committed to staying sober today. Current streak: ${currentStreak} days!` });
  };

  // --- Handlers ---
  const handlePlanGenerated = (plan: string) => {
    saveRecoveryPlan(plan);
    if (!sobrietyStartDate) {
      const startDate = new Date();
      saveSobrietyStartDate(startDate);
    }
    setIsFormOpen(false); // Close the dialog
  };

  const handleAddMotivation = (type: 'text' | 'image') => {
    let content = '';
    if (type === 'text') {
        if (!newMotivationText.trim()) return;
        content = newMotivationText.trim();
    } else {
        // For now, just use a random placeholder image URL
        content = `https://picsum.photos/seed/${Math.random()}/150/150`;
        toast({ title: "Image Placeholder Added", description: "Image upload feature coming soon." });
    }

    const newMotivation: Motivation = {
      id: crypto.randomUUID(),
      type: type,
      content: content,
    };
    saveMotivations([...motivations, newMotivation]);
    setNewMotivationText(''); // Clear text input
  };

   const handleRemoveMotivation = (id: string) => {
      saveMotivations(motivations.filter(m => m.id !== id));
   };

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      text: newGoalText.trim(),
      completed: false,
    };
    saveGoals([...goals, newGoal]);
    setNewGoalText('');
  };

  const handleToggleGoal = (id: string) => {
    saveGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

   const handleRemoveGoal = (id: string) => {
       saveGoals(goals.filter(g => g.id !== id));
   };

   const handleToggleWorkbookItem = (id: string) => {
     saveWorkbookItems(
       workbookItems.map((item) =>
         item.id === id ? { ...item, completed: !item.completed } : item
       )
     );
  };


  // --- Render Logic ---
  const showGetStarted = !recoveryPlan || !sobrietyStartDate;
  const challengeProgress = Math.min((pledgeStreak / 7) * 100, 100); // Cap at 100%
  const daysLeftForChallenge = Math.max(0, 7 - pledgeStreak);

  // --- Loading Skeletons ---
  if (isLoading) {
     return (
        <main className="container mx-auto flex flex-col items-center p-6 md:p-12 space-y-8 animate-pulse">
           <header className="w-full text-center">
             <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
             <Skeleton className="h-6 w-1/2 mx-auto" />
           </header>
           {/* Skeleton for Get Started or Pledge/Habits */}
            <Skeleton className="w-full max-w-lg h-40 rounded-lg mx-auto" />

           {/* Skeleton for Grid */}
           <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-3 pt-8">
             {/* Column 1 Skeletons */}
             <div className="space-y-8 lg:col-span-1">
                <Skeleton className="w-full h-60 rounded-lg" /> {/* Motivation */}
                <Skeleton className="w-full h-48 rounded-lg" /> {/* Goals */}
                <Skeleton className="w-full h-24 rounded-lg" /> {/* Streak */}
             </div>
             {/* Column 2 & 3 Skeleton */}
              <div className="lg:col-span-2">
                <Skeleton className="w-full h-96 rounded-lg" /> {/* Recovery Plan */}
             </div>
           </div>
         </main>
     );
  }

  // --- Actual Content ---
  return (
    <main className="container mx-auto flex flex-col items-center p-6 md:p-12 space-y-8">
      <header className="w-full text-center">
        <h1 className="mb-2 text-4xl font-bold text-primary">
          {showGetStarted ? 'Start Your Recovery' : 'Build Better Habits'} {/* Title changes */}
        </h1>
        <p className="text-lg text-muted-foreground">
          {showGetStarted
           ? 'Generate your personalized recovery plan to begin.'
           : 'Your personalized path to overcoming addiction.'}
        </p>
      </header>

      {/* Get Started / Pledge & Habits Section */}
      {showGetStarted ? (
         <Card className="w-full max-w-lg text-center shadow-lg border-accent bg-accent/5 transition-shadow hover:shadow-xl"> {/* Added hover effect */}
            <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-accent">
                <Target className="h-5 w-5"/> Start Your Recovery Journey
            </CardTitle>
            <CardDescription className="text-muted-foreground">
                Answer a few questions to create your personalized plan.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => setIsFormOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Target className="mr-2 h-4 w-4" /> Create Your Recovery Plan
                </Button>
            </CardContent>
        </Card>
      ) : (
         <div className="w-full max-w-2xl space-y-8">
             {/* Today's Pledge Button */}
             <Card className="w-full text-center shadow-md overflow-hidden transition-shadow hover:shadow-lg"> {/* Added hover effect */}
                <CardContent className="p-6">
                    {pledgedToday ? (
                         <div className="space-y-2">
                            <p className="font-semibold text-primary">Pledge Made for Today!</p>
                            <p className="text-sm text-muted-foreground">Come back later to review your day.</p>
                            <Button variant="link" size="sm" className="text-accent">Review Today Now (Coming Soon)</Button>
                         </div>
                    ) : (
                        <Button onClick={savePledge} size="lg" className="w-full">
                            <CheckSquare className="mr-2 h-5 w-5" /> Make Today's Pledge
                        </Button>
                    )}
                </CardContent>
             </Card>

            {/* Challenge Section */}
            <Card className="w-full shadow-md transition-shadow hover:shadow-lg"> {/* Added hover effect */}
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Challenge</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Trophy className="h-10 w-10 text-orange-400 shrink-0"/>
                    <div className="flex-grow">
                        <p className="font-medium">Pledge for seven days</p>
                         <Progress value={challengeProgress} aria-label={`${pledgeStreak} out of 7 days pledged`} className="h-2 my-1.5 bg-green-100 [&>div]:bg-green-500 rounded-full" /> {/* Added rounded-full */}
                        <p className="text-xs text-muted-foreground">
                            {daysLeftForChallenge > 0
                                ? `You're ${daysLeftForChallenge} pledge${daysLeftForChallenge > 1 ? 's' : ''} away from unlocking the pack!`
                                : "Challenge Complete! 🎉 Keep going!"}
                        </p>
                    </div>
                </CardContent>
            </Card>

             {/* Workbook Section */}
            <Card className="w-full shadow-md transition-shadow hover:shadow-lg"> {/* Added hover effect */}
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Workbook</CardTitle>
                     <CardDescription className="text-sm text-muted-foreground">
                         Here are some things you can work on today. Try to complete {Math.min(3, workbookItems.filter(item => !item.completed).length)} of them.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                     {workbookItems.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Workbook activities loading or not available.</p>}
                    {workbookItems.map((item) => (
                        <Card key={item.id} className={`bg-card hover:bg-muted/50 transition-colors ${item.completed ? 'opacity-70' : ''}`}>
                            <CardContent className="p-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="shrink-0">{item.icon}</span>
                                    <div className="flex-grow">
                                        <p className={`font-medium text-sm ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                            {item.title}
                                        </p>
                                         {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                                    </div>
                                </div>
                                <Button
                                    variant={item.completed ? "outline" : "ghost"}
                                    size="icon"
                                    className={`h-8 w-8 shrink-0 rounded-full ${item.completed ? 'border-green-500 text-green-500' : ''}`} // Made button round
                                    onClick={() => handleToggleWorkbookItem(item.id)}
                                    aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                >
                                    <Check className="h-4 w-4"/>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
         </div>
      )}

      {/* Grid for Recovery Plan, Motivation, Goals, Streaks (Only show if plan exists) */}
      {!showGetStarted && (
       <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-3 pt-8">

         {/* Column 1: Motivation & Goals */}
         <div className="space-y-8 lg:col-span-1">
             {/* Motivation Section */}
            <Card className="shadow-lg transition-shadow hover:shadow-xl"> {/* Added hover effect */}
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-medium text-secondary-foreground">
                        <Heart className="h-5 w-5 text-secondary" /> Why I'm Doing This
                    </CardTitle>
                     <CardDescription>Your personal reasons for recovery.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        {motivations.map(m => (
                            <div key={m.id} className="relative group aspect-square">
                                {m.type === 'image' ? (
                                    <Image
                                        src={m.content}
                                        alt="Motivation"
                                        width={150} height={150} // Specify dimensions
                                        className="rounded-lg object-cover w-full h-full transition-transform group-hover:scale-105" // Added hover scale
                                        data-ai-hint={m["data-ai-hint"]} // Pass AI hint if exists
                                    />
                                ) : (
                                    <div className={`flex items-center justify-center p-3 rounded-lg h-full text-center text-sm font-medium transition-colors ${ m.content.toLowerCase().includes('hangover') ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}> {/* Added hover bg */}
                                        {m.content}
                                    </div>
                                )}
                                 {/* Remove Button Overlay */}
                                 <Button
                                     variant="destructive" size="icon"
                                     className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full" // Made button round
                                     onClick={() => handleRemoveMotivation(m.id)}
                                     aria-label="Remove motivation"
                                 >
                                     <span className="text-xs">X</span> {/* Simple X */}
                                 </Button>
                            </div>
                        ))}
                         {motivations.length < 4 && ( // Show add button if less than max motivations (e.g., 4)
                             <Button variant="outline" className="flex flex-col items-center justify-center aspect-square h-full text-muted-foreground hover:bg-accent/50 transition-colors">
                                <ImagePlus className="h-6 w-6 mb-1" />
                                <span className="text-xs">Add Photo</span>
                             </Button>
                         )}
                    </div>
                     {/* Add Motivation Inputs */}
                     <div className="space-y-2 pt-4 border-t">
                         <div className="flex gap-2">
                             <Input
                                 placeholder="Add text motivation..."
                                 value={newMotivationText}
                                 onChange={(e) => setNewMotivationText(e.target.value)}
                                 className="h-9 text-xs"
                             />
                             <Button size="sm" onClick={() => handleAddMotivation('text')} disabled={!newMotivationText.trim()}>Add Text</Button>
                         </div>
                         {/* Commenting out image button as it's integrated into the grid */}
                         {/* <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddMotivation('image')}>
                            <ImagePlus className="mr-2 h-4 w-4" /> Add Photo (Placeholder)
                         </Button> */}
                     </div>
                </CardContent>
            </Card>

             {/* Goals Section */}
            <Card className="shadow-lg transition-shadow hover:shadow-xl"> {/* Added hover effect */}
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-medium text-accent-foreground">
                        <Goal className="h-5 w-5 text-accent"/> My Goals
                    </CardTitle>
                    <CardDescription>Define and track your recovery goals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {goals.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No goals set yet. Add your first goal below!</p>
                    )}
                    {goals.map(goal => (
                        <div key={goal.id} className="flex items-center justify-between group p-2 rounded hover:bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className={`h-6 w-6 rounded-full ${goal.completed ? 'text-green-500' : 'text-muted-foreground'}`} onClick={() => handleToggleGoal(goal.id)}> {/* Made button round */}
                                    <CheckSquare className="h-4 w-4"/>
                                </Button>
                                <span className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {goal.text}
                                </span>
                            </div>
                             <Button
                                 variant="ghost" size="icon"
                                 className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity rounded-full" // Made button round
                                 onClick={() => handleRemoveGoal(goal.id)}
                                 aria-label="Remove goal"
                            >
                                <span className="text-xs">X</span> {/* Simple X */}
                            </Button>
                        </div>
                    ))}
                    <div className="flex gap-2 pt-4 border-t">
                        <Input
                            placeholder="Add a new goal..."
                            value={newGoalText}
                            onChange={(e) => setNewGoalText(e.target.value)}
                             className="h-9 text-xs"
                        />
                        <Button size="sm" onClick={handleAddGoal} disabled={!newGoalText.trim()}>Add Goal</Button>
                    </div>
                </CardContent>
            </Card>

             {/* Streaks (Simple Display) */}
             {sobrietyStartDate && (
                 <Card className="shadow-lg bg-yellow-50 border-yellow-200 transition-shadow hover:shadow-xl"> {/* Added hover effect */}
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-medium text-yellow-700">
                            <Flame className="h-5 w-5"/> Sobriety Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-3xl font-bold text-yellow-800 text-center">{streakDays} <span className="text-lg font-medium">Days</span></p>
                         <p className="text-xs text-muted-foreground text-center mt-1">Keep the flame alive!</p>
                    </CardContent>
                 </Card>
             )}
         </div>

        {/* Column 2 & 3: Recovery Plan */}
        {recoveryPlan && !showGetStarted && (
            <div className="lg:col-span-2">
                <Card className="shadow-lg bg-secondary/10 border-secondary sticky top-12 transition-shadow hover:shadow-xl"> {/* Added hover effect */}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium text-secondary-foreground">
                        Your AI Recovery Plan
                        </CardTitle>
                         <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)} className="text-xs h-7">Regenerate Plan</Button> {/* Add Regenerate button */}
                    </CardHeader>
                    <CardContent>
                         {/* Use prose-sm for smaller text in cards, adjust max-w */}
                         <div className="prose prose-sm max-w-none text-secondary-foreground/90 whitespace-pre-wrap max-h-[70vh] overflow-y-auto p-2"> {/* Adjusted prose styles and padding */}
                            {/* Improved Markdown Rendering */}
                            {recoveryPlan.split('\n').map((line, index, arr) => {
                                const trimmedLine = line.trim();
                                const isListItem = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ') || /^\d+\.\s/.test(trimmedLine);
                                const nextLineIsListItem = index + 1 < arr.length && (arr[index+1].trim().startsWith('* ') || arr[index+1].trim().startsWith('- ') || /^\d+\.\s/.test(arr[index+1].trim()));
                                const prevLineIsListItem = index > 0 && (arr[index-1].trim().startsWith('* ') || arr[index-1].trim().startsWith('- ') || /^\d+\.\s/.test(arr[index-1].trim()));

                                // Render list items directly
                                if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
                                     return <li key={index} className="ml-4 list-item list-disc">{trimmedLine.substring(2)}</li>;
                                } else if (/^\d+\.\s/.test(trimmedLine)) {
                                     return <li key={index} className="ml-4 list-item list-decimal">{trimmedLine.substring(trimmedLine.indexOf('.') + 1).trim()}</li>;
                                }

                                // Render headings
                                if (trimmedLine.startsWith('## ')) {
                                    return <h2 key={index} className="mt-6 mb-3">{trimmedLine.substring(3)}</h2>; // Add margins for headings
                                } else if (trimmedLine.startsWith('# ')) {
                                     return <h1 key={index} className="mt-8 mb-4">{trimmedLine.substring(2)}</h1>; // Add margins for headings
                                }

                                // Render paragraphs, handling spacing around lists
                                if (trimmedLine) {
                                     // Add margin-bottom if the next line is NOT a list item
                                     const mbClass = !isListItem && !nextLineIsListItem && trimmedLine ? 'mb-4' : '';
                                     // Add margin-top if the previous line was NOT a list item
                                     const mtClass = !isListItem && !prevLineIsListItem && trimmedLine ? 'mt-4' : '';
                                     return <p key={index} className={`${mtClass} ${mbClass}`}>{trimmedLine}</p>;
                                }

                                // Return null for empty lines to avoid extra space, unless it's separating blocks
                                return null;

                            }).filter(Boolean)} {/* Filter out nulls */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
         {/* Placeholder if no recovery plan yet in the second/third column space */}
         {!recoveryPlan && !showGetStarted && <div className="lg:col-span-2 hidden lg:block"></div>}

      </div>)}

      {/* Dialog for Recovery Plan Form */}
      <RecoveryPlanDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onPlanGenerated={handlePlanGenerated}
      />
    </main>
  );
}

    