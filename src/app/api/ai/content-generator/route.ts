import { NextResponse } from 'next/server';
import { generateLiquidMetalContent } from '@/ai/flows/liquidmetal-content-generator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = await generateLiquidMetalContent({
      topic: body.topic,
      ageGroup: body.ageGroup,
      contentType: body.contentType,
      learningObjective: body.learningObjective,
      specialNeeds: body.specialNeeds,
      duration: body.duration,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating content:', error);
    
    // Return a fallback structure even on error
    const fallbackContent = {
      content: {
        title: body.topic || 'Learning Activity',
        description: `A fun ${body.contentType || 'activity'} about ${body.topic || 'learning'}`,
        learningObjectives: [body.learningObjective || 'Learn and have fun'],
        materials: ['Digital device', 'Curiosity'],
        steps: [{
          stepNumber: 1,
          title: 'Getting Started',
          instructions: `Welcome to this ${body.contentType || 'activity'} about ${body.topic || 'learning'}!`,
          visualAids: ['Colorful images', 'Clear instructions'],
          interactions: ['touch', 'visual'],
          adaptations: ['Extra time', 'Visual support']
        }],
        assessment: {
          type: 'interactive',
          questions: [{
            question: 'Did you enjoy this activity?',
            type: 'multiple-choice',
            options: ['Yes, it was fun!', 'It was okay', 'I need more practice'],
            hints: ['Any answer is great!'],
            visualSupport: 'Friendly interface'
          }],
          successCriteria: 'Participation and engagement'
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
          title: 'Practice More',
          description: 'Try similar activities',
          difficulty: 'Easy'
        }
      ]
    };

    return NextResponse.json(fallbackContent);
  }
}