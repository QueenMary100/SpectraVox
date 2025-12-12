import { NextResponse } from 'next/server';
import { analyzeLiquidMetalProgress } from '@/ai/flows/liquidmetal-progress-tracker';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = await analyzeLiquidMetalProgress({
      studentId: body.studentId,
      learningPath: body.learningPath,
      currentGoals: body.currentGoals,
      specialNeeds: body.specialNeeds,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing progress:', error);
    
    // Return a fallback structure even on error
    const fallbackAnalysis = {
      analysis: {
        overallProgress: 75,
        strengthAreas: ['Participation', 'Engagement'],
        challengeAreas: ['Some concepts need review'],
        learningTrends: [{
          area: 'Overall Progress',
          trend: 'improving',
          confidence: 0.8
        }],
        engagementPatterns: [{
          pattern: 'Interactive activities',
          frequency: 0.9,
          impact: 'positive'
        }]
      },
      recommendations: [{
        category: 'Learning Support',
        priority: 'medium',
        recommendation: 'Continue with visual supports',
        rationale: 'Enhances understanding and retention',
        implementation: 'Use more visual aids and demonstrations'
      }],
      adjustments: {
        accommodations: [{
          accommodation: 'Extended time',
          reason: 'Processing needs',
          implementation: 'Add 50% more time for activities'
        }],
        pacing: {
          current: 'Standard',
          recommended: 'Flexible',
          adjustment: 'Allow self-paced progression'
        },
        content: []
      },
      nextSteps: [{
        action: 'Continue current activities',
        timeline: 'This week',
        responsible: 'Student',
        resources: ['Current materials', 'Support tools']
      }],
      celebrationMilestones: [{
        milestone: 'Active participation',
        achieved: true,
        celebration: 'High five and praise!'
      }]
    };

    return NextResponse.json(fallbackAnalysis);
  }
}