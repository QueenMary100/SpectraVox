'use server';
/**
 * @fileOverview This file contains the real-time adaptive remediation flow for the AptX learning platform.
 *
 * It includes:
 * - `provideRealTimeAdaptiveRemediation`: A function that triggers a remediation lesson based on student performance.
 * - `AdaptiveRemediationInput`: The input type for the `provideRealTimeAdaptiveRemediation` function.
 * - `AdaptiveRemediationOutput`: The output type for the `provideRealTimeAdaptiveRemediation` function.
 */

import {ai} from '@/ai/genkit-server';
import {z} from 'zod';

const AdaptiveRemediationInputSchema = z.object({
  studentId: z.string().describe('The ID of the student.'),
  currentLessonId: z.string().describe('The ID of the current lesson the student is taking.'),
  performanceData: z.object({
    score: z.number().describe('The student\'s score on the current lesson.'),
    timeSpent: z.number().describe('The time spent by the student on the current lesson in seconds.'),
    engagementLevel: z.string().describe('The student\'s engagement level (e.g., high, medium, low).'),
  }).describe('Data about the student\'s performance on the current lesson.'),
});
export type AdaptiveRemediationInput = z.infer<typeof AdaptiveRemediationInputSchema>;

const AdaptiveRemediationOutputSchema = z.object({
  remediationRequired: z.boolean().describe('Whether remediation is required.'),
  remediationLessonId: z.string().optional().describe('The ID of the remediation lesson to assign, if remediation is required.'),
  reason: z.string().optional().describe('The reason for suggesting a remediation lesson.'),
});
export type AdaptiveRemediationOutput = z.infer<typeof AdaptiveRemediationOutputSchema>;

export async function provideRealTimeAdaptiveRemediation(
  input: AdaptiveRemediationInput
): Promise<AdaptiveRemediationOutput> {
  return adaptiveRemediationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveRemediationPrompt',
  input: {
    schema: AdaptiveRemediationInputSchema,
  },
  output: {
    schema: AdaptiveRemediationOutputSchema,
  },
  prompt: `Based on the student's performance data, determine if remediation is required.

Student ID: {{{studentId}}}
Current Lesson ID: {{{currentLessonId}}}
Performance Data:
  Score: {{{performanceData.score}}}
  Time Spent: {{{performanceData.timeSpent}}}
  Engagement Level: {{{performanceData.engagementLevel}}}

Consider these factors when determining if remediation is needed:
- A low score indicates a lack of understanding.
- A short time spent with a low score suggests the student is rushing or disengaged.
- A low engagement level suggests the student is not interested or finding the material difficult.

If remediation is required, identify a suitable remediation lesson ID. Provide a clear reason for suggesting the remediation lesson.

Output in JSON format:
`,
});

const adaptiveRemediationFlow = ai.defineFlow(
  {
    name: 'adaptiveRemediationFlow',
    inputSchema: AdaptiveRemediationInputSchema,
    outputSchema: AdaptiveRemediationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
