
'use server';
/**
 * @fileOverview AI-powered recovery plan generator.
 *
 * - generateRecoveryPlan - A function that generates a personalized recovery plan based on user input.
 * - RecoveryPlanInput - The input type for the generateRecoveryPlan function.
 * - RecoveryPlanOutput - The return type for the generateRecoveryPlan function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RecoveryPlanInputSchema = z.object({
  drugType: z
    .string()
    .describe('The type of drug the user is addicted to (e.g., weed, alcohol, cocaine).'),
  addictionLength: z
    .string()
    .describe('How long the user has been addicted to drugs (e.g., months, years).'),
  usageFrequency: z
    .string()
    .describe('How many drugs the user uses per day or week.'),
  triggers: z
    .string()
    .describe('The triggers that makes the user take drugs.'),
  mentalHealthHistory: z
    .string()
    .describe('The mental health history of the user.'),
});
export type RecoveryPlanInput = z.infer<typeof RecoveryPlanInputSchema>;

const RecoveryPlanOutputSchema = z.object({
  recoveryPlan: z
    .string()
    .describe('A personalized recovery plan tailored to the user based on their input. Format the plan clearly using Markdown. Use ## for main section headings (e.g., ## Introduction) and standard markdown for lists (* item or 1. item).'),
});
export type RecoveryPlanOutput = z.infer<typeof RecoveryPlanOutputSchema>;

export async function generateRecoveryPlan(input: RecoveryPlanInput): Promise<RecoveryPlanOutput> {
  return generateRecoveryPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecoveryPlanPrompt',
  input: {
    schema: z.object({
      drugType: z
        .string()
        .describe('The type of drug the user is addicted to (e.g., weed, alcohol, cocaine).'),
      addictionLength: z
        .string()
        .describe('How long the user has been addicted to drugs (e.g., months, years).'),
      usageFrequency: z
        .string()
        .describe('How many drugs the user uses per day or week.'),
      triggers: z
        .string()
        .describe('The triggers that makes the user take drugs.'),
      mentalHealthHistory: z
        .string()
        .describe('The mental health history of the user.'),
    }),
  },
  output: {
    schema: z.object({
      recoveryPlan: z
        .string()
        .describe('A personalized recovery plan tailored to the user based on their input. Structure the plan with clear sections (e.g., Introduction, Goals, Coping Strategies, Support Network, Milestones, Relapse Prevention). Use empathetic and encouraging language. Provide actionable steps. Format using Markdown: use "## Section Title" for headings and standard markdown lists (* item or 1. item).'),
    }),
  },
  prompt: `You are an AI assistant specializing in addiction recovery support. Create a personalized, empathetic, and actionable recovery plan based on the following user information. The plan should be structured, encouraging, and provide concrete steps. Acknowledge the courage it takes to seek help.

**User Information:**
*   **Primary Substance:** {{{drugType}}}
*   **Duration of Addiction:** {{{addictionLength}}}
*   **Usage Frequency:** {{{usageFrequency}}}
*   **Identified Triggers:** {{{triggers}}}
*   **Mental Health Context:** {{{mentalHealthHistory}}}

**Instructions:**
Generate a personalized recovery plan including the following sections. **Use Markdown formatting for clear structure:**
1.  **## Introduction:** Start with an empathetic and encouraging message acknowledging their step towards recovery.
2.  **## Personalized Goals:** Set realistic short-term (e.g., first week, first month) and long-term goals based on their information. Use bullet points (* item) for lists of goals.
3.  **## Coping Strategies:** Suggest specific strategies to manage cravings and deal with triggers relevant to their substance and situation (e.g., mindfulness for anxiety triggers, distraction techniques, HALT - Hungry, Angry, Lonely, Tired). Use bullet points (* item) for listing strategies.
4.  **## Building a Support Network:** Recommend types of support (e.g., therapy, support groups like AA/NA/SMART Recovery, trusted friends/family) and how to engage with them. Use bullet points (* item).
5.  **## Milestone Recognition:** Briefly mention the importance of celebrating progress (which the app tracks).
6.  **## Relapse Prevention & Management:** Offer basic advice on identifying warning signs and what to do if a lapse occurs (emphasizing self-compassion and getting back on track). Use bullet points (* item).
7.  **## Community Support:** Encourage joining support groups within the app (like SoberTown) for peer interaction, pledging, and sharing progress. Mention features like posting updates, commenting, and participating in group chats. Use bullet points (* item).
8.  **## Important Reminder:** Include a reminder that this AI plan is not a substitute for professional medical advice and encourage seeking professional help.

**Output Format:**
Strictly use Markdown. Use "## Heading" for each section title as shown above. Use bullet points (* item) or numbered lists (1. item) for lists within sections. Keep the language supportive and non-judgmental. Ensure proper spacing between sections and list items for readability.

**Generate the Recovery Plan:**
Ensure the entire generated plan is placed within the 'recoveryPlan' field of the output JSON object.
`,
});

const generateRecoveryPlanFlow = ai.defineFlow<
  typeof RecoveryPlanInputSchema,
  typeof RecoveryPlanOutputSchema
>(
  {
    name: 'generateRecoveryPlanFlow',
    inputSchema: RecoveryPlanInputSchema,
    outputSchema: RecoveryPlanOutputSchema,
  },
  async (input) => {
    try {
      const { output, usage } = await prompt(input); // Capture usage info if needed

      // Check if the output exists and has the recoveryPlan field
      if (!output || !output.recoveryPlan) {
          console.error("AI prompt returned null or undefined output, or missing recoveryPlan field.");
          throw new Error("AI failed to generate a recovery plan. Output was missing or incomplete.");
      }

      // Basic validation: Ensure the plan is not empty or just whitespace
      if (output.recoveryPlan.trim().length === 0) {
          console.warn("Generated recovery plan is empty or whitespace only.");
          throw new Error("Generated recovery plan is empty.");
      }

      console.log("AI Recovery Plan Generated Successfully. Usage:", usage); // Log success and usage
      return output; // Return the valid output object

    } catch (error: unknown) {
        // Log the error for debugging
        console.error("Error executing generateRecoveryPlanFlow:", error);

        // Re-throw a more specific error or handle it gracefully
        if (error instanceof Error) {
            throw new Error(`Failed to generate recovery plan: ${error.message}`);
        } else {
            throw new Error("An unknown error occurred while generating the recovery plan.");
        }
    }
  }
);

