
'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Youtube } from 'lucide-react'; // Use Youtube icon

// Helper function to generate placeholder YouTube search links
const getYoutubeSearchLink = (query: string) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

// Define a type for the link data (removed title and channel)
type SuggestedLink = {
  url: string;
};

// Define the structure for weeks and months, including the new link structure
type WeekPlan = {
  week: number;
  focus: string;
  description: string;
  links: SuggestedLink[];
};

type MonthPlan = {
  month: number;
  title: string;
  weeks: WeekPlan[];
};

export function MeditationPlan() {
  // Updated plan removing titles and channels
  const plan: MonthPlan[] = [
     {
      month: 1,
      title: 'Month 1: Building the Foundation',
      weeks: [
        { week: 1, focus: 'Mindful Breathing Basics (5 min/day)', description: 'Focus on the sensation of breath entering and leaving your body.', links: [ { url: getYoutubeSearchLink('5 minute mindful breathing meditation') }, { url: getYoutubeSearchLink('introduction to mindful breathing') }] },
        { week: 2, focus: 'Body Scan Meditation (10 min/day)', description: 'Bring gentle, non-judgmental awareness to different parts of the body.', links: [ { url: getYoutubeSearchLink('10 minute body scan meditation guided') }, { url: getYoutubeSearchLink('body scan for beginners') }] },
        { week: 3, focus: 'Noticing Thoughts Without Judgment (10 min/day)', description: 'Observe thoughts as passing mental events, like clouds in the sky.', links: [ { url: getYoutubeSearchLink('observing thoughts meditation 10 minutes') }, { url: getYoutubeSearchLink('thoughts are not facts meditation') }] },
        { week: 4, focus: 'Mindful Walking (10 min/day)', description: 'Pay attention to the physical sensations of walking.', links: [ { url: getYoutubeSearchLink('10 minute mindful walking guided meditation') }, { url: getYoutubeSearchLink('how to practice mindful walking') }] },
      ],
    },
     {
      month: 2,
      title: 'Month 2: Deepening Practice',
      weeks: [
        { week: 5, focus: 'Sitting with Discomfort (15 min/day)', description: 'Gently acknowledge and allow difficult physical sensations or emotions.', links: [ { url: getYoutubeSearchLink('meditation for difficult emotions 15 minutes') }, { url: getYoutubeSearchLink('sitting with discomfort mindfulness') }] },
        { week: 6, focus: 'Loving-Kindness Meditation (15 min/day)', description: 'Cultivate feelings of warmth, kindness, and compassion for self and others.', links: [ { url: getYoutubeSearchLink('15 minute loving kindness meditation guided') }, { url: getYoutubeSearchLink('metta meditation practice') }] },
        { week: 7, focus: 'Mindfulness of Emotions (15 min/day)', description: 'Recognize and name emotions without getting carried away by them.', links: [ { url: getYoutubeSearchLink('mindfulness of emotions guided meditation') }, { url: getYoutubeSearchLink('labeling emotions mindfulness') }] },
        { week: 8, focus: 'Urge Surfing Technique (Practice as needed)', description: 'Observe cravings like waves, rising and falling, without acting on them.', links: [ { url: getYoutubeSearchLink('urge surfing guided meditation') }, { url: getYoutubeSearchLink('how to practice urge surfing') }] },
      ],
    },
     {
      month: 3,
      title: 'Month 3: Integration & Awareness',
      weeks: [
        { week: 9, focus: 'Mindful Listening (15 min/day)', description: 'Focus fully on the sounds around you, without labeling or judging.', links: [ { url: getYoutubeSearchLink('mindful listening meditation guided 15 minutes') }, { url: getYoutubeSearchLink('sounds and thoughts meditation') }] },
        { week: 10, focus: 'Mindful Eating (Practice with one meal/day)', description: 'Pay attention to the tastes, textures, and smells of your food.', links: [ { url: getYoutubeSearchLink('mindful eating exercise guided') }, { url: getYoutubeSearchLink('introduction to mindful eating') }] },
        { week: 11, focus: 'Open Awareness Meditation (20 min/day)', description: 'Rest in awareness, noticing whatever arises in your experience without a specific focus.', links: [ { url: getYoutubeSearchLink('open awareness meditation 20 minutes') }, { url: getYoutubeSearchLink('choiceless awareness meditation guide') }] },
        { week: 12, focus: 'Mindfulness of Daily Activities', description: 'Bring awareness to routine tasks like brushing teeth or washing dishes.', links: [ { url: getYoutubeSearchLink('mindfulness in daily life exercises') }, { url: getYoutubeSearchLink('integrating mindfulness into routine') }] },
      ],
    },
     {
      month: 4,
      title: 'Month 4: Stability & Self-Compassion',
      weeks: [
        { week: 13, focus: 'Lengthening Sitting Practice (20-25 min/day)', description: 'Gradually increase the duration of your chosen formal practice.', links: [ { url: getYoutubeSearchLink('25 minute guided meditation sitting') }, { url: getYoutubeSearchLink('deepening your meditation practice') }] },
        { week: 14, focus: 'Self-Compassion Break (Practice as needed)', description: 'Offer yourself kindness and understanding during difficult moments.', links: [ { url: getYoutubeSearchLink('self compassion break guided meditation kristin neff') }, { url: getYoutubeSearchLink('quick self compassion exercise') }] },
        { week: 15, focus: 'Mindfulness of Communication', description: 'Practice listening fully and speaking mindfully in conversations.', links: [ { url: getYoutubeSearchLink('mindful communication exercises') }, { url: getYoutubeSearchLink('deep listening practice') }] },
        { week: 16, focus: 'Reviewing Core Concepts', description: 'Revisit mindful breathing, body scan, and thought awareness techniques.', links: [ { url: getYoutubeSearchLink('mindfulness basics review meditation') }, { url: getYoutubeSearchLink('foundations of mindfulness practice') }] },
      ],
    },
     {
      month: 5,
      title: 'Month 5: Insight & Equanimity',
      weeks: [
        { week: 17, focus: 'Observing Impermanence (25 min/day)', description: 'Notice the changing nature of thoughts, feelings, and sensations.', links: [ { url: getYoutubeSearchLink('impermanence meditation guided 25 minutes') }, { url: getYoutubeSearchLink('mindfulness of change meditation') }] },
        { week: 18, focus: 'Working with Difficult Emotions (RAIN)', description: 'Apply RAIN (Recognize, Allow, Investigate, Nurture) to challenging feelings.', links: [ { url: getYoutubeSearchLink('rain meditation guided tara brach') }, { url: getYoutubeSearchLink('how to practice rain meditation') }] },
        { week: 19, focus: 'Expanding Loving-Kindness', description: 'Extend compassionate wishes to difficult people or situations.', links: [ { url: getYoutubeSearchLink('loving kindness for difficult people meditation') }, { url: getYoutubeSearchLink('advanced loving kindness practice') }] },
        { week: 20, focus: 'Mindfulness in High-Stress Situations', description: 'Practice grounding techniques (like 5-4-3-2-1) during stressful moments.', links: [ { url: getYoutubeSearchLink('mindfulness for stress and anxiety guided') }, { url: getYoutubeSearchLink('54321 grounding technique exercise') }] },
      ],
    },
     {
      month: 6,
      title: 'Month 6: Sustaining Practice & Integration',
      weeks: [
        { week: 21, focus: 'Consistent Practice (25-30 min/day)', description: 'Maintain a regular daily meditation routine.', links: [ { url: getYoutubeSearchLink('30 minute silent meditation timer with bells') }, { url: getYoutubeSearchLink('building a consistent meditation habit') }] },
        { week: 22, focus: 'Mindful Check-ins Throughout the Day', description: 'Pause briefly several times a day to notice your breath and current state.', links: [ { url: getYoutubeSearchLink('mini mindfulness breaks guided') }, { url: getYoutubeSearchLink('how to do mindful check ins') }] },
        { week: 23, focus: 'Generosity and Gratitude Practice', description: 'Reflect on things you are grateful for or acts of kindness.', links: [ { url: getYoutubeSearchLink('gratitude meditation guided practice') }, { url: getYoutubeSearchLink('cultivating generosity mindfulness') }] },
        { week: 24, focus: 'Planning for Ongoing Practice', description: 'Reflect on progress, challenges, and set intentions for continuing mindfulness long-term.', links: [ { url: getYoutubeSearchLink('maintaining mindfulness practice long term') }, { url: getYoutubeSearchLink('setting intentions for meditation') }] },
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
            <div className="space-y-4 pl-2 border-l-2 border-accent/50 ml-2">
              {monthData.weeks.map((weekData) => (
                <div key={weekData.week} className="text-sm pb-3 border-b border-border/50 last:border-b-0 last:pb-0">
                  <p className="font-medium text-foreground">
                    Week {weekData.week}: {weekData.focus}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">{weekData.description}</p>
                  <div className="mt-3 space-y-3"> {/* Increased spacing */}
                     <p className="text-xs text-muted-foreground italic font-semibold">Suggested Videos (Links search YouTube):</p>
                     {weekData.links.map((linkData, index) => (
                         <div key={index} className="pl-2"> {/* Indent video details */}
                            {/* Removed title and channel display */}
                             <a
                                href={linkData.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1.5 group"
                              >
                                <Youtube className="h-3.5 w-3.5 text-red-600 group-hover:text-red-700 transition-colors" />
                                Find on YouTube (Link {index + 1})
                              </a>
                         </div>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

