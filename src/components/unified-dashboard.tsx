'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Award, 
  Brain, 
  Zap,
  PlayCircle,
  PlusCircle,
  FileText,
  CheckCircle,
  TrendingUp,
  Smile,
  Activity,
  ArrowUp,
  BarChart3,
  HeartPulse,
  GraduationCap,
  Star,
  Target,
  Calendar
} from 'lucide-react';
import type { Role } from '@/lib/types';

interface DashboardStats {
  total: number;
  change: number;
  changeLabel: string;
  trend: 'up' | 'down' | 'neutral';
}

interface DashboardData {
  welcomeMessage: string;
  stats: Array<{
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    description: string;
    status?: string;
    timestamp?: string;
    type: 'lesson' | 'course' | 'achievement' | 'curriculum';
    image?: string;
    progress?: number;
  }>;
  quickActions: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    primary?: boolean;
  }>;
}

interface UnifiedDashboardProps {
  role: Role;
  userName?: string;
}

const roleConfigs: Record<Role, DashboardData> = {
  student: {
    welcomeMessage: "Ready to learn something new today?",
    stats: [
      {
        title: "Today's Mood",
        value: "Happy",
        description: "Feeling great after lessons",
        icon: <Smile className="h-4 w-4" />,
        trend: 'up',
        color: 'text-green-600'
      },
      {
        title: "Streak",
        value: "4 Days",
        description: "Consistent learning",
        icon: <TrendingUp className="h-4 w-4" />,
        trend: 'up'
      },
      {
        title: "Average Score",
        value: "85%",
        description: "+5% from last week",
        icon: <CheckCircle className="h-4 w-4" />,
        trend: 'up'
      },
      {
        title: "Time Today",
        value: "45 mins",
        description: "+10 mins from yesterday",
        icon: <Clock className="h-4 w-4" />,
        trend: 'up'
      }
    ],
    recentActivity: [
      {
        id: '1',
        title: 'Solar System',
        description: 'Learn about planets and stars',
        type: 'lesson',
        progress: 100,
        image: '/placeholder-lesson-1.jpg'
      },
      {
        id: '2',
        title: 'Jungle Animals',
        description: 'Meet amazing jungle animals',
        type: 'lesson',
        progress: 75,
        image: '/placeholder-lesson-2.jpg'
      },
      {
        id: '3',
        title: 'Ocean Life',
        description: 'Discover ocean creatures',
        type: 'lesson',
        progress: 30,
        image: '/placeholder-lesson-3.jpg'
      }
    ],
    quickActions: [
      {
        title: 'Browse Courses',
        description: 'Explore new learning paths',
        icon: <BookOpen className="h-4 w-4" />,
        href: '/courses',
        primary: true
      },
      {
        title: 'Learning Tools',
        description: 'Try interactive tools',
        icon: <Zap className="h-4 w-4" />,
        href: '/tools'
      },
      {
        title: 'Daily Check-in',
        description: 'How are you feeling today?',
        icon: <HeartPulse className="h-4 w-4" />,
        href: '/student/checkin'
      }
    ]
  },
  teacher: {
    welcomeMessage: "Manage your curriculum and track student progress",
    stats: [
      {
        title: "Total Curriculums",
        value: "12",
        description: "+3 from last month",
        icon: <FileText className="h-4 w-4" />,
        trend: 'up'
      },
      {
        title: "Processing",
        value: "1",
        description: "Being simplified by AI",
        icon: <Clock className="h-4 w-4" />,
        trend: 'neutral'
      },
      {
        title: "Ready",
        value: "11",
        description: "Available for students",
        icon: <CheckCircle className="h-4 w-4" />,
        trend: 'up'
      },
      {
        title: "Active Students",
        value: "24",
        description: "+2 new this week",
        icon: <Users className="h-4 w-4" />,
        trend: 'up'
      }
    ],
    recentActivity: [
      {
        id: '1',
        title: 'Solar System 101',
        description: 'Astronomy basics for beginners',
        type: 'curriculum',
        status: 'ready',
        timestamp: '2 days ago'
      },
      {
        id: '2',
        title: 'Introduction to Algebra',
        description: 'Basic algebraic concepts',
        type: 'curriculum',
        status: 'processing',
        timestamp: '5 days ago'
      },
      {
        id: '3',
        title: 'Jungle Animals',
        description: 'Wildlife education module',
        type: 'curriculum',
        status: 'ready',
        timestamp: '1 week ago'
      }
    ],
    quickActions: [
      {
        title: 'Upload Curriculum',
        description: 'Add new learning materials',
        icon: <PlusCircle className="h-4 w-4" />,
        href: '/teacher/upload',
        primary: true
      },
      {
        title: 'Browse Courses',
        description: 'View available courses',
        icon: <BookOpen className="h-4 w-4" />,
        href: '/courses'
      },
      {
        title: 'Community',
        description: 'Connect with other teachers',
        icon: <Users className="h-4 w-4" />,
        href: '/teacher/community'
      }
    ]
  },
  guardian: {
    welcomeMessage: "Track your child's progress and well-being",
    stats: [
      {
        title: "Today's Mood",
        value: "Happy",
        description: "Feeling great after lessons",
        icon: <Smile className="h-4 w-4" />,
        trend: 'up',
        color: 'text-green-600'
      },
      {
        title: "Positive Streak",
        value: "4 Days",
        description: "Consistently positive",
        icon: <TrendingUp className="h-4 w-4" />,
        trend: 'up'
      },
      {
        title: "Average Score",
        value: "85%",
        description: "+5% from last week",
        icon: <CheckCircle className="h-4 w-4" />,
        trend: 'up'
      },
      {
        title: "Time Spent",
        value: "45 mins",
        description: "Today's learning time",
        icon: <Clock className="h-4 w-4" />,
        trend: 'up'
      }
    ],
    recentActivity: [
      {
        id: '1',
        title: 'Solar System Completed',
        description: 'Finished with 95% score',
        type: 'achievement',
        timestamp: 'Today'
      },
      {
        id: '2',
        title: 'Jungle Animals',
        description: '75% completed',
        type: 'lesson',
        progress: 75,
        timestamp: '2 days ago'
      },
      {
        id: '3',
        title: 'Positive Mood Check-in',
        description: 'Feeling excited about learning',
        type: 'achievement',
        timestamp: 'Yesterday'
      }
    ],
    quickActions: [
      {
        title: 'View Progress',
        description: 'Detailed learning analytics',
        icon: <BarChart3 className="h-4 w-4" />,
        href: '/guardian',
        primary: true
      },
      {
        title: 'Well-being',
        description: 'Emotional and social progress',
        icon: <HeartPulse className="h-4 w-4" />,
        href: '/guardian/wellbeing'
      },
      {
        title: 'Community',
        description: 'Connect with other guardians',
        icon: <Users className="h-4 w-4" />,
        href: '/guardian/community'
      }
    ]
  }
};

