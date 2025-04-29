
'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Zap } from 'lucide-react'; // Placeholder icon

export function MeditationPlan() {
  const plan = [
    {
      month: 1,
      title: 'Month 1: Building the Foundation',
      weeks: [
        { week: 1, focus: 'Mindful Breathing Basics (5 min/day)', link: '#', description: 'Focus on the sensation of breath.' },
        { week: 2, focus: 'Body Scan Meditation (10 min/day)', link: '#', description: 'Bring awareness to different parts of the body.' },
        { week: 3, focus: 'Noticing Thoughts Without Judgment (10 min/day)', link: '#', description: 'Observe thoughts passing like clouds.' },
        { week: 4, focus: 'Mindful Walking (10 min/day)', link: '#', description: 'Pay attention to the sensation of walking.' },
      ],
    },
    {
      month: 2,
      title: 'Month 2: Deepening Practice',
      weeks: [
        { week: 5, focus: 'Sitting with Discomfort (15 min/day)', link: '#', description: 'Gently acknowledge difficult sensations.' },
        { week: 6, focus: 'Loving-Kindness Meditation (15 min/day)', link: '#', description: 'Cultivate compassion for self and others.' },
        { week: 7, focus: 'Mindfulness of Emotions (15 min/day)', link: '#', description: 'Recognize and name emotions without reaction.' },
        { week: 8, focus: 'Urge Surfing Technique (Practice as needed)', link: '#', description: 'Ride the wave of cravings with awareness.' },
      ],
    },
    {
      month: 3,
      title: 'Month 3: Integration & Maintenance',
      weeks: [
        { week: 9, focus: 'Mindful Listening (15 min/day)', link: '#', description: 'Focus fully on sounds around you.' },
        { week: 10, focus: 'Integrating Mindfulness into Daily Activities', link: '#', description: 'Practice awareness during routine tasks.' },
        { week: 11, focus: 'Open Awareness Meditation (20 min/day)', link: '#', description: 'Sit with whatever arises in your experience.' },
        { week: 12, focus: 'Planning for Continued Practice', link: '#', description: 'Reflect on progress and set intentions.' },
      ],
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {plan.map((monthData) => (
        <AccordionItem key={monthData.month} value={`month-${monthData.month}`}>
          <AccordionTrigger className="text-base font-semibold text-accent hover:text-accent/90">
            {monthData.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pl-2 border-l-2 border-accent/50 ml-2">
              {monthData.weeks.map((weekData) => (
                <div key={weekData.week} className="text-sm">
                  <p className="font-medium text-foreground">
                    Week {weekData.week}: {weekData.focus}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">{weekData.description}</p>
                  {/* Placeholder for actual guided meditation link/player */}
                  <a
                    href={weekData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    onClick={(e) => e.preventDefault()} // Prevent actual navigation for placeholder
                  >
                    <Zap className="h-3 w-3" /> Access Guided Practice (Coming Soon)
                  </a>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
