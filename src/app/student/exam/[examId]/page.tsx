'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Home, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Question } from '@/lib/types';

// Mock data for an exam
const examQuestions: Question[] = [
  {
    id: 'q1',
    examId: 'solar-system-exam',
    questionType: 'multiple-choice',
    questionText: 'Which one is the Sun?',
    options: [
        { id: 'q1-opt1', text: 'Sun' },
        { id: 'q1-opt2', text: 'Earth' },
    ],
    correctAnswerId: 'q1-opt1',
    explanation: 'The Sun is the big, hot star in the center of our solar system.',
  },
  {
    id: 'q2',
    examId: 'solar-system-exam',
    questionType: 'image-based',
    questionText: 'Which one is our home?',
    options: [
        { id: 'q2-opt1', imageUrl: 'https://picsum.photos/seed/lesson-mars/400/300', imageHint: 'mars illustration' },
        { id: 'q2-opt2', imageUrl: 'https://picsum.photos/seed/lesson-earth/400/300', imageHint: 'earth illustration' },
    ],
    correctAnswerId: 'q2-opt2',
    explanation: 'Earth is our home planet.',
  },
];

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export default function ExamPlayerPage({ params }: { params: { examId: string } }) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = examQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / examQuestions.length) * 100;
  
  const handleAnswerSelect = (optionId: string) => {
    if (answerState !== 'unanswered') return;
    setSelectedAnswer(optionId);
    if (optionId === currentQuestion.correctAnswerId) {
        setAnswerState('correct');
        setScore(score + 1);
    } else {
        setAnswerState('incorrect');
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setAnswerState('unanswered');
    } else {
        setIsFinished(true);
    }
  };

  const getOptionClasses = (optionId: string) => {
    if (answerState === 'unanswered') {
        return 'border-muted hover:border-primary';
    }
    if (optionId === currentQuestion.correctAnswerId) {
        return 'border-green-500 ring-4 ring-green-500/50';
    }
    if (optionId === selectedAnswer && optionId !== currentQuestion.correctAnswerId) {
        return 'border-destructive ring-4 ring-destructive/50';
    }
    return 'border-muted opacity-50';
  }

  if (isFinished) {
    const finalScore = (score / examQuestions.length) * 100;
    return (
        <div className="flex flex-col items-center justify-center h-full text-center gap-6">
            <h1 className="text-4xl font-bold font-headline text-primary">Exam Complete!</h1>
            <p className="text-xl text-muted-foreground">You scored</p>
            <p className="text-7xl font-bold">{finalScore.toFixed(0)}%</p>
            <div className="flex gap-4 mt-8">
                <Button size="lg" variant="outline" asChild>
                    <Link href="/student">
                        <Home className="mr-2 h-6 w-6" />
                        Back to Dashboard
                    </Link>
                </Button>
                 <Button size="lg" asChild>
                    <Link href="/guardian">
                        <BarChart3 className="mr-2 h-6 w-6" />
                        View Progress
                    </Link>
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 md:p-8">
        <Progress value={progress} className="w-full max-w-4xl mb-8" />
        <Card className="w-full max-w-4xl flex-1 flex flex-col">
            <CardHeader>
                <CardTitle className="text-2xl md:text-4xl text-center font-bold p-8">
                    {currentQuestion.questionText}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
                {currentQuestion.options.map(option => (
                    <button 
                        key={option.id}
                        onClick={() => handleAnswerSelect(option.id)}
                        disabled={answerState !== 'unanswered'}
                        className={cn(
                            "border-4 rounded-lg overflow-hidden transition-all duration-300 relative aspect-video flex items-center justify-center p-4",
                            getOptionClasses(option.id)
                        )}
                    >
                        {currentQuestion.questionType === 'image-based' && option.imageUrl ? (
                             <Image src={option.imageUrl} alt={option.id} fill className="object-cover" data-ai-hint={option.imageHint} />
                        ) : (
                            <span className="text-3xl font-bold">{option.text}</span>
                        )}
                         {answerState !== 'unanswered' && option.id === currentQuestion.correctAnswerId && (
                           <CheckCircle2 className="absolute top-4 right-4 w-12 h-12 text-white bg-green-500 rounded-full p-1" />
                        )}
                        {answerState === 'incorrect' && option.id === selectedAnswer && (
                           <XCircle className="absolute top-4 right-4 w-12 h-12 text-white bg-destructive rounded-full p-1" />
                        )}
                    </button>
                ))}
            </CardContent>
        </Card>
        
        {answerState !== 'unanswered' && (
             <div className="w-full max-w-4xl mt-8 flex flex-col items-center gap-4">
                <Card className={cn(
                    "w-full",
                    answerState === 'correct' ? 'bg-green-100 dark:bg-green-900/50 border-green-300' : 'bg-red-100 dark:bg-red-900/50 border-red-300'
                )}>
                    <CardContent className="p-6 text-center">
                        <h3 className="text-2xl font-bold mb-2">{answerState === 'correct' ? 'Correct!' : 'Not quite!'}</h3>
                        <p className="text-lg">{currentQuestion.explanation}</p>
                    </CardContent>
                </Card>
                <Button size="lg" className="w-full max-w-xs h-16 text-2xl" onClick={handleNext}>
                    Next
                </Button>
            </div>
        )}
    </div>
  );
}
