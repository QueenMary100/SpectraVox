'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Smile, Frown, Meh, Send, Camera } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const moods = [
  { mood: 'Happy', icon: Smile, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/50' },
  { mood: 'Neutral', icon: Meh, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/50' },
  { mood: 'Anxious', icon: Frown, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/50' },
  { mood: 'Sad', icon: Frown, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/50' },
];

export default function DailyCheckinPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleSubmit = () => {
    if (!selectedMood) {
        toast({
            variant: "destructive",
            title: "Uh oh!",
            description: "Please select a mood before submitting.",
        });
        return;
    }
    // In a real app, you would save this to a database
    console.log(`Mood submitted: ${selectedMood}`);
    toast({
        title: "Check-in Complete!",
        description: `Thank you for sharing your mood today.`,
    });
    router.push('/student');
  };

  const handleAnalyzePhoto = () => {
    // Placeholder for AI analysis
    toast({
      title: 'Analyzing Emotion...',
      description: 'This feature is coming soon!',
    });
     // Simulate analysis and then set mood
    setTimeout(() => {
        setSelectedMood('Happy');
        toast({
            title: 'Emotion Detected!',
            description: 'We detected that you are feeling Happy!',
        });
    }, 1500)
  }

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl font-headline">
        Daily Check-in
      </h1>
      <div className="flex-1 flex items-start justify-center">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">How are you feeling today, Alex?</CardTitle>
            <CardDescription>
              Select an emotion below, or let us guess from your photo!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 w-full">
                    {moods.map(({ mood, icon: Icon, color, bgColor }) => (
                        <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={cn(
                            'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                            selectedMood === mood
                            ? 'border-primary ring-4 ring-primary/50'
                            : 'border-transparent hover:border-primary/50',
                            bgColor
                        )}
                        >
                        <Icon className={cn('w-12 h-12', color)} strokeWidth={1.5} />
                        <span className="font-semibold">{mood}</span>
                        </button>
                    ))}
                    </div>
                     <Button
                        size="lg"
                        className="w-full h-16 text-xl"
                        onClick={handleSubmit}
                        disabled={!selectedMood}
                        >
                        <Send className="mr-4 h-6 w-6" />
                        Submit Mood
                    </Button>
                </div>
                 <div className="space-y-4 flex flex-col">
                    <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                       <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                    </div>
                     {!hasCameraPermission && (
                        <Alert variant="destructive">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access to use the photo analysis feature.
                            </AlertDescription>
                        </Alert>
                    )}
                     <Button
                        size="lg"
                        className="w-full h-16 text-xl"
                        onClick={handleAnalyzePhoto}
                        disabled={!hasCameraPermission}
                        >
                        <Camera className="mr-4 h-6 w-6" />
                        Analyze Photo
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
