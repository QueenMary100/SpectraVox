import { NextResponse } from 'next/server';
import { generateAdaptiveLearningPath } from '@/ai/flows/liquidmetal-adaptive-learning';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = await generateAdaptiveLearningPath({
      studentId: body.studentId,
      ageGroup: body.ageGroup,
      currentLevel: body.currentLevel,
      learningGoals: body.learningGoals,
      specialNeeds: body.specialNeeds,
      subjectArea: body.subjectArea,
    });

    // Ensure the response has the expected structure
    const adaptivePath = {
      personalizedPath: result.personalizedPath || {
        level: body.currentLevel || 'beginner',
        modules: result.modules || [{
          title: `${body.subjectArea} - Getting Started`,
          description: `Introduction to ${body.subjectArea}`,
          activities: [{
            type: 'interactive',
            instructions: 'Welcome to your learning journey!',
            adaptations: body.specialNeeds?.accommodations || ['Visual support'],
            estimatedTime: '15-20 minutes',
            interactions: ['touch', 'visual']
          }],
          assessments: [{
            type: 'formative',
            questions: ['Basic understanding'],
            adaptiveHints: ['Visual hints available'],
            successCriteria: 'Complete with guidance'
          }]
        }],
        progressionCriteria: {
          completionThreshold: 80,
          masteryIndicators: ['Engagement', 'Participation'],
          nextSteps: ['Continue learning']
        }
      },
      accommodations: result.accommodations || {
        visual: ['Large text', 'High contrast', 'Visual schedules'],
        auditory: ['Audio instructions', 'Sound cues', 'Repetition'],
        interactive: ['Touch interface', 'Simple gestures', 'Voice commands'],
        timing: ['Extended time', 'Pause options', 'Break reminders']
      },
      recommendations: result.recommendations || [{
        category: 'Getting Started',
        suggestion: 'Begin with the first activity',
        rationale: 'Build foundational understanding'
      }]
    };

    return NextResponse.json(adaptivePath);
  } catch (error) {
    console.error('Error generating adaptive path:', error);
    
    // Return a fallback structure even on error
    const fallbackPath = {
      personalizedPath: {
        level: 'beginner',
        modules: [{
          title: 'Getting Started',
          description: 'Welcome to your learning journey',
          activities: [{
            type: 'interactive',
            instructions: 'Let\'s begin with a simple activity',
            adaptations: ['Visual support', 'Extra time'],
            estimatedTime: '15-20 minutes',
            interactions: ['touch', 'visual']
          }],
          assessments: [{
            type: 'formative',
            questions: ['How are you feeling today?'],
            adaptiveHints: ['You can choose any answer'],
            successCriteria: 'Participation'
          }]
        }],
        progressionCriteria: {
          completionThreshold: 70,
          masteryIndicators: ['Engagement'],
          nextSteps: ['Continue exploring']
        }
      },
      accommodations: {
        visual: ['Large text', 'High contrast'],
        auditory: ['Audio instructions'],
        interactive: ['Touch interface'],
        timing: ['Extended time']
      },
      recommendations: [{
        category: 'Welcome',
        suggestion: 'Take your time and enjoy learning',
        rationale: 'Learning should be fun and stress-free'
      }]
    };

    return NextResponse.json(fallbackPath);
  }
}