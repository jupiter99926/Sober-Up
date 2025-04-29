
'use client';

import * as React from 'react';
import { Users, Handshake, Trophy, MessageSquare, PlusCircle, SendHorizontal, Settings, Info, UsersRound, History, Search, Filter, Pencil, ThumbsUp, MessageCircle } from 'lucide-react'; // Added MessageCircle
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Placeholder data (replace with actual data fetching)
const members = [
  { id: 'kristoff', name: 'kristoff', pledged: true, avatarUrl: 'https://picsum.photos/seed/kristoff/40/40' },
  { id: 'cali33', name: 'cali33', pledged: true, avatarUrl: 'https://picsum.photos/seed/cali33/40/40' },
  { id: 'punks', name: 'punks', pledged: true, avatarUrl: 'https://picsum.photos/seed/punks/40/40' },
  { id: 'penem', name: 'penem', pledged: true, avatarUrl: 'https://picsum.photos/seed/penem/40/40' },
  { id: 'bunnyr', name: 'bunnyr', pledged: false, avatarUrl: 'https://picsum.photos/seed/bunnyr/40/40' },
  { id: 'anakki', name: 'anakki', pledged: false, avatarUrl: 'https://picsum.photos/seed/anakki/40/40' },
];

// Example structure for Feed Items (Posts, Milestones, Pledges)
type FeedItem = {
    id: string;
    type: 'post' | 'pledge' | 'milestone';
    author: { id: string; name: string; avatarUrl: string; };
    timestamp: string; // Use ISO string or Date object
    content?: string; // For posts
    pledgedMembers?: typeof members; // For pledges
    pledgeProgress?: number; // For pledges
    milestoneType?: string; // For milestones
    milestoneSubstance?: string; // For milestones
    comments: { id: string; authorName: string; text: string; }[];
    likes: number;
};

