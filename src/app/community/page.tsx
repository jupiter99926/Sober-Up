
'use client';

import * as React from 'react';
import { Users, Handshake, Trophy, MessageSquare, PlusCircle, SendHorizontal, Settings, Info, UsersRound, History, Search, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Placeholder data (replace with actual data fetching)
const members = [
  { id: 'kristoff', name: 'kristoff', pledged: true, avatarUrl: 'https://picsum.photos/seed/kristoff/40/40' },
  { id: 'cali33', name: 'cali33', pledged: true, avatarUrl: 'https://picsum.photos/seed/cali33/40/40' },
  { id: 'punks', name: 'punks...', pledged: true, avatarUrl: 'https://picsum.photos/seed/punks/40/40' },
  { id: 'penem', name: 'penem...', pledged: true, avatarUrl: 'https://picsum.photos/seed/penem/40/40' },
  { id: 'bunnyr', name: 'bunnyr...', pledged: false, avatarUrl: 'https://picsum.photos/seed/bunnyr/40/40' },
  { id: 'anakki', name: 'anakki...', pledged: false, avatarUrl: 'https://picsum.photos/seed/anakki/40/40' },
];

const milestones = [
  { id: 'm1', userId: 'ant92', userName: 'ant92', type: 'Fiver', substance: 'Alcohol', date: 'Oct 14', avatarUrl: 'https://picsum.photos/seed/ant92/30/30' },
   { id: 'm2', userId: 'luisa100', userName: 'luisa100', type: 'Fiver', substance: 'Alcohol', date: 'Oct 14', avatarUrl: 'https://picsum.photos/seed/luisa100/30/30' },
  // Add more milestones
];

const pledgeProgress = 30; // Example progress

export default function CommunityPage() {
  const [comment, setComment] = React.useState('');

  const handleAddComment = () => {
    console.log('Adding comment:', comment);
    // Add comment logic here
    setComment('');
  };

  return (
    <main className="container mx-auto flex flex-col p-6 md:p-12 h-[calc(100vh-theme(spacing.14))]">
      <header className="mb-8 text-center md:text-left">
        <h1 className="mb-1 text-3xl font-bold text-primary flex items-center gap-2">
          <Users className="h-7 w-7" /> Get Community Support
        </h1>
        <p className="text-md text-muted-foreground">
          Connect with others, share progress, and find encouragement.
        </p>
      </header>

      {/* Top Level Tabs */}
      <Tabs defaultValue="groups" className="w-full mb-6">
        <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-background border p-1 h-auto">
                <TabsTrigger value="communities" className="text-xs sm:text-sm">Communities</TabsTrigger>
                <TabsTrigger value="following" className="text-xs sm:text-sm">Following</TabsTrigger>
                <TabsTrigger value="groups" className="text-xs sm:text-sm">Groups</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
                 <span className="sr-only">Filter</span>
            </Button>
        </div>

        {/* Placeholder Content for Tabs */}
        <TabsContent value="communities">
            <Card>
                <CardHeader><CardTitle>Communities</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Community discovery feature coming soon!</p></CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="following">
             <Card>
                <CardHeader><CardTitle>Following</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Activity feed from users you follow coming soon!</p></CardContent>
            </Card>
        </TabsContent>

        {/* Group Content (SoberTown Example) */}
        <TabsContent value="groups" className="flex-1 overflow-hidden">
          <Card className="shadow-lg h-full flex flex-col">
            <CardHeader className="border-b">
               <div className="flex items-center justify-between">
                   <CardTitle className="text-xl font-semibold flex items-center gap-2">
                     <UsersRound className="h-5 w-5 text-primary" /> SoberTown
                   </CardTitle>
                   {/* Add Group actions like Join/Leave/Settings if needed */}
                    <Button variant="outline" size="sm">Join Group</Button>
               </div>

              {/* Inner Tabs for Group Sections */}
              <Tabs defaultValue="latest" className="w-full mt-4">
                 <TabsList className="grid w-full grid-cols-4 h-auto p-1">
                   <TabsTrigger value="latest" className="text-xs"> <History className="w-3 h-3 mr-1 inline"/> Latest</TabsTrigger>
                   <TabsTrigger value="members" className="text-xs"> <Users className="w-3 h-3 mr-1 inline"/> Members</TabsTrigger>
                   <TabsTrigger value="about" className="text-xs"> <Info className="w-3 h-3 mr-1 inline"/> About</TabsTrigger>
                   <TabsTrigger value="settings" className="text-xs"> <Settings className="w-3 h-3 mr-1 inline"/> Settings</TabsTrigger>
                 </TabsList>

                 {/* Content for Inner Tabs */}
                 <TabsContent value="latest" className="mt-4 flex-1 overflow-y-auto space-y-4 p-1 max-h-[calc(100vh-theme(spacing.64))]"> {/* Adjust max-h */}

                    {/* Pledge Card */}
                    <Card className="bg-muted/50">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2 text-indigo-600">
                          <Handshake className="h-5 w-5" /> Pledges
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">Oct 14</span>
                      </CardHeader>
                      <CardContent className="space-y-3">
                         {/* Avatar Stack */}
                         <div className="flex items-center space-x-[-10px] mb-3">
                            {members.map((member) => (
                                <Avatar key={member.id} className={`h-8 w-8 border-2 ${member.pledged ? 'border-green-500' : 'border-muted'}`}>
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                <AvatarFallback>{member.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            ))}
                         </div>

                        {/* Progress Bar */}
                        <div className="text-sm font-medium text-indigo-700">
                            {pledgeProgress}% pledged <span className="text-muted-foreground font-normal">• Approaching 10 day streak!</span>
                        </div>
                         <Progress value={pledgeProgress} className="h-2 bg-indigo-100 [&>div]:bg-indigo-500" aria-label={`${pledgeProgress}% pledged`} />

                         {/* Comment Section */}
                         <div className="space-y-2 pt-2">
                            <Button variant="link" size="sm" className="text-xs text-muted-foreground p-0 h-auto">Add a comment</Button>
                            <div className="text-xs space-y-1">
                                <p><strong className="font-medium">kristoff:</strong> C'mon everyone let's keep this streak going!</p>
                                {/* Add more comments here */}
                            </div>
                             <div className="flex items-center gap-2 pt-1">
                                <Input
                                    placeholder="Write a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="h-8 text-xs flex-grow"
                                />
                                <Button type="button" size="icon" className="h-8 w-8" onClick={handleAddComment} disabled={!comment.trim()}>
                                    <SendHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                         </div>
                      </CardContent>
                    </Card>

                     <Separator />

                    {/* Milestone Card */}
                    <Card className="bg-muted/50">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2 text-emerald-600">
                          <Trophy className="h-5 w-5" /> Milestones
                        </CardTitle>
                         <span className="text-xs text-muted-foreground">Oct 14</span>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {milestones.map((milestone) => (
                            <div key={milestone.id} className="flex items-center gap-2 text-xs">
                                 <Avatar className="h-6 w-6">
                                    <AvatarImage src={milestone.avatarUrl} alt={milestone.userName}/>
                                    <AvatarFallback>{milestone.userName.substring(0,1).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <strong className="font-medium">{milestone.userName}</strong> achieved <Badge variant="secondary" className="mx-1">{milestone.type}</Badge>
                                    <span className="text-muted-foreground">({milestone.substance})</span>
                                </div>
                            </div>
                        ))}
                        {/* Add "Load More" button if needed */}
                      </CardContent>
                    </Card>

                    {/* Add more feed items here */}

                 </TabsContent>

                 <TabsContent value="members">
                    <div className="p-4 text-center text-muted-foreground">Members list coming soon!</div>
                 </TabsContent>
                 <TabsContent value="about">
                     <div className="p-4 text-sm text-muted-foreground space-y-2">
                        <h3 className="font-semibold text-foreground">About SoberTown</h3>
                        <p>This is a supportive space for individuals committed to sobriety. Share your journey, celebrate milestones, and encourage fellow members.</p>
                        <p>Group created: January 1, 2024</p>
                        <p>Rules: Be respectful, supportive, and maintain anonymity where appropriate.</p>
                     </div>
                 </TabsContent>
                  <TabsContent value="settings">
                    <div className="p-4 text-center text-muted-foreground">Group settings coming soon!</div>
                 </TabsContent>
              </Tabs>
            </CardHeader>
            {/* CardContent might not be needed if inner tabs handle content area */}
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
      
