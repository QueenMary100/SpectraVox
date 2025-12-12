'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, AIStatusIndicator } from '@/components/shared/page-header';
import { 
  Flame, 
  Volume2, 
  AlertTriangle, 
  Shield, 
  Home, 
  Zap,
  X,
  CheckCircle,
  PlayCircle,
  Pause,
  RotateCcw,
  Heart
} from 'lucide-react';
import { generateLiquidMetalContent } from '@/ai/flows/client-safe';

interface SafetyTopic {
  id: string;
  title: string;
  danger: string;
  description: string;
  warning: string;
  action: string;
  icon: React.ReactNode;
  color: string;
  image: string;
  dos: string[];
  donts: string[];
}

interface SafetyLearningModule {
  currentTopic: SafetyTopic | null;
  isPlaying: boolean;
  speechEnabled: boolean;
  completedTopics: string[];
  progress: number;
}

export default function SafetyPage() {
  const [module, setModule] = useState<SafetyLearningModule>({
    currentTopic: null,
    isPlaying: false,
    speechEnabled: true,
    completedTopics: [],
    progress: 0
  });
  const [loading, setLoading] = useState(false);

  const safetyTopics: SafetyTopic[] = [
    {
      id: 'fire',
      title: 'Fire Safety',
      danger: 'This is fire. It burns!',
      description: 'Fire is very hot and can hurt you. It can burn your skin and make you cry.',
      warning: 'NEVER touch fire! Stay away from things that make fire.',
      action: 'If you see fire, tell a grown-up right away!',
      icon: <Flame className="w-8 h-8 text-red-600" />,
      color: 'border-red-200 bg-red-50',
      image: '/images/safety/fire.svg',
      dos: [
        'Tell a grown-up if you see fire',
        'Stop, drop, and roll if clothes catch fire',
        'Stay low and crawl under smoke',
        'Know your emergency phone numbers'
      ],
      donts: [
        'NEVER play with matches or lighters',
        'NEVER touch hot things on the stove',
        'NEVER put things in electrical outlets',
        'NEVER hide when there is a fire'
      ]
    },
    {
      id: 'electricity',
      title: 'Electricity Safety',
      danger: 'This is electricity. It shocks!',
      description: 'Electricity can give you a big shock that hurts your body. It is very dangerous.',
      warning: 'NEVER put things in electrical outlets!',
      action: 'Only grown-ups should use electrical things.',
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      color: 'border-yellow-200 bg-yellow-50',
      image: '/images/safety/electricity.svg',
      dos: [
        'Keep water away from electricity',
        'Tell a grown-up if cords are broken',
        'Use things with grown-up help only',
        'Keep fingers away from outlets'
      ],
      donts: [
        'NEVER put fingers in outlets',
        'NEVER touch electrical cords',
        'NEVER use electrical things near water',
        'NEVER pull cords from the wall'
      ]
    },
    {
      id: 'strangers',
      title: 'Stranger Safety',
      danger: 'Strangers can be dangerous',
      description: 'A stranger is someone you do not know. Some strangers may not be safe.',
      warning: 'NEVER go with strangers!',
      action: 'Always stay with your grown-ups.',
      icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
      color: 'border-orange-200 bg-orange-50',
      image: '/images/safety/strangers.svg',
      dos: [
        'Stay with your grown-ups',
        'Say NO if you feel scared',
        'Run and tell a grown-up',
        'Know safe people to ask for help'
      ],
      donts: [
        'NEVER go with strangers',
        'NEVER take things from strangers',
        'NEVER talk to strangers alone',
        'NEVER get in cars with strangers'
      ]
    },
    {
      id: 'medicine',
      title: 'Medicine Safety',
      danger: 'Medicine can be dangerous',
      description: 'Medicine helps sick people, but the wrong medicine can hurt you very much.',
      warning: 'NEVER take medicine by yourself!',
      action: 'Only take medicine from your grown-ups.',
      icon: <Heart className="w-8 h-8 text-pink-600" />,
      color: 'border-pink-200 bg-pink-50',
      image: '/images/safety/medicine.svg',
      dos: [
        'Only take medicine from grown-ups',
        'Tell grown-ups if you find medicine',
        'Keep medicine in safe places',
        'Ask grown-ups when you need medicine'
      ],
      donts: [
        'NEVER take medicine alone',
        'NEVER share medicine with friends',
        'NEVER eat medicine like candy',
        'NEVER play with medicine bottles'
      ]
    }
  ];

  useEffect(() => {
    generateSafetyContent();
  }, []);

  const generateSafetyContent = async () => {
    setLoading(true);
    try {
      // Generate additional safety content using AI
      for (const topic of safetyTopics) {
        const content = await generateLiquidMetalContent({
          topic: topic.title,
          ageGroup: 'All ages',
          contentType: 'lesson',
          learningObjective: `Understand ${topic.title} and stay safe`,
          specialNeeds: {
            cognitiveLevel: 'moderate',
            attentionSpan: '15-20 minutes',
            preferredLearningStyle: ['visual', 'auditory'],
            sensoryNeeds: ['visual_support', 'audio_support', 'simple_language']
          },
          duration: '15 minutes'
        });
        console.log(`Generated content for ${topic.title}:`, content);
      }
    } catch (error) {
      console.error('Error generating safety content:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!module.speechEnabled || 'speechSynthesis' in window === false) return;
    
    // Cancel any existing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8; // Slower rate for better comprehension
    utterance.pitch = 1.1; // Slightly higher pitch for engagement
    utterance.volume = 1.0;
    
    // Use a female voice which is often preferred for educational content
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen') ||
      voice.name.includes('Alex')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const startTopic = (topic: SafetyTopic) => {
    setModule(prev => ({
      ...prev,
      currentTopic: topic,
      isPlaying: true
    }));
    
    // Automatically read the danger message
    setTimeout(() => {
      speakText(`${topic.danger}. ${topic.description}. ${topic.warning}. ${topic.action}`);
    }, 500);
  };

  const repeatInstructions = () => {
    if (module.currentTopic) {
      const topic = module.currentTopic;
      speakText(`${topic.danger}. ${topic.description}. ${topic.warning}. ${topic.action}`);
    }
  };

  const markTopicCompleted = () => {
    if (!module.currentTopic) return;
    
    setModule(prev => {
      const newCompleted = [...prev.completedTopics, prev.currentTopic!.id];
      const newProgress = (newCompleted.length / safetyTopics.length) * 100;
      
      return {
        ...prev,
        completedTopics: newCompleted,
        progress: newProgress,
        currentTopic: null,
        isPlaying: false
      };
    });
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    // Celebration message
    speakText('Great job! You learned how to stay safe. You are amazing!');
  };

  const toggleSpeech = () => {
    setModule(prev => ({ ...prev, speechEnabled: !prev.speechEnabled }));
    if (module.isPlaying) {
      window.speechSynthesis.cancel();
    }
  };

  const stopLearning = () => {
    setModule(prev => ({ ...prev, currentTopic: null, isPlaying: false }));
    window.speechSynthesis.cancel();
  };

  if (module.currentTopic) {
    return (
      <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
        <div className="mb-4">
          <Button variant="outline" onClick={stopLearning} className="mb-4">
            ← Back to Safety Topics
          </Button>
        </div>
        
        <Card className={`border-2 ${module.currentTopic.color}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {module.currentTopic.icon}
            </div>
            <CardTitle className="text-3xl font-bold text-red-600 mb-2">
              {module.currentTopic.danger}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Main Danger Message */}
            <div className="text-center p-6 bg-red-100 rounded-lg">
              <p className="text-2xl font-semibold text-red-800 mb-4">
                {module.currentTopic.description}
              </p>
              <p className="text-xl font-bold text-red-900">
                {module.currentTopic.warning}
              </p>
            </div>

            {/* Action Required */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-medium text-blue-800">
                {module.currentTopic.action}
              </p>
            </div>

            {/* Visual */}
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">
                  {module.currentTopic.icon}
                </div>
                <p className="text-gray-600">
                  {module.currentTopic.title}
                </p>
              </div>
            </div>

            {/* Dos */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-green-700">✅ What to DO:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {module.currentTopic.dos.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-green-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Don'ts */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-red-700">❌ What NOT to DO:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {module.currentTopic.donts.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={repeatInstructions}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Read Again
              </Button>
              
              <Button 
                onClick={() => speakText(module.currentTopic!.description)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Listen Again
              </Button>
              
              <Button 
                onClick={markTopicCompleted}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                I Understand!
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Safety Learning"
        description="Learn how to stay safe at home and outside. Important lessons for keeping you safe!"
        showAIIndicators={true}
        badges={[
          { text: `${safetyTopics.length} Topics`, variant: "secondary" },
          { text: `${module.completedTopics.length} Completed`, variant: "outline" }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleSpeech}
              variant={module.speechEnabled ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              {module.speechEnabled ? 'Sound On' : 'Sound Off'}
            </Button>
            
            {module.progress > 0 && (
              <div className="text-sm font-medium">
                Progress: {Math.round(module.progress)}%
              </div>
            )}
          </div>
        }
      />

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 animate-pulse text-blue-600" />
            <p>Preparing your safety lessons...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Progress */}
          {module.progress > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Your Safety Learning Progress</h3>
                  <span className="text-sm font-medium">{Math.round(module.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Great job! You're learning how to stay safe!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Safety Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyTopics.map((topic) => {
              const isCompleted = module.completedTopics.includes(topic.id);
              
              return (
                <Card 
                  key={topic.id}
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    isCompleted ? 'border-green-200 bg-green-50' : topic.color
                  }`}
                  onClick={() => !isCompleted && startTopic(topic)}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      {topic.icon}
                      {isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-600 ml-2" />
                      )}
                    </div>
                    <CardTitle className="text-xl">{topic.title}</CardTitle>
                    <CardDescription>
                      {isCompleted ? '✅ Completed!' : 'Click to learn'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {!isCompleted && (
                      <Button 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          startTopic(topic);
                        }}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Learn Safety
                      </Button>
                    )}
                    
                    {isCompleted && (
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          startTopic(topic);
                        }}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Remember These Safety Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Home className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Always tell a grown-up</h4>
                    <p className="text-sm text-gray-600">If you see something dangerous or scary</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Heart className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Stay with your family</h4>
                    <p className="text-sm text-gray-600">Grown-ups keep you safe</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Say NO when scared</h4>
                    <p className="text-sm text-gray-600">It's okay to say no to stay safe</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Ask for help</h4>
                    <p className="text-sm text-gray-600">Grown-ups are here to help you</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}