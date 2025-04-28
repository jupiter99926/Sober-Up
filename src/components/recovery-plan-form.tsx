'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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

const formSchema = z.object({
  drugType: z.string().min(1, 'Please select the primary substance.'),
  addictionLength: z.string().min(1, 'Please specify the duration of addiction.'),
  usageFrequency: z.string().min(1, 'Please describe your usage frequency.'),
  triggers: z.string().min(5, 'Please describe your triggers (min 5 characters).'),
  mentalHealthHistory: z.string().min(5, 'Please describe your mental health history (min 5 characters).'),
});

type RecoveryPlanFormProps = {
  onPlanGenerated: (plan: string) => void;
};

export function RecoveryPlanForm({ onPlanGenerated }: RecoveryPlanFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugType: '',
      addictionLength: '',
      usageFrequency: '',
      triggers: '',
      mentalHealthHistory: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const input: RecoveryPlanInput = values;
      const result = await generateRecoveryPlan(input);
      onPlanGenerated(result.recoveryPlan);
      toast({
        title: 'Recovery Plan Generated!',
        description: 'Your personalized plan is ready.',
      });
      // Optionally reset the form after successful submission
      // form.reset();
    } catch (error) {
      console.error('Error generating recovery plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: 'Could not generate the recovery plan. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormDescription>
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
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mentalHealthHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mental Health History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly describe any relevant mental health history (e.g., anxiety, depression)."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This helps tailor the plan more effectively.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Plan...
            </>
          ) : (
            'Generate My Recovery Plan'
          )}
        </Button>
      </form>
    </Form>
  );
}
