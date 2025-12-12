'use server';
/**
 * @fileOverview Flow for generating adaptive assessments from curriculum content.
 *
 * - generateAdaptiveAssessments - A function that generates adaptive assessments.
 * - GenerateAdaptiveAssessmentsInput - The input type for the generateAdaptiveAssessments function.
 * - GenerateAdaptiveAssessmentsOutput - The return type for the generateAdaptiveAssessments function.
 */

import {ai} from '@/ai/genkit-server';
import {z} from 'zod';

const GenerateAdaptiveAssessmentsInputSchema = z.object({
  curriculumContent: z.string().describe('The curriculum content to generate assessments from.'),
  studentPerformance: z.string().optional().describe('The student performance data to adapt the assessment difficulty.'),
});

export type GenerateAdaptiveAssessmentsInput = z.infer<typeof GenerateAdaptiveAssessmentsInputSchema>;

const GenerateAdaptiveAssessmentsOutputSchema = z.object({
  assessments: z.array(z.object({
    questionType: z.enum(['multiple-choice', 'image-based', 'audio']),
    questionText: z.string(),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string(),
    explanation: z.string(),
  })).describe('The generated assessments.'),
});

export type GenerateAdaptiveAssessmentsOutput = z.infer<typeof GenerateAdaptiveAssessmentsOutputSchema>;

export async function generateAdaptiveAssessments(input: GenerateAdaptiveAssessmentsInput): Promise<GenerateAdaptiveAssessmentsOutput> {
  return generateAdaptiveAssessmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdaptiveAssessmentsPrompt',
  input: {schema: GenerateAdaptiveAssessmentsInputSchema},
  output: {schema: GenerateAdaptiveAssessmentsOutputSchema},
  prompt: `You are an expert in generating adaptive assessments for students with Down syndrome. Based on the curriculum content and the student's past performance, create a set of assessments that includes multiple-choice, image-based, and audio questions. Adapt the difficulty based on the studentPerformance data provided.

Curriculum Content: {{{curriculumContent}}}
Student Performance: {{{studentPerformance}}}

Ensure the assessments are:
- Cognitively accessible (2-3 options for multiple-choice).
- Visually clear and simple.
- Auditory clear and simple.

Output assessments in JSON format:
`, // Removed Handlebars {{formatJson}} as it's invalid and description is provided
});

const generateAdaptiveAssessmentsFlow = ai.defineFlow(
  {
    name: 'generateAdaptiveAssessmentsFlow',
    inputSchema: GenerateAdaptiveAssessmentsInputSchema,
    outputSchema: GenerateAdaptiveAssessmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
