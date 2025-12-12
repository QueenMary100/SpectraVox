'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Eye, 
  Clock, 
  Brain, 
  CheckCircle, 
  Star,
  Settings,
  Lightbulb
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  type: 'interactive' | 'video' | 'game' | 'assessment';
  instructions: string;
  adaptations: string[];
  estimatedTime: string;
  interactions: string[];
  completed: boolean;
  score?: number;
}

interface LessonModule {
  id: string;
  title: string;
  activities: Activity[];
  progress: number;
  accommodations: {
    visual: string[];
    auditory: string[];
    physical: string[];
  };
}

interface AdaptiveLearningInterfaceProps {
  courseId: string;
  moduleId: string;
  userId: string;
}

export default function AdaptiveLearningInterface({
  courseId,
  moduleId,
  userId
}: AdaptiveLearningInterfaceProps) {
  const [module, setModule] = useState<LessonModule | null>(null);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [visualMode, setVisualMode] = useState<'standard' | 'high-contrast' | 'large-text'>('standard');
  const [progress, setProgress] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadModule();
    startSessionTimer();
    return () => stopSessionTimer();
  }, []);

  const startSessionTimer = () => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  };

  const stopSessionTimer = () => {
    setSessionTime(0);
  };

  const loadModule = async () => {
    try {
      const response = await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartmemory.read',
          input: { key: `module:${courseId}:${moduleId}` }
        })
      });

      const moduleData = await response.json();

      if (moduleData && moduleData.data) {
        setModule(moduleData.data);
        if (moduleData.data.activities && moduleData.data.activities.length > 0) {
          setCurrentActivity(moduleData.data.activities[0]);
        }
      } else {
        // Generate adaptive content if not found
        await generateAdaptiveContent();
      }
    } catch (error) {
      console.error('Error loading module:', error);
    }
  };

  const generateAdaptiveContent = async () => {
    setLoading(true);
    try {
      const userResponse = await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartmemory.read',
          input: { key: `user:${userId}` }
        })
      });

      const userData = await userResponse.json();

      const contentResponse = await fetch('/api/ai/content-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Math Basics',
          ageGroup: userData.data?.ageGroup || '8-12 years',
          contentType: 'lesson',
          learningObjective: 'Understand basic counting and number recognition',
          specialNeeds: {
            cognitiveLevel: 'moderate',
            attentionSpan: '15-20 minutes',
            preferredLearningStyle: ['visual', 'kinesthetic'],
            sensoryNeeds: ['visual_support', 'audio_support']
          },
          duration: '30 minutes'
        })
      });

      const content = await contentResponse.json();

      const lessonModule: LessonModule = {
        id: moduleId,
        title: content.content?.title || 'Math Basics',
        activities: content.content?.steps?.map((step: any, index: number) => ({
          id: `activity-${index}`,
          title: step.title,
          type: 'interactive' as const,
          instructions: step.instructions,
          adaptations: step.adaptations || [],
          estimatedTime: '5-10 minutes',
          interactions: step.interactions || ['touch'],
          completed: false
        })) || [],
        progress: 0,
        accommodations: content.content?.adaptations || {
          visual: ['Large text', 'High contrast'],
          auditory: ['Audio instructions', 'Sound cues'],
          physical: ['Touch interface', 'Simple gestures']
        }
      };

      setModule(lessonModule);
      setCurrentActivity(lessonModule.activities[0]);

      // Save to Raindrop
      await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartmemory.write',
          input: {
            key: `module:${courseId}:${moduleId}`,
            value: lessonModule,
            ttl: 86400
          }
        })
      });
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeActivity = async (score: number = 100) => {
    if (!currentActivity || !module) return;

    const updatedActivity = { ...currentActivity, completed: true, score };
    const updatedActivities = module.activities.map(act => 
      act.id === currentActivity.id ? updatedActivity : act
    );

    const updatedModule = {
      ...module,
      activities: updatedActivities,
      progress: calculateProgress(updatedActivities)
    };

    setModule(updatedModule);
    setProgress(updatedModule.progress);

    // Move to next activity
    const currentIndex = updatedActivities.findIndex(act => act.id === currentActivity.id);
    const nextActivity = updatedActivities[currentIndex + 1];
    if (nextActivity && !nextActivity.completed) {
      setCurrentActivity(nextActivity);
    }

    // Save progress to Raindrop
    await fetch('/api/raindrop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: 'smartmemory.write',
        input: {
          key: `module:${courseId}:${moduleId}`,
          value: updatedModule,
          ttl: 86400
        }
      })
    });

    // Update user progress
    await updateUserProgress(updatedModule);
  };

  const calculateProgress = (activities: Activity[]) => {
    const completed = activities.filter(act => act.completed).length;
    return Math.round((completed / activities.length) * 100);
  };

  const updateUserProgress = async (moduleData: LessonModule) => {
    try {
      const learningPath = [{
        moduleId: moduleData.id,
        moduleName: moduleData.title,
        completionStatus: moduleData.progress === 100 ? 'completed' : 'in-progress',
        timeSpent: sessionTime,
        assessmentScores: moduleData.activities
          .filter(act => act.score !== undefined)
          .map(act => act.score!),
        engagementLevel: calculateEngagement(),
        accommodationsUsed: Object.values(moduleData.accommodations).flat(),
      }];

      const progressResponse = await fetch('/api/ai/progress-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: userId,
          learningPath,
          currentGoals: ['Complete math basics module'],
          specialNeeds: {
            cognitiveLevel: 'moderate',
            attentionSpan: '15-20 minutes',
            preferredLearningStyle: ['visual', 'kinesthetic']
          }
        })
      });

      const analysis = await progressResponse.json();

      // Save analysis to Raindrop
      await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartmemory.write',
          input: {
            key: `progress_analysis:${userId}`,
            value: analysis,
            ttl: 86400
          }
        })
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const calculateEngagement = () => {
    // Simple engagement calculation based on interaction time
    return Math.min(100, Math.round((sessionTime / 60) * 20));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVisualClasses = () => {
    switch (visualMode) {
      case 'high-contrast':
        return 'bg-black text-white border-white';
      case 'large-text':
        return 'text-2xl';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Brain className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Generating adaptive content...</p>
        </div>
      </div>
    );
  }

  if (!module || !currentActivity) {
    return (
      <div className="text-center p-8">
        <p>No module content available</p>
        <Button onClick={generateAdaptiveContent} className="mt-4">
          Generate Content
        </Button>
      </div>
    );
  }

  return (
    <div className={`adaptive-learning-interface ${getVisualClasses()}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{module.title}</h2>
            <p className="text-gray-600">Module Progress: {module.progress}%</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatTime(sessionTime)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHints(!showHints)}
            >
              <Lightbulb className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Progress value={module.progress} className="h-3" />
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="accommodations">Support</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {currentActivity.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {currentActivity.title}
                  </CardTitle>
                  <CardDescription>{currentActivity.type} Activity</CardDescription>
                </div>
                <Badge variant="outline">
                  {currentActivity.estimatedTime}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <p className="text-lg leading-relaxed">{currentActivity.instructions}</p>
                  {voiceEnabled && (
                    <Button variant="ghost" size="sm" className="mt-2">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Read Aloud
                    </Button>
                  )}
                </div>

                {showHints && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Hints:</h4>
                    <ul className="space-y-1">
                      {currentActivity.adaptations.map((adaptation, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Star className="w-3 h-3 mt-1 text-blue-600 flex-shrink-0" />
                          {adaptation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    onClick={() => completeActivity()}
                    disabled={currentActivity.completed}
                    size="lg"
                    className="flex-1"
                  >
                    {currentActivity.completed ? 'Completed' : 'Complete Activity'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {module.activities.map((activity, index) => (
              <Card 
                key={activity.id} 
                className={`cursor-pointer transition-all ${
                  currentActivity.id === activity.id ? 'ring-2 ring-blue-500' : ''
                } ${activity.completed ? 'bg-green-50' : ''}`}
                onClick={() => setCurrentActivity(activity)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{activity.title}</h4>
                    {activity.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.type}</p>
                  {activity.score && (
                    <div className="mt-2">
                      <Badge variant="secondary">Score: {activity.score}%</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accommodations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Accommodations</CardTitle>
              <CardDescription>Support features customized for your learning style</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(module.accommodations).map(([category, accommodations]) => (
                <div key={category}>
                  <h4 className="font-medium mb-3 capitalize">{category} Support:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {accommodations.map((acc: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Settings className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{acc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your journey through this module</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{module.progress}%</div>
                  <p className="text-sm text-gray-600">Module Complete</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {module.activities.filter(a => a.completed).length}/{module.activities.length}
                  </div>
                  <p className="text-sm text-gray-600">Activities Done</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{formatTime(sessionTime)}</div>
                  <p className="text-sm text-gray-600">Time Spent</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Activity Scores:</h4>
                {module.activities.filter(a => a.score !== undefined).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{activity.title}</span>
                    <Badge variant="outline">{activity.score}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Settings</CardTitle>
              <CardDescription>Customize your learning experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Visual Mode:</h4>
                <div className="flex gap-3">
                  <Button
                    variant={visualMode === 'standard' ? 'default' : 'outline'}
                    onClick={() => setVisualMode('standard')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Standard
                  </Button>
                  <Button
                    variant={visualMode === 'high-contrast' ? 'default' : 'outline'}
                    onClick={() => setVisualMode('high-contrast')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    High Contrast
                  </Button>
                  <Button
                    variant={visualMode === 'large-text' ? 'default' : 'outline'}
                    onClick={() => setVisualMode('large-text')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Large Text
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Audio Support:</h4>
                <div className="flex items-center gap-3">
                  <Button
                    variant={voiceEnabled ? 'default' : 'outline'}
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    {voiceEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Hints & Support:</h4>
                <div className="flex items-center gap-3">
                  <Button
                    variant={showHints ? 'default' : 'outline'}
                    onClick={() => setShowHints(!showHints)}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {showHints ? 'Show Hints' : 'Hide Hints'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}