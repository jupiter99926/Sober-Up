
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter, // Import DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateRecoveryPlan, type RecoveryPlanInput } from '@/ai/flows/ai-recovery-plan-generator';

const drugTypes = ['Weed', 'Alcohol', 'Cocaine', 'Opioids', 'Methamphetamine', 'Other'];

// Updated form schema to make mentalHealthHistory optional
const formSchema = z.object({
  drugType: z.string().min(1, 'Please select the primary substance.'),
  addictionLength: z.string().min(1, 'Please specify the duration of addiction.'),
  usageFrequency: z.string().min(1, 'Please describe your usage frequency.'),
  triggers: z.string().min(5, 'Please describe your triggers (min 5 characters).'),
  mentalHealthHistory: z.string().optional(), // Make optional, remove min length validation or adjust as needed
});

type RecoveryPlanDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanGenerated: (plan: string) => void;
};

export function RecoveryPlanDialog({ isOpen, onOpenChange, onPlanGenerated }: RecoveryPlanDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugType: '',
      addictionLength: '',
      usageFrequency: '',
      triggers: '',
      mentalHealthHistory: '', // Keep default as empty string
    },
  });

   // Reset form when dialog closes or opens (optional, depends on desired UX)
   React.useEffect(() => {
    if (!isOpen) {
      // Optional: Reset form when dialog closes
      // form.reset();
    }
  }, [isOpen, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Ensure optional field is handled correctly if empty
      const input: RecoveryPlanInput = {
          ...values,
          mentalHealthHistory: values.mentalHealthHistory?.trim() || undefined, // Send undefined if empty/whitespace
      };
      const result = await generateRecoveryPlan(input);
      onPlanGenerated(result.recoveryPlan);
      toast({
        title: 'Recovery Plan Generated!',
        description: 'Your personalized plan is ready.',
      });
      // Form is reset via useEffect or manually closed by parent setting isOpen to false
    } catch (error) {
      console.error('Error generating recovery plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: error instanceof Error ? error.message : 'Could not generate the recovery plan. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
             <Target className="h-5 w-5 text-accent" /> Start Your Journey
          </DialogTitle>
          <DialogDescription>
             Answer a few questions to generate your personalized recovery plan.
             This information helps tailor the plan to your specific needs.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {/* Added overflow-y-auto and max-h for scrollable content */}
          <form onSubmit={form.handleSubmit(onSubmit)} id="recovery-plan-form" className="space-y-4 overflow-y-auto max-h-[60vh] p-1 pr-4">
            <FormField
              control={form.control}
              name="drugType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Substance</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the substance you use" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {drugTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Choose the main substance you are seeking recovery from.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addictionLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration of Addiction</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 6 months, 5 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usageFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Frequency</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Daily, 3 times a week" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triggers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Triggers</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe situations, feelings, or people that trigger your urge to use."
                      className="resize-none"
                      rows={3} // Adjust rows as needed
                      {...field}
                    />
                  </FormControl>
                   <FormDescription className="text-xs">
                    Understanding triggers is key to managing them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mentalHealthHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mental Health History (Optional)</FormLabel> {/* Update label */}
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe any relevant mental health history (e.g., anxiety, depression). Leave blank if not applicable."
                      className="resize-none"
                      rows={3} // Adjust rows as needed
                      {...field}
                      // Ensure value is handled correctly (might need value={field.value || ''})
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Sharing this helps tailor the plan but is optional.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button moved to DialogFooter */}
          </form>
        </Form>
         <DialogFooter>
            <Button type="submit" form="recovery-plan-form" disabled={isLoading}> {/* Remove onClick here, it's handled by form submission */}
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plan...
                    </>
                ) : (
                    'Generate My Recovery Plan'
                )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// Assign an ID to the form element if you want to trigger submit from outside the form (e.g., from DialogFooter)
// Note: The form ID is assigned implicitly above in DialogFooter's Button `form` prop.
