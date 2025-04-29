
'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CheckCircle } from 'lucide-react'; // Icon for key points

type WeekPlan = {
  week: number;
  title: string;
  goal: string;
  instructions: string[];
  tips?: string[];
};

const boxBreathingPlan: WeekPlan[] = [
  {
    week: 1,
    title: 'Week 1: Getting Started (2 Minutes)',
    goal: 'Learn the basic 4-4-4-4 pattern and practice consistency.',
    instructions: [
      'Find a quiet place where you can sit comfortably upright or lie down.',
      'Close your eyes gently or soften your gaze.',
      'Inhale slowly through your nose for a count of 4 seconds.',
      'Hold your breath gently for a count of 4 seconds (don’t strain).',
      'Exhale slowly and completely through your mouth or nose for a count of 4 seconds.',
      'Hold the breath out gently for a count of 4 seconds.',
      'This completes one cycle. Repeat for 2 minutes.',
      'Practice **twice** a day (e.g., morning and evening).',
    ],
    tips: [
      "Don't worry if the counts aren't perfect initially. Focus on the rhythm.",
      'Place one hand on your belly to feel it rise and fall with your breath.',
    ],
  },
  {
    week: 2,
    title: 'Week 2: Extending Practice (3 Minutes)',
    goal: 'Increase duration and focus on smooth transitions.',
    instructions: [
      'Continue the 4-4-4-4 pattern learned in Week 1.',
      'Increase the total practice time to **3 minutes** per session.',
      'Focus on making the transitions between inhale, hold, exhale, and hold smooth and relaxed.',
      'Maintain practicing **twice** a day.',
    ],
    tips: [
      'If holding for 4 seconds feels uncomfortable, slightly shorten the holds (e.g., 3 seconds) while keeping the inhale/exhale at 4.',
      'Notice any sensations of calm or relaxation during or after the practice.',
    ],
  },
  {
    week: 3,
    title: 'Week 3: Deepening Calm (4 Minutes)',
    goal: 'Further increase duration and integrate into moments of stress.',
    instructions: [
      'Continue the 4-4-4-4 pattern.',
      'Increase the total practice time to **4 minutes** per session.',
      'Continue practicing **twice** a day.',
      '**Additionally:** Try using 1-2 cycles of box breathing during moments you feel stressed or overwhelmed during the day.',
    ],
    tips: [
      'Visualize a box as you breathe: trace one side as you inhale, the next as you hold, the third as you exhale, and the fourth as you hold.',
      'Experiment with exhaling through the mouth vs. nose to see what feels more calming.',
    ],
  },
  {
    week: 4,
    title: 'Week 4: Consolidation & Mindfulness (5 Minutes)',
    goal: 'Solidify the practice, increase duration slightly, and add mindful awareness.',
    instructions: [
      'Continue the 4-4-4-4 pattern.',
      'Increase the total practice time to **5 minutes** per session.',
      'Continue practicing **twice** a day.',
      'During the holds, bring gentle awareness to the stillness.',
      'During the inhale/exhale, notice the physical sensations of breathing.',
      'Continue using the technique as needed throughout your day.',
    ],
    tips: [
      'Consider this 5-minute session a foundation. You can practice longer if desired.',
      'Reflect on how the practice has influenced your stress levels or ability to pause.',
    ],
  },
];

export function BoxBreathingPlan() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {boxBreathingPlan.map((weekData) => (
        <AccordionItem key={weekData.week} value={`week-${weekData.week}`}>
          <AccordionTrigger className="text-base font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            {weekData.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pl-2 border-l-2 border-blue-200 dark:border-blue-800 ml-2 text-sm">
              <p className="font-medium text-foreground/90">
                Goal: <span className="font-normal text-muted-foreground">{weekData.goal}</span>
              </p>
              <div>
                <p className="font-medium text-foreground/90 mb-1">Instructions:</p>
                <ul className="space-y-1.5 list-outside pl-5">
                  {weekData.instructions.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                       <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {weekData.tips && weekData.tips.length > 0 && (
                <div>
                  <p className="font-medium text-foreground/90 mb-1">Tips:</p>
                  <ul className="space-y-1.5 list-outside pl-5">
                    {weekData.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                         <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500/70 shrink-0" />
                        <span className="text-muted-foreground italic">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
