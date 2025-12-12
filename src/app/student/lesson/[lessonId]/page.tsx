'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Volume2,
  Repeat,
  Home,
  BookCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { LessonStep } from '@/lib/types';
import Link from 'next/link';

// Mock data for a lesson
const lessonSteps: LessonStep[] = [
  {
    id: 'step-1',
    lessonId: 'solar-system',
    order: 1,
    concept: 'This is the Sun. It is a big, hot star.',
    imageUrl: PlaceHolderImages.find(p => p.id === 'lesson-planets-1')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'lesson-planets-1')?.imageHint || '',
    audioUrl: '/audio/placeholder.mp3',
  },
  {
    id: 'step-2',
    lessonId: 'solar-system',
    order: 2,
    concept: 'This is Earth. It is our home.',
    imageUrl: PlaceHolderImages.find(p => p.id === 'lesson-planets-2')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'lesson-planets-2')?.imageHint || '',
    audioUrl: '/audio/placeholder.mp3',
  },
  {
    id: 'step-3',
    lessonId: 'solar-system',
    order: 3,
    concept: 'This is Mars. It is the red planet.',
    imageUrl: PlaceHolderImages.find(p => p.id === 'lesson-planets-3')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'lesson-planets-3')?.imageHint || '',
    audioUrl: '/audio/placeholder.mp3',
  },
];

export default function LessonPlayerPage({ params }: { params: { lessonId: string } }) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = lessonSteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / lessonSteps.length) * 100;

  const playAudio = () => {
    // In a real app, you would use a library like howler.js
    // to play the audio from currentStep.audioUrl
    console.log('Playing audio for:', currentStep.concept);
    const utterance = new SpeechSynthesisUtterance(currentStep.concept);
    speechSynthesis.speak(utterance);
  };
  
  const handleNext = () => {
    if (currentStepIndex < lessonSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  if (isFinished) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center gap-8">
            <h1 className="text-4xl font-bold font-headline text-primary">Great Job!</h1>
            <p className="text-xl text-muted-foreground">You finished the lesson about Our Solar System.</p>
            <BookCheck className="w-24 h-24 text-green-500" />
            <div className="flex gap-4 mt-8">
                <Button size="lg" variant="outline" asChild>
                    <Link href="/student">
                        <Home className="mr-2 h-6 w-6" />
                        Back to Dashboard
                    </Link>
                </Button>
                <Button size="lg" onClick={() => router.push(`/student/exam/solar-system-exam`)}>
                    <BookCheck className="mr-2 h-6 w-6" />
                    Start Exam
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 md:p-8">
      <Progress value={progress} className="w-full max-w-4xl" />

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <Card className="w-full max-w-4xl shadow-2xl">
          <CardContent className="p-4 md:p-8">
            <div className="aspect-video w-full relative overflow-hidden rounded-lg mb-8">
              <Image
                src={currentStep.imageUrl}
                alt={currentStep.concept}
                fill
                className="object-cover"
                data-ai-hint={currentStep.imageHint}
              />
            </div>
            <p className="text-2xl md:text-4xl text-center font-bold min-h-[4rem]">
              {currentStep.concept}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl mt-8">
        <Button
          variant="ghost"
          className="h-24 md:h-32 text-6xl"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          aria-label="Previous Step"
        >
          <ArrowLeftCircle className="w-16 h-16 md:w-24 md:h-24" strokeWidth={1.5}/>
        </Button>
        
        <div className='flex gap-4 justify-center'>
            <Button
                variant="ghost"
                className="h-24 md:h-32 text-6xl"
                onClick={playAudio}
                aria-label="Play Audio"
                >
                <Volume2 className="w-16 h-16 md:w-24 md:h-24 text-accent" strokeWidth={1.5}/>
            </Button>
            <Button
                variant="ghost"
                className="h-24 md:h-32 text-6xl"
                onClick={playAudio}
                aria-label="Repeat Audio"
                >
                <Repeat className="w-16 h-16 md:w-24 md:h-24 text-accent" strokeWidth={1.5}/>
            </Button>
        </div>

        <Button
          variant="ghost"
          className="h-24 md:h-32 text-6xl"
          onClick={handleNext}
          aria-label="Next Step"
        >
          <ArrowRightCircle className="w-16 h-16 md:w-24 md:h-24" strokeWidth={1.5}/>
        </Button>
      </div>
    </div>
  );
}
