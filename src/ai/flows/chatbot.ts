'use server';
/**
 * @fileOverview A simple chatbot flow that responds to user inquiries.
 *
 * - chatbot - A function that generates a response to a user's message.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

import {ai} from '@/ai/genkit-server';
import {z} from 'zod';

const ChatbotInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user.'),
  navigation: z.string().optional().describe("A suggested navigation path if the user's request can be fulfilled by navigating to a page. Should be a valid path like '/student/lessons'.")
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}


const navigateTool = ai.defineTool(
    {
      name: 'navigate',
      description: 'Provides a navigation path when the user asks to go to a specific page.',
      inputSchema: z.object({
        path: z.string().describe("The path to navigate to, e.g., '/student', '/teacher/upload', etc."),
      }),
      outputSchema: z.string(),
    },
    async ({path}) => path
);

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  tools: [navigateTool],
  prompt: `You are AptX Ai, a friendly and empathetic AI assistant for AptX, an inclusive learning platform for students with Down syndrome.
Your primary role is to be helpful and encouraging. You understand the unique needs of your users and communicate with simple, clear, and positive language.

You can also help users navigate the application. If a user asks to go to a page, use the 'navigate' tool to suggest a path.

Available pages:
- /student: Student Dashboard
- /student/lessons: My Lessons
- /student/checkin: Daily Check-in
- /student/community: Student Community
- /teacher: Teacher Dashboard
- /teacher/upload: Upload Curriculum
- /teacher/community: Teacher Community
- /guardian: Guardian Dashboard
- /guardian/community: Guardian Community

User message: {{{message}}}
  
Based on the user's message, provide a helpful text response. If they ask to navigate, also provide the navigation path. Your response should always be in text, even if you suggest a navigation path. If the user's message is a simple greeting or a general question, provide a friendly and helpful response.`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const navigationToolCall = llmResponse.toolCalls().find(tc => tc.tool === 'navigate');

    let responseText = llmResponse.text;
    if (!responseText) {
        if (navigationToolCall) {
            responseText = `Sure, I can take you to the ${navigationToolCall.input.path.split('/').pop()} page.`;
        } else {
            responseText = "I'm not sure how to help with that. Can you try asking in a different way?";
        }
    }

    return {
        response: responseText,
        navigation: navigationToolCall ? navigationToolCall.input.path : undefined,
    }
  }
);