// Sample Feed Data (Replace with actual data)
const initialFeedItems: FeedItem[] = [
    {
        id: 'pledge1', type: 'pledge', author: {id: 'group', name: 'SoberTown', avatarUrl: ''}, // Group events might not have a single author
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        pledgedMembers: members,
        pledgeProgress: 30,
        comments: [{id: 'c1', authorName: 'kristoff', text: "C'mon everyone let's keep this streak going!"}],
        likes: 5,
    },
    {
        id: 'milestone1', type: 'milestone', author: { id: 'ant92', name: 'ant92', avatarUrl: 'https://picsum.photos/seed/ant92/30/30' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        milestoneType: 'Fiver', milestoneSubstance: 'Alcohol',
        comments: [], likes: 10,
    },
     {
        id: 'milestone2', type: 'milestone', author: { id: 'luisa100', name: 'luisa100', avatarUrl: 'https://picsum.photos/seed/luisa100/30/30' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        milestoneType: 'Fiver', milestoneSubstance: 'Alcohol',
        comments: [{id: 'c2', authorName: 'cali33', text: 'Congrats Luisa!'}], likes: 15,
    },
    {
        id: 'post1', type: 'post', author: { id: 'cali33', name: 'cali33', avatarUrl: 'https://picsum.photos/seed/cali33/40/40' },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        content: "Feeling strong today! Went for a walk instead of reaching for a drink when stressed. Small win!",
        comments: [], likes: 8,
    },
];

// Type for Group Chat Messages
type GroupChatMessage = {
  id: string;
  sender: { id: string; name: string; avatarUrl: string; };
  text: string;
  timestamp: string;
};

// Sample Group Chat Data
const initialGroupChatMessages: GroupChatMessage[] = [
  { id: 'gm1', sender: members[0], text: 'Hey everyone, just checking in. Hope you\'re all having a good day!', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 'gm2', sender: members[1], text: 'Doing okay Kristoff, thanks! Found the urge surfing technique helpful earlier.', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 'gm3', sender: members[3], text: 'Glad to hear that Cali! Keep it up.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
];

// Placeholder for current user info
const currentUser = { id: 'currentUser', name: 'You', avatarUrl: 'https://picsum.photos/seed/you/40/40' };

export default function CommunityPage() {
  const [isJoined, setIsJoined] = React.useState(false); // Track join status
  const [newPost, setNewPost] = React.useState('');
  const [feedItems, setFeedItems] = React.useState<FeedItem[]>(initialFeedItems);
  const [commentInputs, setCommentInputs] = React.useState<Record<string, string>>({}); // Store comment input per item { itemId: commentText }
  const [groupChatMessages, setGroupChatMessages] = React.useState<GroupChatMessage[]>(initialGroupChatMessages);
  const [newChatMessage, setNewChatMessage] = React.useState('');
  const chatScrollAreaRef = React.useRef<HTMLDivElement>(null); // Ref for chat scroll area
  const { toast } = useToast();

  // Scroll chat to bottom when new messages arrive
  React.useEffect(() => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTo({
        top: chatScrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [groupChatMessages]);


  const handleJoinToggle = () => {
    setIsJoined(!isJoined);
     toast({
        title: isJoined ? 'Left SoberTown' : 'Joined SoberTown!',
        description: isJoined ? 'You have left the group.' : 'Welcome to the community!',
     });
     // In a real app, this would trigger an API call
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const newFeedItem: FeedItem = {
        id: crypto.randomUUID(),
        type: 'post',
        author: currentUser,
        timestamp: new Date().toISOString(),
        content: newPost.trim(),
        comments: [],
        likes: 0,
    };

    setFeedItems([newFeedItem, ...feedItems]); // Add new post to the top
    setNewPost(''); // Clear input
    toast({ title: 'Post Created', description: 'Your post has been added to the feed.' });
     // In a real app, this would trigger an API call to save the post
  };

   const handleAddComment = (itemId: string) => {
    const commentText = commentInputs[itemId]?.trim();
    if (!commentText) return;

    const newComment = {
      id: crypto.randomUUID(),
      authorName: currentUser.name, // Use name directly
      text: commentText,
    };

    setFeedItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      )
    );

    // Clear the specific comment input
    setCommentInputs(prev => ({ ...prev, [itemId]: '' }));

     toast({ title: 'Comment Added', description: 'Your comment has been posted.' });
     // In a real app, this would trigger an API call to save the comment
  };

  const handleCommentInputChange = (itemId: string, value: string) => {
    setCommentInputs(prev => ({ ...prev, [itemId]: value }));
  };

    const handleLike = (itemId: string) => {
        setFeedItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                ? { ...item, likes: item.likes + 1 } // Increment likes
                : item
            )
        );
         // In a real app, this would trigger an API call to update likes
         // Could also track if the current user has already liked it
    };

    const handleSendChatMessage = () => {
        if (!newChatMessage.trim() || !isJoined) return;

        const messageToSend: GroupChatMessage = {
            id: crypto.randomUUID(),
            sender: currentUser,
            text: newChatMessage.trim(),
            timestamp: new Date().toISOString(),
        };

        setGroupChatMessages([...groupChatMessages, messageToSend]);
        setNewChatMessage('');
        // In a real app, this would trigger an API call/websocket event to send the message
         toast({ title: 'Message Sent', description: 'Your message has been sent to the group chat.' });
    };

  // Helper to format timestamp (e.g., "5 hours ago", "10m ago")
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // e.g., Oct 14
  };

    // Helper to format chat timestamp (e.g., "10:30 AM", "Yesterday 2:15 PM")
  const formatChatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) { // Today
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffDays === 1) { // Yesterday
      return `Yesterday ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else { // Older
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
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
      <Tabs defaultValue="groups" className="w-full mb-6 flex flex-col flex-1 overflow-hidden"> {/* Flex column */}
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
        <TabsContent value="communities" className="flex-1 overflow-y-auto"> {/* Flex-1 and overflow */}
            <Card className="transition-shadow hover:shadow-md"> {/* Added hover effect */}
                <CardHeader><CardTitle>Discover Communities</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Find and join communities focused on specific recovery paths or interests. (Coming Soon)</p></CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="following" className="flex-1 overflow-y-auto"> {/* Flex-1 and overflow */}
             <Card className="transition-shadow hover:shadow-md"> {/* Added hover effect */}
                <CardHeader><CardTitle>Following Feed</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">See the latest updates and posts from users you follow across different communities. (Coming Soon)</p></CardContent>
            </Card>
        </TabsContent>

        {/* Group Content (SoberTown Example) */}
        <TabsContent value="groups" className="flex-1 flex flex-col overflow-hidden"> {/* Flex-1 and overflow */}
          <Card className="shadow-lg h-full flex flex-col transition-shadow hover:shadow-xl"> {/* Added hover effect */}
            <CardHeader className="border-b">
               <div className="flex items-center justify-between">
                   <CardTitle className="text-xl font-semibold flex items-center gap-2">
                     <UsersRound className="h-5 w-5 text-primary" /> SoberTown
                   </CardTitle>
                   <Button variant={isJoined ? "outline" : "default"} size="sm" onClick={handleJoinToggle}>
                       {isJoined ? 'Leave Group' : 'Join Group'}
                    </Button>
               </div>

              {/* Inner Tabs for Group Sections */}
               {/* Increased grid columns for the new 'Chat' tab */}
               <Tabs defaultValue="latest" className="w-full mt-4 flex flex-col flex-1 overflow-hidden"> {/* Flex column */}
                 <TabsList className="grid w-full grid-cols-5 h-auto p-1 shrink-0"> {/* Changed to 5 columns */}
                   <TabsTrigger value="latest" className="text-xs"> <History className="w-3 h-3 mr-1 inline"/> Latest</TabsTrigger>
                    <TabsTrigger value="chat" className="text-xs"> <MessageCircle className="w-3 h-3 mr-1 inline"/> Chat</TabsTrigger> {/* New Chat Tab */}
                   <TabsTrigger value="members" className="text-xs"> <Users className="w-3 h-3 mr-1 inline"/> Members</TabsTrigger>
                   <TabsTrigger value="about" className="text-xs"> <Info className="w-3 h-3 mr-1 inline"/> About</TabsTrigger>
                   <TabsTrigger value="settings" className="text-xs"> <Settings className="w-3 h-3 mr-1 inline"/> Settings</TabsTrigger>
                 </TabsList>

                 {/* Content for Inner Tabs */}
                 <TabsContent value="latest" className="mt-4 flex-1 overflow-y-auto space-y-4 p-4"> {/* Adjust padding */}

                    {/* Create Post Section (Only if joined) */}
                    {isJoined && (
                        <Card className="mb-4 shadow transition-shadow hover:shadow-md"> {/* Added hover effect */}
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Pencil className="w-4 h-4"/> Share something with the group...
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <Textarea
                                    placeholder="What's on your mind? Share a success, a challenge, or words of encouragement."
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    className="mb-2 min-h-[60px] text-sm"
                                />
                                <div className="flex justify-end">
                                    <Button size="sm" onClick={handleCreatePost} disabled={!newPost.trim()}>
                                        Post
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {!isJoined && (
                         <Card className="mb-4 shadow bg-muted/50 text-center transition-shadow hover:shadow-md"> {/* Added hover effect */}
                             <CardContent className="p-4 text-sm text-muted-foreground">
                                 Join the group to post and comment.
                             </CardContent>
                         </Card>
                    )}

                    {/* Feed Items */}
                    {feedItems.map((item) => (
                        <Card key={item.id} className="bg-card shadow-sm transition-shadow hover:shadow-md"> {/* Added hover effect */}
                            <CardHeader className="flex flex-row items-start justify-between pb-2 space-x-4">
                               <div className="flex items-center gap-3">
                                   {/* Avatar */}
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={item.author.avatarUrl || `https://picsum.photos/seed/${item.author.id}/40/40`} alt={item.author.name} />
                                        <AvatarFallback>{item.author.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    {/* Author Name & Timestamp */}
                                    <div>
                                         <p className="text-sm font-semibold text-foreground">{item.author.name}</p>
                                         <p className="text-xs text-muted-foreground">{formatTimestamp(item.timestamp)}</p>
                                    </div>
                               </div>
                                {/* Optional: Actions like Edit/Delete/Report */}
                            </CardHeader>

                            <CardContent className="pb-3 space-y-3">
                                {/* Display content based on item type */}
                                {item.type === 'post' && item.content && (
                                    <p className="text-sm text-foreground whitespace-pre-wrap">{item.content}</p>
                                )}

                                {item.type === 'pledge' && item.pledgedMembers && (
                                    <div className="space-y-3 bg-muted/50 p-3 rounded-lg border"> {/* Increased rounding */}
                                        <p className="text-sm font-semibold flex items-center gap-2 text-indigo-600">
                                            <Handshake className="h-5 w-5" /> Daily Pledge
                                        </p>
                                        <div className="flex items-center space-x-[-10px]">
                                            {item.pledgedMembers.map((member) => (
                                                <Avatar key={member.id} className={`h-7 w-7 border-2 ${member.pledged ? 'border-green-500' : 'border-muted'}`}>
                                                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                                                    <AvatarFallback>{member.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                        <div className="text-xs font-medium text-indigo-700">
                                            {item.pledgeProgress}% pledged <span className="text-muted-foreground font-normal">• Approaching 10 day streak!</span>
                                        </div>
                                        <Progress value={item.pledgeProgress} className="h-1.5 bg-indigo-100 [&>div]:bg-indigo-500 rounded-full" aria-label={`${item.pledgeProgress}% pledged`} /> {/* Added rounded-full */}
                                    </div>
                                )}

                                {item.type === 'milestone' && item.milestoneType && (
                                   <div className="flex items-center gap-2 text-sm bg-emerald-50 p-3 rounded-lg border border-emerald-200"> {/* Increased rounding */}
                                        <Trophy className="h-5 w-5 text-emerald-600 shrink-0" />
                                        <div>
                                            <strong className="font-medium text-emerald-700">{item.author.name}</strong> achieved <Badge variant="secondary" className="mx-1 bg-emerald-100 text-emerald-800 border-emerald-300">{item.milestoneType}</Badge>
                                            <span className="text-muted-foreground text-xs">({item.milestoneSubstance})</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex flex-col items-start pt-2 border-t">
                                 {/* Like Button */}
                                 <div className="w-full flex justify-start mb-2">
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-auto p-1 flex items-center gap-1" onClick={() => handleLike(item.id)}>
                                        <ThumbsUp className="h-3.5 w-3.5" /> Like ({item.likes})
                                    </Button>
                                     {/* Add Comment Button/Toggle could go here */}
                                 </div>

                                {/* Existing Comments */}
                                {item.comments.length > 0 && (
                                    <div className="space-y-1.5 text-xs w-full mb-3 pl-2 border-l-2 border-border ml-1"> {/* Use theme border */}
                                        {item.comments.map(comment => (
                                            <p key={comment.id}><strong className="font-medium">{comment.authorName}:</strong> {comment.text}</p>
                                        ))}
                                    </div>
                                )}

                                {/* Add Comment Input (Only if joined) */}
                                {isJoined && (
                                    <div className="flex items-center gap-2 w-full pt-2">
                                        <Input
                                            placeholder="Write a comment..."
                                            value={commentInputs[item.id] || ''}
                                            onChange={(e) => handleCommentInputChange(item.id, e.target.value)}
                                            className="h-8 text-xs flex-grow"
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            className="h-8 w-8 rounded-full" // Made button round
                                            onClick={() => handleAddComment(item.id)}
                                            disabled={!commentInputs[item.id]?.trim()}
                                        >
                                            <SendHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Send Comment</span>
                                        </Button>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    ))}

                    {/* End of Feed Indicator (optional) */}
                     <p className="text-center text-xs text-muted-foreground py-4">End of feed.</p>

                 </TabsContent>

                  {/* Chat Tab Content */}
                 <TabsContent value="chat" className="mt-4 flex-1 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1 p-4" viewportRef={chatScrollAreaRef}> {/* Use viewportRef */}
                        <div className="space-y-4 pr-4">
                           {groupChatMessages.length === 0 && !isJoined && (
                                <div className="text-center text-sm text-muted-foreground p-6 bg-muted/50 rounded-lg">
                                    Join the group to participate in the chat.
                                </div>
                           )}
                           {groupChatMessages.length === 0 && isJoined && (
                                <div className="text-center text-sm text-muted-foreground p-6 bg-muted/50 rounded-lg">
                                    No messages yet. Start the conversation!
                                </div>
                           )}
                            {groupChatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                    'flex items-end gap-2',
                                    msg.sender.id === currentUser.id ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {/* Avatar for received messages */}
                                     {msg.sender.id !== currentUser.id && (
                                         <Avatar className="h-7 w-7">
                                            <AvatarImage src={msg.sender.avatarUrl || `https://picsum.photos/seed/${msg.sender.id}/30/30`} alt={msg.sender.name} />
                                            <AvatarFallback>{msg.sender.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                     )}
                                    {/* Message Bubble */}
                                    <div
                                        className={cn(
                                        'max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm',
                                        msg.sender.id === currentUser.id
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                        )}
                                    >
                                        {/* Sender Name (for received messages) */}
                                        {msg.sender.id !== currentUser.id && (
                                            <p className="text-xs font-semibold mb-0.5 text-foreground/80">{msg.sender.name}</p>
                                        )}
                                        {/* Message Text */}
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                         {/* Timestamp */}
                                         <p className={cn("text-xs mt-1", msg.sender.id === currentUser.id ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/80 text-left')}>
                                            {formatChatTimestamp(msg.timestamp)}
                                        </p>
                                    </div>
                                     {/* Avatar for sent messages */}
                                     {msg.sender.id === currentUser.id && (
                                        <Avatar className="h-7 w-7">
                                            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                                            <AvatarFallback>{currentUser.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                     {/* Chat Input Area (Only if joined) */}
                     {isJoined && (
                         <div className="border-t p-4 mt-auto"> {/* Ensures input is at the bottom */}
                             <div className="flex items-center gap-2 w-full">
                                <Input
                                    placeholder="Type your message..."
                                    value={newChatMessage}
                                    onChange={(e) => setNewChatMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                                    className="h-9 text-sm flex-grow"
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    className="h-9 w-9 rounded-full" // Made button round
                                    onClick={handleSendChatMessage}
                                    disabled={!newChatMessage.trim()}
                                >
                                    <SendHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Send Message</span>
                                </Button>
                            </div>
                         </div>
                     )}
                 </TabsContent>

                 <TabsContent value="members" className="flex-1 overflow-y-auto p-4">
                    {/* Member List */}
                    <CardTitle className="text-lg mb-4">Group Members ({members.length})</CardTitle>
                    <div className="space-y-3">
                        {members.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"> {/* Increased rounding */}
                                <div className="flex items-center gap-3">
                                     <Avatar className="h-9 w-9">
                                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                                        <AvatarFallback>{member.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{member.name}</span>
                                </div>
                                {/* Add Follow/Message button if needed */}
                                <Button variant="outline" size="sm" className="text-xs h-7">View Profile</Button>
                            </div>
                        ))}
                    </div>
                 </TabsContent>
                 <TabsContent value="about" className="flex-1 overflow-y-auto p-4">
                     <div className="text-sm text-muted-foreground space-y-2">
                        <h3 className="font-semibold text-foreground text-lg mb-2">About SoberTown</h3>
                        <p>This is a supportive space for individuals committed to sobriety. Share your journey, celebrate milestones, and encourage fellow members.</p>
                        <p><strong className="text-foreground">Group created:</strong> January 1, 2024</p>
                        <p><strong className="text-foreground">Rules:</strong> Be respectful, supportive, and maintain anonymity where appropriate. No medical advice.</p>
                     </div>
                 </TabsContent>
                  <TabsContent value="settings" className="flex-1 overflow-y-auto p-4">
                    <CardTitle className="text-lg mb-4">Group Settings</CardTitle>
                    <div className="text-center text-muted-foreground">Group settings and notification preferences will be available here soon!</div>
                 </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
