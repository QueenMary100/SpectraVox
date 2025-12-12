import { ai } from '../genkit-server';
import { z } from 'zod';

const ProgressTrackerInput = z.object({
  studentId: z.string(),
  learningPath: z.array(z.object({
    moduleId: z.string(),
    moduleName: z.string(),
    completionStatus: z.enum(['not-started', 'in-progress', 'completed', 'mastered']),
    timeSpent: z.number(),
    assessmentScores: z.array(z.number()),
    engagementLevel: z.number(),
    accommodationsUsed: z.array(z.string()),
    challenges: z.array(z.string()).optional(),
    strengths: z.array(z.string()).optional(),
  })),
  currentGoals: z.array(z.string()),
  specialNeeds: z.object({
    cognitiveLevel: z.string(),
    attentionSpan: z.string(),
    preferredLearningStyle: z.array(z.string()),
  }),
});

const ProgressTrackerOutput = z.object({
  analysis: z.object({
    overallProgress: z.number(),
    strengthAreas: z.array(z.string()),
    challengeAreas: z.array(z.string()),
    learningTrends: z.array(z.object({
      area: z.string(),
      trend: z.string(), // 'improving', 'stable', 'declining'
      confidence: z.number(),
    })),
    engagementPatterns: z.array(z.object({
      pattern: z.string(),
      frequency: z.number(),
      impact: z.string(),
    })),
  }),
  recommendations: z.array(z.object({
    category: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    recommendation: z.string(),
    rationale: z.string(),
    implementation: z.string(),
  })),
  adjustments: z.object({
    accommodations: z.array(z.object({
      accommodation: z.string(),
      reason: z.string(),
      implementation: z.string(),
    })),
    pacing: z.object({
      current: z.string(),
      recommended: z.string(),
      adjustment: z.string(),
    }),
    content: z.array(z.object({
      moduleId: z.string(),
      adjustment: z.string(),
      reason: z.string(),
    })),
  }),
  nextSteps: z.array(z.object({
    action: z.string(),
    timeline: z.string(),
    responsible: z.string(),
    resources: z.array(z.string()),
  })),
  celebrationMilestones: z.array(z.object({
    milestone: z.string(),
    achieved: z.boolean(),
    celebration: z.string(),
  })),
});

export const analyzeLiquidMetalProgress = ai.defineFlow(
  {
    name: 'analyzeLiquidMetalProgress',
    inputSchema: ProgressTrackerInput,
    outputSchema: ProgressTrackerOutput,
  },
  async (input) => {
    const { studentId, learningPath, currentGoals, specialNeeds } = input;

    const prompt = `
      Analyze progress for a student with Down syndrome using the following data:
      
      Student Profile:
      - ID: ${studentId}
      - Special Needs: ${JSON.stringify(specialNeeds, null, 2)}
      - Current Goals: ${currentGoals.join(', ')}
      
      Learning Progress:
      ${learningPath.map(module => `
        Module: ${module.moduleName}
        Status: ${module.completionStatus}
        Time Spent: ${module.timeSpent} minutes
        Scores: ${module.assessmentScores.join(', ')}
        Engagement: ${module.engagementLevel}%
        Accommodations: ${module.accommodationsUsed.join(', ')}
        Challenges: ${module.challenges?.join(', ') || 'None identified'}
        Strengths: ${module.strengths?.join(', ') || 'None identified'}
      `).join('\n')}
      
      Analysis Requirements:
      1. Identify patterns in learning and engagement
      2. Recognize strengths and celebrate progress
      3. Identify areas needing additional support
      4. Recommend specific accommodations and adjustments
      5. Suggest next steps for continued growth
      6. Include celebration opportunities for milestones
      7. Consider attention span and cognitive level
      8. Account for preferred learning styles
      9. Provide actionable recommendations
      10. Include timeline and implementation guidance
      
      Generate comprehensive progress analysis with recommendations and next steps.
    `;

    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt,
      config: {
        temperature: 0.6,
        maxOutputTokens: 2000,
      },
    });

    try {
      return JSON.parse(result.text);
    } catch (error) {
      // Calculate basic metrics if JSON parsing fails
      const completedModules = learningPath.filter(m => m.completionStatus === 'completed' || m.completionStatus === 'mastered').length;
      const totalModules = learningPath.length;
      const overallProgress = (completedModules / totalModules) * 100;
      
      const avgScore = learningPath.reduce((acc, module) => {
        const moduleAvg = module.assessmentScores.length > 0 
          ? module.assessmentScores.reduce((a, b) => a + b, 0) / module.assessmentScores.length 
          : 0;
        return acc + moduleAvg;
      }, 0) / totalModules;

      return {
        analysis: {
          overallProgress,
          strengthAreas: ['Engagement', 'Participation'],
          challengeAreas: ['Some concepts need reinforcement'],
          learningTrends: [{
            area: 'Overall Progress',
            trend: 'improving',
            confidence: 0.8
          }],
          engagementPatterns: [{
            pattern: 'Interactive activities',
            frequency: 0.8,
            impact: 'positive'
          }]
        },
        recommendations: [{
          category: 'Learning Support',
          priority: 'medium',
          recommendation: 'Increase visual supports',
          rationale: 'Enhances understanding',
          implementation: 'Add more visual cues to activities'
        }],
        adjustments: {
          accommodations: [{
            accommodation: 'Extended time',
            reason: 'Processing needs',
            implementation: 'Add 50% more time for assessments'
          }],
          pacing: {
            current: 'Standard',
            recommended: 'Flexible',
            adjustment: 'Allow self-paced progression'
          },
          content: []
        },
        nextSteps: [{
          action: 'Continue with next module',
          timeline: 'Next week',
          responsible: 'Teacher',
          resources: ['Adaptive materials', 'Assistive technology']
        }],
        celebrationMilestones: [{
          milestone: 'Completed first module',
          achieved: true,
          celebration: 'Digital badge and praise'
        }]
      };
    }
  }
);

export type { ProgressTrackerInput, ProgressTrackerOutput };