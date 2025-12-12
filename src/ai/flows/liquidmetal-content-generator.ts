import { ai } from '../genkit-server';
import { z } from 'zod';

const ContentGeneratorInput = z.object({
  topic: z.string(),
  ageGroup: z.string(),
  contentType: z.enum(['lesson', 'activity', 'game', 'assessment', 'video']),
  learningObjective: z.string(),
  specialNeeds: z.object({
    cognitiveLevel: z.string().optional(),
    attentionSpan: z.string().optional(),
    preferredLearningStyle: z.array(z.string()).optional(),
    sensoryNeeds: z.array(z.string()).optional(),
  }),
  duration: z.string(),
});

const ContentGeneratorOutput = z.object({
  content: z.object({
    title: z.string(),
    description: z.string(),
    learningObjectives: z.array(z.string()),
    materials: z.array(z.string()),
    steps: z.array(z.object({
      stepNumber: z.number(),
      title: z.string(),
      instructions: z.string(),
      visualAids: z.array(z.string()).optional(),
      audioCues: z.array(z.string()).optional(),
      interactions: z.array(z.string()).optional(),
      adaptations: z.array(z.string()).optional(),
    })),
    assessment: z.object({
      type: z.string(),
      questions: z.array(z.object({
        question: z.string(),
        type: z.string(),
        options: z.array(z.string()).optional(),
        correctAnswer: z.string().optional(),
        hints: z.array(z.string()).optional(),
        visualSupport: z.string().optional(),
      })),
      successCriteria: z.string(),
    }),
    adaptations: z.object({
      visual: z.array(z.string()),
      auditory: z.array(z.string()),
      physical: z.array(z.string()),
      cognitive: z.array(z.string()),
    }),
  }),
  accessibilityFeatures: z.array(z.object({
    feature: z.string(),
    implementation: z.string(),
  })),
  extensionActivities: z.array(z.object({
    title: z.string(),
    description: z.string(),
    difficulty: z.string(),
  })),
});

export const generateLiquidMetalContent = ai.defineFlow(
  {
    name: 'generateLiquidMetalContent',
    inputSchema: ContentGeneratorInput,
    outputSchema: ContentGeneratorOutput,
  },
  async (input) => {
    const { topic, ageGroup, contentType, learningObjective, specialNeeds, duration } = input;

    const prompt = `
      Create ${contentType} content for children with Down syndrome:
      
      Content Details:
      - Topic: ${topic}
      - Age Group: ${ageGroup}
      - Learning Objective: ${learningObjective}
      - Duration: ${duration}
      - Special Needs: ${JSON.stringify(specialNeeds, null, 2)}
      
      Content Requirements:
      1. Simple, clear language with short sentences
      2. Concrete examples and real-world connections
      3. Visual supports and scaffolding
      4. Step-by-step instructions
      5. Hands-on, interactive elements
      6. Positive reinforcement throughout
      7. Multiple ways to demonstrate understanding
      8. Breaks and movement opportunities
      9. Consistent structure and routines
      10. Celebrate small successes
      
      Generate comprehensive content with steps, assessments, adaptations, and accessibility features.
    `;

    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 2500,
      },
    });

    try {
      return JSON.parse(result.text);
    } catch (error) {
      // Fallback structured response
      return {
        content: {
          title: `${topic} - ${ageGroup}`,
          description: `Adaptive ${contentType} for ${ageGroup} with Down syndrome`,
          learningObjectives: [learningObjective],
          materials: ['Digital device', 'Interactive elements'],
          steps: [{
            stepNumber: 1,
            title: 'Introduction',
            instructions: result.text,
            visualAids: ['Icons', 'Images'],
            interactions: ['Touch', 'Voice'],
            adaptations: ['Extended time', 'Simplified instructions']
          }],
          assessment: {
            type: 'Interactive',
            questions: [{
              question: 'Basic understanding check',
              type: 'multiple-choice',
              options: ['Option 1', 'Option 2'],
              correctAnswer: 'Option 1',
              hints: ['Visual hint available'],
              visualSupport: 'Image support'
            }],
            successCriteria: 'Student demonstrates understanding'
          },
          adaptations: {
            visual: ['Large text', 'High contrast', 'Visual schedules'],
            auditory: ['Audio instructions', 'Sound cues'],
            physical: ['Touch interface', 'Simple gestures'],
            cognitive: ['Step-by-step', 'Repetition', 'Clear structure']
          }
        },
        accessibilityFeatures: [
          {
            feature: 'Screen reader support',
            implementation: 'ARIA labels and alt text'
          }
        ],
        extensionActivities: [
          {
            title: 'Practice activity',
            description: 'Reinforce learning with practice',
            difficulty: 'Easy'
          }
        ]
      };
    }
  }
);

export type { ContentGeneratorInput, ContentGeneratorOutput };