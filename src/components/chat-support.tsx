
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, SendHorizontal, MessageSquareHeart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { chatSupport, type ChatSupportInput } from '@/ai/flows/chat-support-flow';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

export function ChatSupport() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  });

  // Scroll to bottom when messages update
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    const userInput: ChatSupportInput = { message: values.message };
    const userMessage: Message = { id: crypto.randomUUID(), sender: 'user', text: values.message };

    setMessages((prev) => [...prev, userMessage]);
    form.reset(); // Reset form immediately
    setIsLoading(true);

    try {
      const result = await chatSupport(userInput);
      const aiMessage: Message = { id: crypto.randomUUID(), sender: 'ai', text: result.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling chat support flow:', error);
      toast({
        variant: 'destructive',
        title: 'Chat Error',
        description: 'Could not get a response from the assistant. Please try again.',
      });
       // Optionally remove the user message or add an error message in the chat
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="flex h-[600px] flex-col shadow-lg transition-shadow hover:shadow-xl"> {/* Added hover effect */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b"> {/* Added border-b */}
        <div className="space-y-1">
            <CardTitle className="text-lg font-medium">AI Chat Support</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
                Need immediate support? Talk to our AI assistant.
            </CardDescription>
        </div>
        <MessageSquareHeart className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {messages.length === 0 && (
                 <div className="flex justify-center items-center h-full">
                    <p className="text-sm text-muted-foreground text-center p-4 bg-muted rounded-lg">
                        Welcome! How can I support you right now? <br/> (e.g., "I'm having cravings", "Tell me about withdrawal")
                    </p>
                 </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex w-max max-w-[85%] flex-col gap-2 rounded-lg px-3 py-2 text-sm', // Use theme rounding
                  message.sender === 'user' ? 'ml-auto bg-primary text-primary-foreground shadow-md' : 'bg-muted shadow-sm' // Added shadows
                )}
              >
                {message.text.split('\n').map((line, i) => (
                    <span key={i}>{line}</span>
                ))}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-center space-x-2">
                    <div className="bg-muted rounded-lg p-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Assistant is typing...</p>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full items-center space-x-2"
          >
            <Input
              {...form.register('message')}
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading} className="rounded-full"> {/* Made button round */}
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
          {form.formState.errors.message && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.message.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
