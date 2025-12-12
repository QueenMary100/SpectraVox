'use server';

/**
 * @fileOverview A curriculum simplification AI agent.
 *
 * - simplifyCurriculumContent - A function that handles the curriculum simplification process.
 * - SimplifyCurriculumContentInput - The input type for the simplifyCurriculumContent function.
 * - SimplifyCurriculumContentOutput - The return type for the simplifyCurriculumContent function.
 */

import {ai} from '@/ai/genkit-server';
import {z} from 'zod';

const SimplifyCurriculumContentInputSchema = z.object({
  curriculumContent: z
    .string()
    .describe('The curriculum content to be simplified.'),
});
export type SimplifyCurriculumContentInput = z.infer<typeof SimplifyCurriculumContentInputSchema>;

const SimplifyCurriculumContentOutputSchema = z.object({
  simplifiedContent: z
    .string()
    .describe('The simplified curriculum content.'),
  childFriendlyDescription: z
    .string()
    .describe('A child-friendly description of the content.'),
});
export type SimplifyCurriculumContentOutput = z.infer<typeof SimplifyCurriculumContentOutputSchema>;

export async function simplifyCurriculumContent(
  input: SimplifyCurriculumContentInput
): Promise<SimplifyCurriculumContentOutput> {
  return simplifyCurriculumContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simplifyCurriculumContentPrompt',
  input: {schema: SimplifyCurriculumContentInputSchema},
  output: {schema: SimplifyCurriculumContentOutputSchema},
  prompt: `You are an expert educator specializing in simplifying complex curriculum content for students with Down syndrome.

You will receive curriculum content and simplify it into smaller, child-friendly chunks with appropriate descriptions.

Curriculum Content: {{{curriculumContent}}}`,
});

const simplifyCurriculumContentFlow = ai.defineFlow(
  {
    name: 'simplifyCurriculumContentFlow',
    inputSchema: SimplifyCurriculumContentInputSchema,
    outputSchema: SimplifyCurriculumContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
