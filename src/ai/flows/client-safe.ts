// Client-safe imports - no Genkit imports
export interface ContentGeneratorInput {
  topic: string;
  ageGroup: string;
  contentType: 'lesson' | 'activity' | 'game' | 'assessment' | 'video';
  learningObjective: string;
  specialNeeds: {
    cognitiveLevel?: string;
    attentionSpan?: string;
    preferredLearningStyle?: string[];
    sensoryNeeds?: string[];
  };
  duration: string;
}

export interface ContentGeneratorOutput {
  content: {
    title: string;
    description: string;
    learningObjectives: string[];
    materials: string[];
    steps: Array<{
      stepNumber: number;
      title: string;
      instructions: string;
      visualAids?: string[];
      audioCues?: string[];
      interactions?: string[];
      adaptations?: string[];
    }>;
    assessment: {
      type: string;
      questions: Array<{
        question: string;
        type: string;
        options?: string[];
        correctAnswer?: string;
        hints?: string[];
        visualSupport?: string;
      }>;
      successCriteria: string;
    };
    adaptations: {
      visual: string[];
      auditory: string[];
      physical: string[];
      cognitive: string[];
    };
  };
  accessibilityFeatures: Array<{
    feature: string;
    implementation: string;
  }>;
  extensionActivities: Array<{
    title: string;
    description: string;
    difficulty: string;
  }>;
}

// Client function to call API
export const generateLiquidMetalContent = async (input: ContentGeneratorInput): Promise<ContentGeneratorOutput> => {
  try {
    const response = await fetch('/api/ai/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error generating content:', error);
    // Return fallback content
    return getFallbackContent(input);
  }
};

// Fallback content generation
function getFallbackContent(input: ContentGeneratorInput): ContentGeneratorOutput {
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