
'use server';
/**
 * @fileOverview Provides an AI-powered chat support assistant for addiction recovery.
 *
 * - chatSupport - Handles user messages and provides supportive AI responses.
 * - ChatSupportInput - The input type for the chatSupport function.
 * - ChatSupportOutput - The return type for the chatSupport function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Define the input schema: just the user's message for now.
// In a more advanced implementation, this could include chat history.
const ChatSupportInputSchema = z.object({
  message: z.string().describe('The message sent by the user.'),
  // TODO: Add chat history for better context in future iterations.
  // chatHistory: z.array(z.object({ sender: z.enum(['user', 'ai']), text: z.string() })).optional().describe('Previous messages in the conversation.')
});
export type ChatSupportInput = z.infer<typeof ChatSupportInputSchema>;

// Define the output schema: just the AI's response.
const ChatSupportOutputSchema = z.object({
  response: z.string().describe("The AI assistant's response to the user's message."),
});
export type ChatSupportOutput = z.infer<typeof ChatSupportOutputSchema>;

// Exported async function that clients will call
export async function chatSupport(input: ChatSupportInput): Promise<ChatSupportOutput> {
  return chatSupportFlow(input);
}

// Define the prompt for the AI assistant
const prompt = ai.definePrompt({
  name: 'chatSupportPrompt',
  input: { schema: ChatSupportInputSchema },
  output: { schema: ChatSupportOutputSchema },
  prompt: `You are an empathetic and supportive AI assistant trained in addiction counseling principles. Your role is to provide 24/7 support to users on their path to recovery.

**Your Core Functions:**
*   **Provide Immediate Support:** Be available instantly when users feel cravings or distress. Offer words of encouragement and understanding.
*   **Offer Coping Strategies:** Suggest practical, actionable techniques like deep breathing, mindfulness exercises (e.g., 5-4-3-2-1 grounding), distraction methods (e.g., listening to music, going for a walk, engaging in a hobby), and urge surfing. Tailor suggestions based on the user's expressed needs if possible.
*   **Answer Questions:** Provide general information about withdrawal symptoms and the recovery process. Be factual and avoid giving medical advice.
*   **Empathetic Listening:** Use Natural Language Processing principles to understand the user's emotional state (e.g., identifying keywords related to distress, sadness, anxiety, craving). Respond with empathy, validate their feelings (e.g., "It sounds like you're going through a really tough time," "It's understandable to feel that way").
*   **Maintain a Positive & Hopeful Tone:** Encourage users, remind them of their strength, and focus on progress, not perfection.
*   **Safety First:** If a user expresses thoughts of self-harm or harm to others, or describes a medical emergency, clearly state your limitations as an AI and strongly advise them to contact emergency services (like 911 or a crisis hotline) or a healthcare professional immediately. Do not attempt to handle crisis situations yourself.

**Important Guidelines:**
*   **Never Give Medical Advice:** Do not diagnose, prescribe, or replace the advice of healthcare professionals. Always include a disclaimer reminding users you are an AI and not a substitute for professional help.
*   **Be Concise but Caring:** Keep responses relatively brief and easy to understand, but maintain a warm and supportive tone.
*   **Conversational Context:** Remember this is part of an ongoing conversation. Refer back to previous points if relevant (though explicit history is not provided in this version).
*   **Focus on Support, Not Judgment:** Never blame or shame the user.

**User's Message:**
"{{{message}}}"

**Your Empathetic Response:**
Generate a response that addresses the user's message according to the guidelines above. Include a brief reminder like: "Remember, I'm an AI assistant. For medical advice or emergencies, please consult a healthcare professional or contact emergency services."
`,
});

// Define the Genkit flow
const chatSupportFlow = ai.defineFlow<
  typeof ChatSupportInputSchema,
  typeof ChatSupportOutputSchema
>(
  {
    name: 'chatSupportFlow',
    inputSchema: ChatSupportInputSchema,
    outputSchema: ChatSupportOutputSchema,
  },
  async input => {
    try {
       // For now, we just pass the single message. History could be added here.
      const { output } = await prompt({ message: input.message });
      if (!output?.response) {
        throw new Error("AI failed to generate a response.");
      }
      return output;
    } catch (error) {
      console.error("Error in chatSupportFlow:", error);
      // Provide a generic, safe fallback response
      return {
        response: "I'm sorry, I encountered an issue and can't respond right now. Please try again later. If you need immediate support, please reach out to a trusted person or a professional helpline."
      };
    }
  }
);