export function UnifiedDashboard({ role, userName = "User" }: UnifiedDashboardProps) {
  const config = roleConfigs[role];
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="h-5 w-5" />;
      case 'course': return <GraduationCap className="h-5 w-5" />;
      case 'achievement': return <Award className="h-5 w-5" />;
      case 'curriculum': return <FileText className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground mt-2">
            {config.welcomeMessage}
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-3">
          {config.quickActions.slice(0, 2).map((action, index) => (
            <Button
              key={index}
              asChild
              variant={action.primary ? "default" : "outline"}
            >
              <a href={action.href}>
                {action.icon}
                <span className="ml-2">{action.title}</span>
              </a>
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {config.stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={stat.color || "text-muted-foreground"}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trend === 'up' && <ArrowUp className="h-3 w-3 text-green-500" />}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {config.recentActivity.slice(0, 3).map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {getActivityIcon(activity.type)}
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                  </div>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {activity.status && (
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  )}
                  {activity.progress !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{activity.progress}%</span>
                      </div>
                      <Progress value={activity.progress} className="h-2" />
                    </div>
                  )}
                  {activity.timestamp && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {activity.timestamp}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and activities from your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {activity.status && (
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      )}
                      {activity.progress !== undefined && (
                        <div className="text-sm font-medium">
                          {activity.progress}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {config.quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {action.icon}
                    {action.title}
                  </CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant={action.primary ? "default" : "outline"}>
                    <a href={action.href}>
                      {action.primary ? "Get Started" : "Explore"}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}