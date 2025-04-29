
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
        { week: 1, focus: 'Mindful Breathing Basics (5 min/day)', link: '#', description: 'Focus on the sensation of breath entering and leaving your body.' },
        { week: 2, focus: 'Body Scan Meditation (10 min/day)', link: '#', description: 'Bring gentle, non-judgmental awareness to different parts of the body.' },
        { week: 3, focus: 'Noticing Thoughts Without Judgment (10 min/day)', link: '#', description: 'Observe thoughts as passing mental events, like clouds in the sky.' },
        { week: 4, focus: 'Mindful Walking (10 min/day)', link: '#', description: 'Pay attention to the physical sensations of walking.' },
      ],
    },
    {
      month: 2,
      title: 'Month 2: Deepening Practice',
      weeks: [
        { week: 5, focus: 'Sitting with Discomfort (15 min/day)', link: '#', description: 'Gently acknowledge and allow difficult physical sensations or emotions.' },
        { week: 6, focus: 'Loving-Kindness Meditation (15 min/day)', link: '#', description: 'Cultivate feelings of warmth, kindness, and compassion for self and others.' },
        { week: 7, focus: 'Mindfulness of Emotions (15 min/day)', link: '#', description: 'Recognize and name emotions without getting carried away by them.' },
        { week: 8, focus: 'Urge Surfing Technique (Practice as needed)', link: '#', description: 'Observe cravings like waves, rising and falling, without acting on them.' },
      ],
    },
    {
      month: 3,
      title: 'Month 3: Integration & Awareness',
      weeks: [
        { week: 9, focus: 'Mindful Listening (15 min/day)', link: '#', description: 'Focus fully on the sounds around you, without labeling or judging.' },
        { week: 10, focus: 'Mindful Eating (Practice with one meal/day)', link: '#', description: 'Pay attention to the tastes, textures, and smells of your food.' },
        { week: 11, focus: 'Open Awareness Meditation (20 min/day)', link: '#', description: 'Rest in awareness, noticing whatever arises in your experience without a specific focus.' },
        { week: 12, focus: 'Mindfulness of Daily Activities', link: '#', description: 'Bring awareness to routine tasks like brushing teeth or washing dishes.' },
      ],
    },
     {
      month: 4,
      title: 'Month 4: Stability & Self-Compassion',
      weeks: [
        { week: 13, focus: 'Lengthening Sitting Practice (20-25 min/day)', link: '#', description: 'Gradually increase the duration of your chosen formal practice.' },
        { week: 14, focus: 'Self-Compassion Break (Practice as needed)', link: '#', description: 'Offer yourself kindness and understanding during difficult moments.' },
        { week: 15, focus: 'Mindfulness of Communication', link: '#', description: 'Practice listening fully and speaking mindfully in conversations.' },
        { week: 16, focus: 'Reviewing Core Concepts', link: '#', description: 'Revisit mindful breathing, body scan, and thought awareness techniques.' },
      ],
    },
     {
      month: 5,
      title: 'Month 5: Insight & Equanimity',
      weeks: [
        { week: 17, focus: 'Observing Impermanence (25 min/day)', link: '#', description: 'Notice the changing nature of thoughts, feelings, and sensations.' },
        { week: 18, focus: 'Working with Difficult Emotions', link: '#', description: 'Apply RAIN (Recognize, Allow, Investigate, Nurture) to challenging feelings.' },
        { week: 19, focus: 'Expanding Loving-Kindness', link: '#', description: 'Extend compassionate wishes to difficult people or situations.' },
        { week: 20, focus: 'Mindfulness in High-Stress Situations', link: '#', description: 'Practice grounding techniques (like 5-4-3-2-1) during stressful moments.' },
      ],
    },
     {
      month: 6,
      title: 'Month 6: Sustaining Practice & Integration',
      weeks: [
        { week: 21, focus: 'Consistent Practice (25-30 min/day)', link: '#', description: 'Maintain a regular daily meditation routine.' },
        { week: 22, focus: 'Mindful Check-ins Throughout the Day', link: '#', description: 'Pause briefly several times a day to notice your breath and current state.' },
        { week: 23, focus: 'Generosity and Gratitude Practice', link: '#', description: 'Reflect on things you are grateful for or acts of kindness.' },
        { week: 24, focus: 'Planning for Ongoing Practice', link: '#', description: 'Reflect on progress, challenges, and set intentions for continuing mindfulness long-term.' },
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

