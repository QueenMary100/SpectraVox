import { NextResponse } from 'next/server';
import { generateLiquidMetalContent } from '@/ai/flows/liquidmetal-content-generator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await generateLiquidMetalContent(body);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Content generation error:', error);
    
    // Return fallback content
    const fallbackContent = getFallbackContent(body);
    
    return NextResponse.json({
      success: false,
      data: fallbackContent,
      error: 'Content generation failed, using fallback content'
    });
  }
}

function getFallbackContent(input: any) {
  return {
    content: {
      title: `${input.topic} - ${input.ageGroup}`,
      description: `Adaptive ${input.contentType} for ${input.ageGroup} with Down syndrome`,
      learningObjectives: [input.learningObjective],
      materials: ['Digital device', 'Interactive elements'],
      steps: [{
        stepNumber: 1,
        title: 'Introduction',
        instructions: `Welcome to learning about ${input.topic}. This is designed for ${input.ageGroup} with special needs adaptations.`,
        visualAids: ['Icons', 'Images', 'Visual schedules'],
        audioCues: ['Gentle sounds', 'Voice prompts'],
        interactions: ['Touch', 'Voice', 'Simple gestures'],
        adaptations: ['Extended time', 'Simplified instructions', 'Visual supports']
      }],
      assessment: {
        type: 'Interactive',
        questions: [{
          question: `Can you show me what you learned about ${input.topic}?`,
          type: 'interactive',
          hints: ['Use visual supports', 'Take your time'],
          visualSupport: 'Clear visual aids available'
        }],
        successCriteria: 'Student demonstrates understanding through preferred method'
      },
      adaptations: {
        visual: ['Large text', 'High contrast', 'Visual schedules', 'Picture symbols'],
        auditory: ['Audio instructions', 'Sound cues', 'Repetition'],
        physical: ['Touch interface', 'Simple gestures', 'Large touch targets'],
        cognitive: ['Step-by-step', 'Clear structure', 'Consistent routines']
      }
    },
    accessibilityFeatures: [
      {
        feature: 'Screen reader support',
        implementation: 'ARIA labels and comprehensive alt text'
      },
      {
        feature: 'Keyboard navigation',
        implementation: 'Full keyboard accessibility with tab stops'
      },
      {
        feature: 'High contrast mode',
        implementation: 'WCAG AAA compliant color schemes'
      }
    ],
    extensionActivities: [
      {
        title: 'Practice Activity',
        description: 'Reinforce learning through hands-on practice',
        difficulty: 'Easy'
      },
      {
        title: 'Review Session',
        description: 'Go over key concepts with visual supports',
        difficulty: 'Easy'
      }
    ]
  };
}