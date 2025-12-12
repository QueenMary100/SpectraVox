import { NextResponse } from 'next/server';
import { generateLiquidMetalContent } from '@/ai/flows/liquidmetal-content-generator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = await generateLiquidMetalContent({
      topic: body.topic,
      ageGroup: body.ageGroup || 'All ages',
      contentType: 'assessment',
      learningObjective: `Assess understanding of ${body.topic} safety rules`,
      specialNeeds: {
        cognitiveLevel: 'moderate',
        attentionSpan: '10-15 minutes',
        preferredLearningStyle: ['visual', 'auditory'],
        sensoryNeeds: ['visual_support', 'simple_language', 'clear_instructions']
      },
      duration: '10 minutes'
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating safety assessment:', error);
    
    // Return a fallback assessment structure
    const fallbackAssessment = {
      content: {
        title: `${body.topic || 'Safety'} Check-Up`,
        description: `Let's see what you learned about staying safe!`,
        learningObjectives: [
          `Understand dangers of ${body.topic || 'safety topics'}`,
          'Know what to do to stay safe',
          'Remember to tell grown-ups'
        ],
        steps: [{
          stepNumber: 1,
          title: 'Safety Questions',
          instructions: 'Answer these questions about staying safe',
          visualAids: ['Simple pictures', 'Yes/No options'],
          interactions: ['touch', 'voice'],
          adaptations: ['Extra time', 'Visual supports', 'Simple language']
        }],
        assessment: {
          type: 'safety_check',
          questions: [
            {
              question: `Is ${body.topic || 'this'} dangerous?`,
              type: 'yes-no',
              correctAnswer: 'yes',
              hints: ['Think about what we learned', 'Remember the warning signs'],
              visualSupport: 'Warning signs and symbols'
            },
            {
              question: 'What should you do if you see danger?',
              type: 'multiple-choice',
              options: ['Tell a grown-up', 'Keep it secret', 'Investigate alone', 'Run away'],
              correctAnswer: 'Tell a grown-up',
              hints: ['Grown-ups help keep you safe', 'Always tell someone you trust']
            }
          ],
          successCriteria: 'Answer all questions correctly'
        },
        adaptations: {
          visual: ['Large warning signs', 'Simple yes/no options'],
          auditory: ['Read questions aloud', 'Voice answer options'],
          physical: ['Big touch targets', 'Simple gestures'],
          cognitive: ['Simple language', 'One question at a time', 'Clear instructions']
        }
      },
      accessibilityFeatures: [
        {
          feature: 'Safety-focused language',
          implementation: 'Simple, clear warnings and instructions'
        }
      ],
      extensionActivities: [
        {
          title: 'Safety Practice',
          description: 'Practice what to do in different situations',
          difficulty: 'Easy'
        }
      ]
    };

    return NextResponse.json(fallbackAssessment);
  }
}