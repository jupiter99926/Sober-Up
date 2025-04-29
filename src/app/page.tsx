
'use client';

import * as React from 'react';
import Image from 'next/image'; // Import next/image
import { RecoveryPlanDialog } from '@/components/recovery-plan-dialog';
import { ProgressTracker } from '@/components/progress-tracker'; // Keep for potential future integration or summary view
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse, Target, TrendingUp, CheckSquare, ImagePlus, Smile, Heart, Brain, Goal, Flame } from 'lucide-react'; // Added icons
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

// --- LocalStorage Keys ---
const RECOVERY_PLAN_KEY = 'recoveryPlan';
const SOBRIETY_START_DATE_KEY = 'sobrietyStartDate';
const MOTIVATIONS_KEY = 'motivations';
const GOALS_KEY = 'goals';
const DAILY_PLEDGE_DATE_KEY = 'dailyPledgeDate'; // Store the date of the last pledge

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
  const { toast } = useToast();

  // --- Load data from localStorage on mount ---
  React.useEffect(() => {
    const storedPlan = localStorage.getItem(RECOVERY_PLAN_KEY);
    if (storedPlan) setRecoveryPlan(storedPlan);

    const storedDate = localStorage.getItem(SOBRIETY_START_DATE_KEY);
    if (storedDate) {
      const startDate = new Date(storedDate);
      setSobrietyStartDate(startDate);
      // Calculate initial streak
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
            { id: 'm1', type: 'image', content: 'https://picsum.photos/seed/family/200/200' },
            { id: 'm2', type: 'text', content: 'I want my family to respect me.' },
            { id: 'm3', type: 'text', content: 'No more hangovers! 💪' },
            { id: 'm4', type: 'image', content: 'https://picsum.photos/seed/health/200/200' },
        ]);
    }


    const storedGoals = localStorage.getItem(GOALS_KEY);
    if (storedGoals) setGoals(JSON.parse(storedGoals));

    const storedPledgeDate = localStorage.getItem(DAILY_PLEDGE_DATE_KEY);
    if (storedPledgeDate) {
      const todayStr = new Date().toDateString();
      setPledgedToday(storedPledgeDate === todayStr);
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
  };

  const saveMotivations = (newMotivations: Motivation[]) => {
    setMotivations(newMotivations);
    localStorage.setItem(MOTIVATIONS_KEY, JSON.stringify(newMotivations));
  };

   const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem(GOALS_KEY, JSON.stringify(newGoals));
  };

  const savePledge = () => {
     const todayStr = new Date().toDateString();
     setPledgedToday(true);
     localStorage.setItem(DAILY_PLEDGE_DATE_KEY, todayStr);
     // Optionally, update streak logic here if needed
      toast({ title: "Pledge Made!", description: "You've committed to staying sober today. You can do this!" });
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
        content = `https://picsum.photos/seed/${Math.random()}/200/200`;
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


  // --- Render Logic ---
  const showGetStarted = !recoveryPlan || !sobrietyStartDate;

  return (
    <main className="container mx-auto flex flex-col items-center p-6 md:p-12 space-y-8">
      <header className="w-full text-center">
        <h1 className="mb-2 text-4xl font-bold text-primary">
          Reach Your Recovery Goals
        </h1>
        <p className="text-lg text-muted-foreground">
          Your personalized path to overcoming addiction.
        </p>
      </header>

      {/* Get Started / Pledge Section */}
      {showGetStarted ? (
         <Card className="w-full max-w-lg text-center shadow-lg border-accent bg-accent/5">
            <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-accent">
                <Target className="h-5 w-5"/> Start Your Recovery Journey
            </CardTitle>
            <CardDescription className="text-muted-foreground">
                Generate your personalized recovery plan to begin.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => setIsFormOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Target className="mr-2 h-4 w-4" /> Create Your Recovery Plan
                </Button>
            </CardContent>
        </Card>
      ) : (
         <Card className="w-full max-w-lg text-center shadow-md">
            <CardHeader>
                 <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground">Daily Pledge</CardDescription>
                <CardTitle className="text-xl font-semibold text-primary">
                    {pledgedToday ? "You've Pledged for Today!" : "Make Your Commitment"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {pledgedToday ? (
                     <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckSquare className="h-6 w-6"/>
                        <p className="font-medium">Today, I will stay sober.</p>
                     </div>
                ) : (
                    <Button onClick={savePledge} size="lg">
                        <CheckSquare className="mr-2 h-5 w-5" /> Today, I Will Stay Sober
                    </Button>
                )}
            </CardContent>
         </Card>
      )}

      {/* Grid for Recovery Plan, Motivation, Goals, Streaks */}
       <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-3">

         {/* Column 1: Motivation & Goals */}
         <div className="space-y-8 lg:col-span-1">
             {/* Motivation Section */}
            <Card className="shadow-lg">
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
                                        className="rounded-lg object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className={`flex items-center justify-center p-3 rounded-lg h-full text-center text-sm font-medium ${ m.content.toLowerCase().includes('hangover') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {m.content}
                                    </div>
                                )}
                                 {/* Remove Button Overlay */}
                                 <Button
                                     variant="destructive" size="icon"
                                     className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                     onClick={() => handleRemoveMotivation(m.id)}
                                     aria-label="Remove motivation"
                                 >
                                     <span className="text-xs">X</span> {/* Simple X */}
                                 </Button>
                            </div>
                        ))}
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
                         <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddMotivation('image')}>
                            <ImagePlus className="mr-2 h-4 w-4" /> Add Photo (Placeholder)
                         </Button>
                     </div>
                </CardContent>
            </Card>

             {/* Goals Section */}
            <Card className="shadow-lg">
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
                                <Button variant="ghost" size="icon" className={`h-6 w-6 ${goal.completed ? 'text-green-500' : 'text-muted-foreground'}`} onClick={() => handleToggleGoal(goal.id)}>
                                    <CheckSquare className="h-4 w-4"/>
                                </Button>
                                <span className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {goal.text}
                                </span>
                            </div>
                             <Button
                                 variant="ghost" size="icon"
                                 className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
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
                 <Card className="shadow-lg bg-yellow-50 border-yellow-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-medium text-yellow-700">
                            <Flame className="h-5 w-5"/> Current Streak
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
                <Card className="shadow-lg bg-secondary/10 border-secondary sticky top-12">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium text-secondary-foreground">
                        Your AI Recovery Plan
                        </CardTitle>
                        <Brain className="h-5 w-5 text-secondary" />
                    </CardHeader>
                    <CardContent>
                         <div className="prose prose-sm max-w-none text-secondary-foreground whitespace-pre-wrap max-h-[70vh] overflow-y-auto">
                            {/* Improved Markdown Rendering */}
                            {recoveryPlan.split('\n').map((line, index) => {
                                const trimmedLine = line.trim();
                                if (trimmedLine.startsWith('## ')) {
                                    return <h2 key={index}>{trimmedLine.substring(3)}</h2>;
                                } else if (trimmedLine.startsWith('# ')) {
                                     return <h1 key={index}>{trimmedLine.substring(2)}</h1>;
                                } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
                                    return <li key={index}>{trimmedLine.substring(2)}</li>;
                                } else if (/^\d+\.\s/.test(trimmedLine)) {
                                     // Handle numbered lists better if needed, this is basic
                                     return <li key={index} style={{ listStyleType: 'decimal', marginLeft: '1.5em' }}>{trimmedLine.substring(trimmedLine.indexOf('.') + 1).trim()}</li>;
                                } else if (trimmedLine === '') {
                                    // Preserve paragraphs by checking original line
                                    return index > 0 && recoveryPlan.split('\n')[index - 1].trim() !== '' ? <br key={index} /> : null;
                                } else {
                                    return <p key={index}>{trimmedLine}</p>;
                                }
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
         {/* Placeholder if no recovery plan yet in the second/third column space */}
         {!recoveryPlan && !showGetStarted && <div className="lg:col-span-2 hidden lg:block"></div>}

      </div>

      {/* Dialog for Recovery Plan Form */}
      <RecoveryPlanDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onPlanGenerated={handlePlanGenerated}
      />
    </main>
  );
}
