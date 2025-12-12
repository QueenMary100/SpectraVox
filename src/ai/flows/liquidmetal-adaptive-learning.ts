import { ai } from '../genkit-server';
import { z } from 'zod';

const AdaptiveLearningInput = z.object({
  studentId: z.string(),
  ageGroup: z.string(),
  currentLevel: z.string(),
  learningGoals: z.array(z.string()),
  specialNeeds: z.object({
    cognitiveLevel: z.string().optional(),
    attentionSpan: z.string().optional(),
    preferredLearningStyle: z.array(z.string()).optional(),
    accommodations: z.array(z.string()).optional(),
  }),
  subjectArea: z.string(),
});

const AdaptiveLearningOutput = z.object({
  personalizedPath: z.object({
    level: z.string(),
    modules: z.array(z.object({
      title: z.string(),
      description: z.string(),
      activities: z.array(z.object({
        type: z.string(),
        instructions: z.string(),
        adaptations: z.array(z.string()),
        estimatedTime: z.string(),
        interactions: z.array(z.string()),
      })),
      assessments: z.array(z.object({
        type: z.string(),
        questions: z.array(z.string()),
        adaptiveHints: z.array(z.string()),
        successCriteria: z.string(),
      })),
    })),
    progressionCriteria: z.object({
      completionThreshold: z.number(),
      masteryIndicators: z.array(z.string()),
      nextSteps: z.array(z.string()),
    }),
  }),
  accommodations: z.object({
    visual: z.array(z.string()),
    auditory: z.array(z.string()),
    interactive: z.array(z.string()),
    timing: z.array(z.string()),
  }),
  recommendations: z.array(z.object({
    category: z.string(),
    suggestion: z.string(),
    rationale: z.string(),
  })),
});

export const generateAdaptiveLearningPath = ai.defineFlow(
  {
    name: 'generateAdaptiveLearningPath',
    inputSchema: AdaptiveLearningInput,
    outputSchema: AdaptiveLearningOutput,
  },
  async (input) => {
    const { studentId, ageGroup, currentLevel, learningGoals, specialNeeds, subjectArea } = input;

    const prompt = `
      Create an adaptive learning path for a student with Down syndrome using the following profile:
      
      Student Profile:
      - Age Group: ${ageGroup}
      - Current Level: ${currentLevel}
      - Learning Goals: ${learningGoals.join(', ')}
      - Special Needs: ${JSON.stringify(specialNeeds, null, 2)}
      - Subject Area: ${subjectArea}
      
      Guidelines:
      1. Create content appropriate for the cognitive level
      2. Include multisensory approaches (visual, auditory, kinesthetic)
      3. Provide clear, simple instructions
      4. Break down complex concepts into smaller steps
      5. Include repetition and reinforcement
      6. Allow for different pacing
      7. Include positive reinforcement and encouragement
      8. Use concrete examples and real-world connections
      9. Provide immediate feedback
      10. Include assistive technology recommendations
      
      Generate a comprehensive learning path with modules, activities, assessments, accommodations, and recommendations.
    `;

    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });

    try {
      return JSON.parse(result.text);
    } catch (error) {
      // Fallback structured response if JSON parsing fails
      return {
        personalizedPath: {
          level: currentLevel,
          modules: [{
            title: `${subjectArea} Basics`,
            description: `Introduction to ${subjectArea} concepts`,
            activities: [{
              type: 'interactive',
              instructions: result.text,
              adaptations: ['visual cues', 'audio support', 'extra time'],
              estimatedTime: '15-20 minutes',
              interactions: ['touch', 'voice', 'drag-drop']
            }],
            assessments: [{
              type: 'formative',
              questions: ['Basic comprehension check'],
              adaptiveHints: ['Visual hints available', 'Step-by-step guidance'],
              successCriteria: 'Student can complete with minimal assistance'
            }]
          }],
          progressionCriteria: {
            completionThreshold: 80,
            masteryIndicators: ['Independence', 'Accuracy', 'Engagement'],
            nextSteps: ['Advance to next module', 'Introduce new concepts']
          }
        },
        accommodations: {
          visual: ['Large text', 'High contrast', 'Visual schedules'],
          auditory: ['Audio instructions', 'Sound cues', 'Repetition'],
          interactive: ['Touch interface', 'Simple gestures', 'Voice commands'],
          timing: ['Extended time', 'Pause options', 'Break reminders']
        },
        recommendations: [
          {
            category: 'Learning Style',
            suggestion: 'Use multisensory approach',
            rationale: 'Enhances engagement and retention'
          }
        ]
      };
    }
  }
);

export type { AdaptiveLearningInput, AdaptiveLearningOutput };