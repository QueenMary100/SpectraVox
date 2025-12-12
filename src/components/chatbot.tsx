'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, Send, X, Volume2, Waves, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { chatbot } from '@/ai/flows/chatbot';
import { textToSpeech } from '@/ai/flows/tts';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';

type Message = {
  text: string;
  isUser: boolean;
  audioDataUri?: string;
  isPlaying?: boolean;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayAudio = (audioDataUri: string, messageIndex: number) => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      // If the same audio is clicked again, just stop it.
      if (messages[messageIndex].isPlaying) {
        setMessages(prev =>
          prev.map((msg, idx) => ({ ...msg, isPlaying: idx === messageIndex ? false : undefined }))
        );
        return;
      }
    }
    
    setMessages(prev =>
        prev.map((msg, idx) => ({ ...msg, isPlaying: idx === messageIndex }))
    );

    const audio = new Audio(audioDataUri);
    audioRef.current = audio;
    audio.play();
    audio.onended = () => {
      setMessages(prev =>
        prev.map((msg, idx) => (idx === messageIndex ? { ...msg, isPlaying: false } : msg))
      );
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatbot({ message: input });
      
      if (result.navigation) {
        router.push(result.navigation);
        toast({
            title: "Navigating...",
            description: `Taking you to the ${result.navigation.split('/').pop()} page.`,
        });
        setIsOpen(false);
      }

      const ttsResult = await textToSpeech({ text: result.response });

      const botMessage: Message = {
        text: result.response,
        isUser: false,
        audioDataUri: ttsResult.audioDataUri,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        text: "I'm sorry, I'm having trouble connecting. Please try again later.",
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                 <Button
                    variant="default"
                    size="icon"
                    className="rounded-full h-16 w-16 shadow-lg"
                    >
                    {isOpen ? <ChevronDown className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
                    <span className="sr-only">Chat with AptX Ai</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                sideOffset={16} 
                align="end"
                className="w-[80vw] max-w-[400px] h-[60vh] p-0"
            >
                <Card className='h-full w-full flex flex-col shadow-2xl border-none'>
                    <CardHeader className='border-b'>
                        <CardTitle className="flex items-center gap-2">
                            <Bot /> 
                            AptX Ai
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='flex-1 p-0'>
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                key={index}
                                className={cn(
                                    'flex items-start gap-3',
                                    message.isUser ? 'justify-end' : ''
                                )}
                                >
                                {!message.isUser && (
                                    <Avatar className='w-8 h-8'>
                                        <AvatarFallback>
                                            <Bot className='w-5 h-5'/>
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                    'rounded-lg px-3 py-2 max-w-[85%] flex items-center gap-2',
                                    message.isUser
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                    )}
                                >
                                    <p className="text-sm">{message.text}</p>
                                    {!message.isUser && message.audioDataUri && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => handlePlayAudio(message.audioDataUri!, index)}>
                                        {message.isPlaying ? <Waves className="h-4 w-4 animate-pulse" /> : <Volume2 className="h-4 w-4" />}
                                        </Button>
                                    )}
                                </div>
                                </div>
                            ))}
                            {isLoading && (
                                    <div className="flex items-start gap-3">
                                        <Avatar className='w-8 h-8'>
                                            <AvatarFallback>
                                                <Bot className='w-5 h-5'/>
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%] flex items-center">
                                            <Loader2 className="w-5 h-5 animate-spin"/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className='p-4 border-t'>
                        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                            <Input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </PopoverContent>
        </Popover>
    </div>
  );
}
