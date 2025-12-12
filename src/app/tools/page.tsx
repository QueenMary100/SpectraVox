'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader, AIStatusIndicator } from '@/components/shared/page-header';
import { 
  Mic, 
  Volume2, 
  Gamepad2, 
  Paintbrush, 
  Music, 
  Camera, 
  Puzzle,
  Heart,
  Smile,
  Clock,
  Star,
  PlayCircle,
  Settings,
  RefreshCw,
  Zap
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'communication' | 'learning' | 'creativity' | 'social';
  ageGroup: string;
  adaptiveFeatures: string[];
  isFavorite?: boolean;
  lastUsed?: string;
  image?: string;
}

interface EmotionTracker {
  mood: 'happy' | 'calm' | 'excited' | 'focused' | 'tired';
  activities: string[];
  suggestions: string[];
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [emotionState, setEmotionState] = useState<EmotionTracker | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'active' | 'processing' | 'idle'>('idle');

  useEffect(() => {
    loadTools();
    loadEmotionState();
  }, []);

  const loadTools = async () => {
    try {
      const response = await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartmemory.read',
          input: { key: 'user_tools' }
        })
      });

      const storedTools = await response.json();

      if (storedTools && storedTools.data) {
        setTools(storedTools.data);
      } else {
        const defaultTools: Tool[] = [
          {
            id: 'voice-assistant',
            name: 'Voice Assistant',
            description: 'Talk to the computer with your voice',
            icon: <Mic className="w-6 h-6" />,
            category: 'communication',
            ageGroup: 'All ages',
            adaptiveFeatures: ['Voice recognition', 'Simple commands', 'Visual feedback'],
            isFavorite: true,
            image: '/images/tools/voice-assistant.svg'
          },
          {
            id: 'text-to-speech',
            name: 'Story Reader',
            description: 'Hear stories and instructions read aloud',
            icon: <Volume2 className="w-6 h-6" />,
            category: 'communication',
            ageGroup: 'All ages',
            adaptiveFeatures: ['Adjustable speed', 'Different voices', 'Word highlighting']
          },
          {
            id: 'learning-games',
            name: 'Math Games',
            description: 'Fun games to learn numbers and counting',
            icon: <Gamepad2 className="w-6 h-6" />,
            category: 'learning',
            ageGroup: '6-12 years',
            adaptiveFeatures: ['Visual counting', 'Touch interface', 'Progressive difficulty'],
            isFavorite: true,
            image: '/images/tools/math-games.svg'
          },
          {
            id: 'art-studio',
            name: 'Art Studio',
            description: 'Create beautiful pictures with colors and shapes',
            icon: <Paintbrush className="w-6 h-6" />,
            category: 'creativity',
            ageGroup: 'All ages',
            adaptiveFeatures: ['Large brush sizes', 'Simple shapes', 'Color assistance'],
            image: '/images/tools/art-studio.svg'
          },
          {
            id: 'music-maker',
            name: 'Music Maker',
            description: 'Make music with fun sounds and rhythms',
            icon: <Music className="w-6 h-6" />,
            category: 'creativity',
            ageGroup: 'All ages',
            adaptiveFeatures: ['Simple beats', 'Visual rhythm guides', 'Auto-tune'],
            image: '/images/tools/music-maker.svg'
          },
          {
            id: 'photo-fun',
            name: 'Photo Fun',
            description: 'Take and decorate photos with stickers',
            icon: <Camera className="w-6 h-6" />,
            category: 'creativity',
            ageGroup: '8+ years',
            adaptiveFeatures: ['Easy filters', 'Fun stickers', 'Simple sharing']
          },
          {
            id: 'puzzle-games',
            name: 'Puzzle Games',
            description: 'Solve fun puzzles with pictures',
            icon: <Puzzle className="w-6 h-6" />,
            category: 'learning',
            ageGroup: '6-14 years',
            adaptiveFeatures: ['Large pieces', 'Hint system', 'Adjustable difficulty'],
            image: '/images/tools/puzzle-games.svg'
          },
          {
            id: 'emotion-tracker',
            name: 'Feelings Chart',
            description: 'Show how you feel today',
            icon: <Heart className="w-6 h-6" />,
            category: 'social',
            ageGroup: 'All ages',
            adaptiveFeatures: ['Visual emotion faces', 'Simple choices', 'Positive feedback']
          },
          {
            id: 'social-stories',
            name: 'Social Stories',
            description: 'Learn about different situations',
            icon: <Smile className="w-6 h-6" />,
            category: 'social',
            ageGroup: 'All ages',
            adaptiveFeatures: ['Picture-based stories', 'Simple language', 'Interactive choices']
          }
        ];
        setTools(defaultTools);
        await saveTools(defaultTools);
      }
    } catch (error) {
      console.error('Error loading tools:', error);
    }
  };

  const saveTools = async (toolsToSave: Tool[]) => {
    try {
      await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartmemory.write',
          input: {
            key: 'user_tools',
            value: toolsToSave,
            ttl: 86400
          }
        })
      });
    } catch (error) {
      console.error('Error saving tools:', error);
    }
  };

  const loadEmotionState = async () => {
    try {
      const response = await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartmemory.read',
          input: { key: 'emotion_state' }
        })
      });

      const state = await response.json();

      if (state && state.data) {
        setEmotionState(state.data);
      } else {
        const defaultState: EmotionTracker = {
          mood: 'happy',
          activities: ['playing', 'learning'],
          suggestions: ['Try a music game', 'Read a story']
        };
        setEmotionState(defaultState);
      }
    } catch (error) {
      console.error('Error loading emotion state:', error);
    }
  };

  const updateEmotionState = async (mood: EmotionTracker['mood']) => {
    const suggestions = generateSuggestions(mood);
    const newState: EmotionTracker = {
      mood,
      activities: getActivitiesForMood(mood),
      suggestions
    };

    setEmotionState(newState);
    
    try {
      await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartmemory.write',
          input: {
            key: 'emotion_state',
            value: newState,
            ttl: 86400
          }
        })
      });
    } catch (error) {
      console.error('Error saving emotion state:', error);
    }
  };

  const getActivitiesForMood = (mood: EmotionTracker['mood']): string[] => {
    switch (mood) {
      case 'happy':
        return ['music', 'games', 'art'];
      case 'calm':
        return ['reading', 'puzzles', 'drawing'];
      case 'excited':
        return ['active games', 'music maker', 'photo fun'];
      case 'focused':
        return ['learning games', 'puzzles', 'stories'];
      case 'tired':
        return ['story reader', 'calm music', 'simple art'];
      default:
        return ['games', 'art'];
    }
  };

  const generateSuggestions = (mood: EmotionTracker['mood']): string[] => {
    const suggestions = {
      happy: ['Share your artwork', 'Play music games', 'Take fun photos'],
      calm: ['Read a story', 'Draw something peaceful', 'Do easy puzzles'],
      excited: ['Make energetic music', 'Play active games', 'Dance to music'],
      focused: ['Try learning games', 'Solve puzzles', 'Read educational stories'],
      tired: ['Listen to calm stories', 'Simple drawing', 'Relaxing music']
    };
    return suggestions[mood] || suggestions.happy;
  };

  const launchTool = async (tool: Tool) => {
    setSelectedTool(tool);
    
    // Update last used
    const updatedTools = tools.map(t => 
      t.id === tool.id 
        ? { ...t, lastUsed: new Date().toISOString() }
        : t
    );
    setTools(updatedTools);
    await saveTools(updatedTools);

    // Generate adaptive content for the tool
    setLoading(true);
    setAiStatus('processing');
    try {
      const contentResponse = await fetch('/api/ai/content-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: tool.name,
          ageGroup: tool.ageGroup,
          contentType: 'activity',
          learningObjective: `Use ${tool.name} effectively`,
          specialNeeds: {
            cognitiveLevel: 'moderate',
            attentionSpan: '15-20 minutes',
            preferredLearningStyle: ['visual', 'interactive'],
            sensoryNeeds: ['visual_support', 'audio_support']
          },
          duration: '20 minutes'
        })
      });

      const content = await contentResponse.json();
      console.log('Generated content for tool:', content);
      setAiStatus('active');
    } catch (error) {
      console.error('Error generating content:', error);
      setAiStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (toolId: string) => {
    const updatedTools = tools.map(tool => 
      tool.id === toolId 
        ? { ...tool, isFavorite: !tool.isFavorite }
        : tool
    );
    setTools(updatedTools);
    await saveTools(updatedTools);
  };

  const getEmotionEmoji = (mood: EmotionTracker['mood']) => {
    const emojis = {
      happy: '😊',
      calm: '😌',
      excited: '🎉',
      focused: '🎯',
      tired: '😴'
    };
    return emojis[mood] || '😊';
  };

  const getEmotionColor = (mood: EmotionTracker['mood']) => {
    const colors = {
      happy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      calm: 'bg-blue-100 text-blue-800 border-blue-200',
      excited: 'bg-orange-100 text-orange-800 border-orange-200',
      focused: 'bg-green-100 text-green-800 border-green-200',
      tired: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[mood] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredTools = tools.filter(tool => {
    if (activeTab === 'all') return true;
    if (activeTab === 'favorites') return tool.isFavorite;
    return tool.category === activeTab;
  });

  const getCategoryIcon = (category: Tool['category']) => {
    switch (category) {
      case 'communication': return <Mic className="w-4 h-4" />;
      case 'learning': return <Gamepad2 className="w-4 h-4" />;
      case 'creativity': return <Paintbrush className="w-4 h-4" />;
      case 'social': return <Heart className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (selectedTool) {
    return (
      <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTool(null)}
            className="mb-4"
          >
            ← Back to Tools
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{selectedTool.icon}</div>
            <div>
              <h1 className="text-3xl font-bold">{selectedTool.name}</h1>
              <p className="text-gray-600">{selectedTool.description}</p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Tool Interface
            </CardTitle>
            <CardDescription>
              Interactive {selectedTool.name.toLowerCase()} environment
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {loading ? (
                <div>
                  <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" />
                  <p>Preparing {selectedTool.name}...</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-6">{selectedTool.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{selectedTool.name}</h3>
                  <p className="text-lg mb-6">
                    This is where the {selectedTool.name.toLowerCase()} would appear.
                    The tool would have large buttons, simple navigation, and visual supports.
                  </p>
                  <div className="space-y-4">
                    <h4 className="font-medium">Special Features:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedTool.adaptiveFeatures.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 space-x-4">
                    <Button size="lg">
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Start {selectedTool.name}
                    </Button>
                    <Button variant="outline" size="lg">
                      <Settings className="w-5 h-5 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {emotionState && (
          <Card>
            <CardHeader>
              <CardTitle>Based on your mood ({getEmotionEmoji(emotionState.mood)})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Suggested Activities:</h4>
                  <ul className="space-y-1">
                    {emotionState.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-600" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Good for:</h4>
                  <div className="flex flex-wrap gap-2">
                    {emotionState.activities.map((activity, index) => (
                      <Badge key={index} variant="outline">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="My Learning Tools"
        description="Fun tools made just for you! Click on any tool to start playing."
        showAIIndicators={true}
        badges={[
          { text: `${tools.length} Tools`, variant: "secondary" },
          { text: `${tools.filter(t => t.isFavorite).length} Favorites`, variant: "outline" }
        ]}
        actions={
          <AIStatusIndicator 
            status={aiStatus} 
            message={aiStatus === 'processing' ? 'Loading...' : aiStatus}
          />
        }
      />

      {emotionState && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{getEmotionEmoji(emotionState.mood)}</span>
              How are you feeling today?
            </CardTitle>
            <CardDescription>
              Pick your mood to get tool suggestions just for you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {(['happy', 'calm', 'excited', 'focused', 'tired'] as const).map((mood) => (
                <Button
                  key={mood}
                  variant={emotionState.mood === mood ? 'default' : 'outline'}
                  className="h-16 flex flex-col gap-1"
                  onClick={() => updateEmotionState(mood)}
                >
                  <span className="text-2xl">{getEmotionEmoji(mood)}</span>
                  <span className="text-xs capitalize">{mood}</span>
                </Button>
              ))}
            </div>
            
            <div className={`p-4 rounded-lg ${getEmotionColor(emotionState.mood)}`}>
              <h4 className="font-medium mb-2">Perfect for your mood:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">Try these tools:</h5>
                  <div className="flex flex-wrap gap-2">
                    {emotionState.suggestions.slice(0, 3).map((suggestion, index) => (
                      <Badge key={index} variant="secondary">
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-2">Good activities:</h5>
                  <div className="flex flex-wrap gap-2">
                    {emotionState.activities.map((activity, index) => (
                      <Badge key={index} variant="outline">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="favorites">⭐ Favorites</TabsTrigger>
          <TabsTrigger value="communication">💬 Talk</TabsTrigger>
          <TabsTrigger value="learning">📚 Learn</TabsTrigger>
          <TabsTrigger value="creativity">🎨 Create</TabsTrigger>
          <TabsTrigger value="social">❤️ Social</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Card 
                key={tool.id} 
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => launchTool(tool)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl group-hover:scale-110 transition-transform">
                        {tool.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          {getCategoryIcon(tool.category)}
                          <span className="capitalize">{tool.category}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {tool.isFavorite ? '⭐' : '☆'}
                    </Button>
                  </div>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {tool.image && (
                    <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden mb-3">
                      <img 
                        src={tool.image} 
                        alt={tool.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{tool.ageGroup}</Badge>
                      {tool.lastUsed && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Recently used</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h5 className="text-xs font-medium mb-2">Special Features:</h5>
                      <div className="flex flex-wrap gap-1">
                        {tool.adaptiveFeatures.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {tool.adaptiveFeatures.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{tool.adaptiveFeatures.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button className="w-full mt-4">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Open Tool
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}