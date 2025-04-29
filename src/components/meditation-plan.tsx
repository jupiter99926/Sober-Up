
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

// Define a type for the link data
type SuggestedLink = {
  url: string;
  title: string;
  channel: string;
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
  // Updated plan with titles and channels for each link
  const plan: MonthPlan[] = [
     {
      month: 1,
      title: 'Month 1: Building the Foundation',
      weeks: [
        { week: 1, focus: 'Mindful Breathing Basics (5 min/day)', description: 'Focus on the sensation of breath entering and leaving your body.', links: [ { url: getYoutubeSearchLink('5 minute mindful breathing meditation'), title: '5-Minute Mindful Breathing', channel: 'MindfulPeace' }, { url: getYoutubeSearchLink('introduction to mindful breathing'), title: 'Intro to Mindful Breathing', channel: 'Calm Collective' }] },
        { week: 2, focus: 'Body Scan Meditation (10 min/day)', description: 'Bring gentle, non-judgmental awareness to different parts of the body.', links: [ { url: getYoutubeSearchLink('10 minute body scan meditation guided'), title: 'Guided Body Scan (10 min)', channel: 'Headspace' }, { url: getYoutubeSearchLink('body scan for beginners'), title: 'Body Scan for Beginners', channel: 'The Mindful Movement' }] },
        { week: 3, focus: 'Noticing Thoughts Without Judgment (10 min/day)', description: 'Observe thoughts as passing mental events, like clouds in the sky.', links: [ { url: getYoutubeSearchLink('observing thoughts meditation 10 minutes'), title: 'Observing Thoughts (10 min)', channel: 'Great Meditation' }, { url: getYoutubeSearchLink('thoughts are not facts meditation'), title: 'Thoughts Are Not Facts', channel: 'Mindful Magazine' }] },
        { week: 4, focus: 'Mindful Walking (10 min/day)', description: 'Pay attention to the physical sensations of walking.', links: [ { url: getYoutubeSearchLink('10 minute mindful walking guided meditation'), title: 'Guided Mindful Walking (10 min)', channel: 'Declutter The Mind' }, { url: getYoutubeSearchLink('how to practice mindful walking'), title: 'How to Practice Mindful Walking', channel: 'Plum Village' }] },
      ],
    },
     {
      month: 2,
      title: 'Month 2: Deepening Practice',
      weeks: [
        { week: 5, focus: 'Sitting with Discomfort (15 min/day)', description: 'Gently acknowledge and allow difficult physical sensations or emotions.', links: [ { url: getYoutubeSearchLink('meditation for difficult emotions 15 minutes'), title: 'Meditation for Difficult Emotions (15 min)', channel: 'Tara Brach' }, { url: getYoutubeSearchLink('sitting with discomfort mindfulness'), title: 'Sitting with Discomfort', channel: 'Mindful.org' }] },
        { week: 6, focus: 'Loving-Kindness Meditation (15 min/day)', description: 'Cultivate feelings of warmth, kindness, and compassion for self and others.', links: [ { url: getYoutubeSearchLink('15 minute loving kindness meditation guided'), title: 'Loving-Kindness Guided Meditation (15 min)', channel: 'Sharon Salzberg' }, { url: getYoutubeSearchLink('metta meditation practice'), title: 'Metta Meditation Practice', channel: 'Insight Meditation Society' }] },
        { week: 7, focus: 'Mindfulness of Emotions (15 min/day)', description: 'Recognize and name emotions without getting carried away by them.', links: [ { url: getYoutubeSearchLink('mindfulness of emotions guided meditation'), title: 'Guided Mindfulness of Emotions', channel: 'Calm' }, { url: getYoutubeSearchLink('labeling emotions mindfulness'), title: 'Labeling Emotions Exercise', channel: 'Positive Psychology' }] },
        { week: 8, focus: 'Urge Surfing Technique (Practice as needed)', description: 'Observe cravings like waves, rising and falling, without acting on them.', links: [ { url: getYoutubeSearchLink('urge surfing guided meditation'), title: 'Guided Urge Surfing', channel: 'SMART Recovery' }, { url: getYoutubeSearchLink('how to practice urge surfing'), title: 'How to Practice Urge Surfing', channel: 'MindfulRP' }] },
      ],
    },
     {
      month: 3,
      title: 'Month 3: Integration & Awareness',
      weeks: [
        { week: 9, focus: 'Mindful Listening (15 min/day)', description: 'Focus fully on the sounds around you, without labeling or judging.', links: [ { url: getYoutubeSearchLink('mindful listening meditation guided 15 minutes'), title: 'Guided Mindful Listening (15 min)', channel: 'The Honest Guys' }, { url: getYoutubeSearchLink('sounds and thoughts meditation'), title: 'Sounds and Thoughts Meditation', channel: 'UCLA MARC' }] },
        { week: 10, focus: 'Mindful Eating (Practice with one meal/day)', description: 'Pay attention to the tastes, textures, and smells of your food.', links: [ { url: getYoutubeSearchLink('mindful eating exercise guided'), title: 'Guided Mindful Eating Exercise', channel: 'Mindful Eating Center' }, { url: getYoutubeSearchLink('introduction to mindful eating'), title: 'Intro to Mindful Eating', channel: 'Headspace' }] },
        { week: 11, focus: 'Open Awareness Meditation (20 min/day)', description: 'Rest in awareness, noticing whatever arises in your experience without a specific focus.', links: [ { url: getYoutubeSearchLink('open awareness meditation 20 minutes'), title: 'Open Awareness Meditation (20 min)', channel: 'Michael Sealey' }, { url: getYoutubeSearchLink('choiceless awareness meditation guide'), title: 'Choiceless Awareness Guide', channel: 'Sam Harris' }] },
        { week: 12, focus: 'Mindfulness of Daily Activities', description: 'Bring awareness to routine tasks like brushing teeth or washing dishes.', links: [ { url: getYoutubeSearchLink('mindfulness in daily life exercises'), title: 'Mindfulness in Daily Life', channel: 'Jon Kabat-Zinn' }, { url: getYoutubeSearchLink('integrating mindfulness into routine'), title: 'Integrating Mindfulness', channel: 'Mindful' }] },
      ],
    },
     {
      month: 4,
      title: 'Month 4: Stability & Self-Compassion',
      weeks: [
        { week: 13, focus: 'Lengthening Sitting Practice (20-25 min/day)', description: 'Gradually increase the duration of your chosen formal practice.', links: [ { url: getYoutubeSearchLink('25 minute guided meditation sitting'), title: '25-Minute Guided Sit', channel: 'Calm' }, { url: getYoutubeSearchLink('deepening your meditation practice'), title: 'Deepening Your Practice', channel: 'Insight Timer' }] },
        { week: 14, focus: 'Self-Compassion Break (Practice as needed)', description: 'Offer yourself kindness and understanding during difficult moments.', links: [ { url: getYoutubeSearchLink('self compassion break guided meditation kristin neff'), title: 'Self-Compassion Break', channel: 'Kristin Neff' }, { url: getYoutubeSearchLink('quick self compassion exercise'), title: 'Quick Self-Compassion Exercise', channel: 'Mindful Self-Compassion' }] },
        { week: 15, focus: 'Mindfulness of Communication', description: 'Practice listening fully and speaking mindfully in conversations.', links: [ { url: getYoutubeSearchLink('mindful communication exercises'), title: 'Mindful Communication Tips', channel: 'Psychology Today' }, { url: getYoutubeSearchLink('deep listening practice'), title: 'Deep Listening Practice', channel: 'Plum Village App' }] },
        { week: 16, focus: 'Reviewing Core Concepts', description: 'Revisit mindful breathing, body scan, and thought awareness techniques.', links: [ { url: getYoutubeSearchLink('mindfulness basics review meditation'), title: 'Mindfulness Basics Review', channel: 'Headspace' }, { url: getYoutubeSearchLink('foundations of mindfulness practice'), title: 'Foundations of Mindfulness', channel: 'UMass Medical School CFM' }] },
      ],
    },
     {
      month: 5,
      title: 'Month 5: Insight & Equanimity',
      weeks: [
        { week: 17, focus: 'Observing Impermanence (25 min/day)', description: 'Notice the changing nature of thoughts, feelings, and sensations.', links: [ { url: getYoutubeSearchLink('impermanence meditation guided 25 minutes'), title: 'Impermanence Meditation (25 min)', channel: 'Tara Brach' }, { url: getYoutubeSearchLink('mindfulness of change meditation'), title: 'Mindfulness of Change', channel: 'Jack Kornfield' }] },
        { week: 18, focus: 'Working with Difficult Emotions (RAIN)', description: 'Apply RAIN (Recognize, Allow, Investigate, Nurture) to challenging feelings.', links: [ { url: getYoutubeSearchLink('rain meditation guided tara brach'), title: 'RAIN Meditation', channel: 'Tara Brach' }, { url: getYoutubeSearchLink('how to practice rain meditation'), title: 'How to Practice RAIN', channel: 'Mindful Magazine' }] },
        { week: 19, focus: 'Expanding Loving-Kindness', description: 'Extend compassionate wishes to difficult people or situations.', links: [ { url: getYoutubeSearchLink('loving kindness for difficult people meditation'), title: 'Loving-Kindness for Difficult People', channel: 'Sharon Salzberg' }, { url: getYoutubeSearchLink('advanced loving kindness practice'), title: 'Advanced Metta Practice', channel: 'Insight Meditation Center' }] },
        { week: 20, focus: 'Mindfulness in High-Stress Situations', description: 'Practice grounding techniques (like 5-4-3-2-1) during stressful moments.', links: [ { url: getYoutubeSearchLink('mindfulness for stress and anxiety guided'), title: 'Mindfulness for Stress & Anxiety', channel: 'Calm' }, { url: getYoutubeSearchLink('54321 grounding technique exercise'), title: '5-4-3-2-1 Grounding Technique', channel: 'Therapist Aid' }] },
      ],
    },
     {
      month: 6,
      title: 'Month 6: Sustaining Practice & Integration',
      weeks: [
        { week: 21, focus: 'Consistent Practice (25-30 min/day)', description: 'Maintain a regular daily meditation routine.', links: [ { url: getYoutubeSearchLink('30 minute silent meditation timer with bells'), title: '30-Minute Silent Timer', channel: 'Insight Timer' }, { url: getYoutubeSearchLink('building a consistent meditation habit'), title: 'Building a Meditation Habit', channel: 'Headspace' }] },
        { week: 22, focus: 'Mindful Check-ins Throughout the Day', description: 'Pause briefly several times a day to notice your breath and current state.', links: [ { url: getYoutubeSearchLink('mini mindfulness breaks guided'), title: 'Mini Mindfulness Breaks', channel: 'The Mindful Movement' }, { url: getYoutubeSearchLink('how to do mindful check ins'), title: 'How to Do Mindful Check-ins', channel: 'Mindful.org' }] },
        { week: 23, focus: 'Generosity and Gratitude Practice', description: 'Reflect on things you are grateful for or acts of kindness.', links: [ { url: getYoutubeSearchLink('gratitude meditation guided practice'), title: 'Guided Gratitude Meditation', channel: 'Great Meditation' }, { url: getYoutubeSearchLink('cultivating generosity mindfulness'), title: 'Cultivating Generosity', channel: 'Jack Kornfield' }] },
        { week: 24, focus: 'Planning for Ongoing Practice', description: 'Reflect on progress, challenges, and set intentions for continuing mindfulness long-term.', links: [ { url: getYoutubeSearchLink('maintaining mindfulness practice long term'), title: 'Maintaining Long-Term Practice', channel: 'Mindful' }, { url: getYoutubeSearchLink('setting intentions for meditation'), title: 'Setting Meditation Intentions', channel: 'Yoga Journal' }] },
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
                             <p className="text-xs font-medium text-foreground mb-0.5">
                               {linkData.title} <span className="text-muted-foreground font-normal">by {linkData.channel}</span>
                             </p>
                             <a
                                href={linkData.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1.5 group"
                              >
                                <Youtube className="h-3.5 w-3.5 text-red-600 group-hover:text-red-700 transition-colors" />
                                Find on YouTube
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

