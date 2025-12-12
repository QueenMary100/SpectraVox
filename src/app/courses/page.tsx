'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PageHeader, AIStatusIndicator } from '@/components/shared/page-header';
import { BookOpen, Users, Clock, Award, Brain, Zap, Sparkles } from 'lucide-react';
import { callRaindrop } from '@/lib/raindrop';

interface Course {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  enrolledCount: number;
  rating: number;
  modules: number;
  progress?: number;
  adaptiveFeatures: string[];
  accommodations: string[];
  image?: string;
}

interface AdaptivePath {
  personalizedPath: {
    level: string;
    modules: Array<{
      title: string;
      description: string;
      activities: Array<{
        type: string;
        instructions: string;
        adaptations: string[];
        estimatedTime: string;
        interactions: string[];
      }>;
      assessments: Array<{
        type: string;
        questions: string[];
        adaptiveHints: string[];
        successCriteria: string;
      }>;
    }>;
    progressionCriteria: {
      completionThreshold: number;
      masteryIndicators: string[];
      nextSteps: string[];
    };
  };
  accommodations: {
    visual: string[];
    auditory: string[];
    interactive: string[];
    timing: string[];
  };
  recommendations: Array<{
    category: string;
    suggestion: string;
    rationale: string;
  }>;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [adaptivePath, setAdaptivePath] = useState<AdaptivePath | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<'active' | 'processing' | 'idle'>('idle');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      // Load courses from Raindrop SmartBucket
      const response = await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartbucket.list',
          input: { bucket: 'courses' }
        })
      });
      
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        setCourses(result.data);
      } else {
        // Default courses if bucket is empty
        setCourses([
          {
            id: '1',
            title: 'Math Adventures',
            description: 'Interactive math lessons designed for visual learners with adaptive pacing',
            ageGroup: '8-12 years',
            subject: 'Mathematics',
            difficulty: 'beginner',
            duration: '4 weeks',
            enrolledCount: 45,
            rating: 4.8,
            modules: 8,
            adaptiveFeatures: ['Visual learning', 'Interactive exercises', 'Immediate feedback'],
            accommodations: ['Extra time', 'Visual schedules', 'Audio instructions'],
            image: '/images/courses/math-adventures.svg'
          },
          {
            id: '2',
            title: 'Reading Explorers',
            description: 'Phonics and reading comprehension with multisensory approach',
            ageGroup: '6-10 years',
            subject: 'Literacy',
            difficulty: 'beginner',
            duration: '6 weeks',
            enrolledCount: 38,
            rating: 4.9,
            modules: 12,
            adaptiveFeatures: ['Phonetic support', 'Story-based learning', 'Voice recognition'],
            accommodations: ['Text-to-speech', 'Large text', 'Interactive highlights'],
            image: '/images/courses/reading-explorers.svg'
          },
          {
            id: '3',
            title: 'Science Discovery',
            description: 'Hands-on science experiments adapted for different learning styles',
            ageGroup: '10-14 years',
            subject: 'Science',
            difficulty: 'intermediate',
            duration: '5 weeks',
            enrolledCount: 32,
            rating: 4.7,
            modules: 10,
            adaptiveFeatures: ['Virtual experiments', 'Visual demonstrations', 'Step-by-step guides'],
            accommodations: ['Simplified instructions', 'Visual aids', 'Physical demonstrations'],
            image: '/images/courses/science-discovery.svg'
          },
          {
            id: '4',
            title: 'Life Skills Mastery',
            description: 'Essential daily living skills with real-world practice scenarios',
            ageGroup: '13-18 years',
            subject: 'Life Skills',
            difficulty: 'intermediate',
            duration: '8 weeks',
            enrolledCount: 28,
            rating: 4.9,
            modules: 16,
            adaptiveFeatures: ['Real-world scenarios', 'Social stories', 'Practice mode'],
            accommodations: ['Social narratives', 'Visual schedules', 'Task analysis'],
            image: '/images/courses/life-skills.svg'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('Failed to load courses');
    }
  };

  const generateAdaptivePath = async (course: Course) => {
    setLoading(true);
    setAiStatus('processing');
    setError(null);
    try {
      // Get user data from Raindrop SmartMemory
      const userResponse = await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartmemory.read',
          input: { key: 'user:current' }
        })
      });
      
      const userData = await userResponse.json();

      const pathResponse = await fetch('/api/ai/adaptive-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: userData.id || 'demo-student',
          ageGroup: course.ageGroup,
          currentLevel: course.difficulty,
          learningGoals: ['Improve ' + course.subject.toLowerCase() + ' skills'],
          specialNeeds: {
            cognitiveLevel: 'moderate',
            attentionSpan: '15-20 minutes',
            preferredLearningStyle: ['visual', 'kinesthetic'],
            accommodations: course.accommodations,
          },
          subjectArea: course.subject,
        })
      });

      if (!pathResponse.ok) {
        throw new Error(`API request failed: ${pathResponse.statusText}`);
      }

      const path = await pathResponse.json();
      
      // Handle error response
      if (path.error) {
        throw new Error(path.error);
      }

      // Ensure we have the expected structure
      if (!path.personalizedPath) {
        console.error('Invalid response structure:', path);
        throw new Error('Invalid response from adaptive path generation');
      }

      setAdaptivePath(path);
      setAiStatus('active');

      // Save adaptive path to Raindrop
      await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartmemory.write',
          input: {
            key: `adaptive_path:${course.id}:${userData.id || 'demo-student'}`,
            value: path,
            ttl: 86400 // 24 hours
          }
        })
      });
    } catch (error) {
      console.error('Error generating adaptive path:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate adaptive path');
      setAiStatus('idle');
      
      // Set a fallback adaptive path
      const fallbackPath: AdaptivePath = {
        personalizedPath: {
          level: course.difficulty,
          modules: [{
            title: `${course.subject} - Module 1`,
            description: `Introduction to ${course.subject} concepts`,
            activities: [{
              type: 'interactive',
              instructions: 'Welcome to your first activity!',
              adaptations: course.accommodations,
              estimatedTime: '15-20 minutes',
              interactions: ['touch', 'visual']
            }],
            assessments: [{
              type: 'formative',
              questions: ['Basic understanding check'],
              adaptiveHints: ['Visual hints available'],
              successCriteria: 'Complete with guidance'
            }]
          }],
          progressionCriteria: {
            completionThreshold: 80,
            masteryIndicators: ['Engagement', 'Completion'],
            nextSteps: ['Continue to next module']
          }
        },
        accommodations: {
          visual: ['Large text', 'High contrast'],
          auditory: ['Audio instructions', 'Sound cues'],
          interactive: ['Touch interface', 'Simple gestures'],
          timing: ['Extended time', 'Break options']
        },
        recommendations: [{
          category: 'Getting Started',
          suggestion: 'Begin with the first activity',
          rationale: 'Build foundational understanding'
        }]
      };
      
      setAdaptivePath(fallbackPath);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (course: Course) => {
    try {
      // Save enrollment to Raindrop SmartBucket
      await fetch('/api/raindrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'smartbucket.create',
          input: {
            bucket: 'enrollments',
            data: {
              courseId: course.id,
              userId: 'demo-student',
              enrolledAt: new Date().toISOString(),
              status: 'active'
            }
          }
        })
      });

      // Generate adaptive path
      await generateAdaptivePath(course);
      setSelectedCourse(course);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setError('Failed to enroll in course');
    }
  };

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'all') return true;
    if (activeTab === 'math') return course.subject === 'Mathematics';
    if (activeTab === 'literacy') return course.subject === 'Literacy';
    if (activeTab === 'science') return course.subject === 'Science';
    if (activeTab === 'life') return course.subject === 'Life Skills';
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Adaptive Learning Courses"
        description="Personalized courses powered by LiquidMetal AI for children with Down syndrome"
        showAIIndicators={true}
        badges={[
          { text: `${courses.length} Available`, variant: "secondary" }
        ]}
        actions={
          <AIStatusIndicator 
            status={aiStatus} 
            message={aiStatus === 'processing' ? 'Generating Path...' : aiStatus}
          />
        }
      />

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="math">Math</TabsTrigger>
          <TabsTrigger value="literacy">Literacy</TabsTrigger>
          <TabsTrigger value="science">Science</TabsTrigger>
          <TabsTrigger value="life">Life Skills</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        {course.title}
                      </CardTitle>
                      <Badge className={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Award className="w-4 h-4" />
                        {course.rating}
                      </div>
                    </div>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.image && (
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.enrolledCount} enrolled
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Adaptive Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {course.adaptiveFeatures.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {course.adaptiveFeatures.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.adaptiveFeatures.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {course.progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  <Button 
                    onClick={() => enrollInCourse(course)}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Generating Path...' : 'Start Learning'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedCourse && adaptivePath && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Adaptive Learning Path: {selectedCourse.title}
            </CardTitle>
            <CardDescription>
              Personalized path generated by LiquidMetal AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Learning Modules</h4>
                <div className="space-y-2">
                  {adaptivePath.personalizedPath?.modules?.map((module, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h5 className="font-medium">{module.title}</h5>
                      <p className="text-sm text-gray-600">{module.description}</p>
                      <div className="mt-2">
                        <Badge variant="outline">
                          {module.activities?.length || 0} activities
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium">Loading modules...</h5>
                      <p className="text-sm text-gray-600">Your learning path is being prepared</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Recommended Accommodations</h4>
                <div className="space-y-3">
                  {Object.entries(adaptivePath.accommodations || {}).map(([category, accommodations]) => (
                    <div key={category}>
                      <h5 className="text-sm font-medium capitalize">{category}</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(accommodations as string[]).map((acc: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {acc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {adaptivePath.recommendations?.map((rec, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm">{rec.category}</div>
                    <p className="text-sm mt-1">{rec.suggestion}</p>
                    <p className="text-xs text-gray-600 mt-1">{rec.rationale}</p>
                  </div>
                )) || (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm">Getting Started</div>
                    <p className="text-sm mt-1">Begin with the first activity to build your foundation</p>
                    <p className="text-xs text-gray-600 mt-1">Take your time and ask for help when needed</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}