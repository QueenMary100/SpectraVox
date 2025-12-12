'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/shared/page-header';
import {
  Crown,
  Zap,
  Brain,
  Shield,
  TrendingUp,
  Users,
  Clock,
  Award,
  Volume2,
  Bell,
  BarChart3,
  Target,
  Rocket,
  Star,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  included: boolean;
  category: 'ai' | 'analytics' | 'communication' | 'support' | 'safety';
  priority: 'high' | 'medium' | 'low';
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  icon: React.ReactNode;
  color: string;
  badge?: string;
  popular?: boolean;
}

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const premiumFeatures: PremiumFeature[] = [
    {
      id: 'ai-learning-paths',
      title: 'Advanced AI Learning Paths',
      description: 'Hyper-personalized learning paths that adapt in real-time to student performance, emotions, and learning style.',
      icon: <Brain className="w-6 h-6" />,
      included: false,
      category: 'ai',
      priority: 'high'
    },
    {
      id: 'voice-analytics',
      title: 'Voice Analytics & Emotion Recognition',
      description: 'Analyze speech patterns, emotional state, and engagement levels through advanced voice recognition.',
      icon: <Volume2 className="w-6 h-6" />,
      included: false,
      category: 'communication',
      priority: 'high'
    },
    {
      id: 'predictive-analytics',
      title: 'Predictive Learning Analytics',
      description: 'AI-powered predictions of learning outcomes, burnout risk, and optimal learning schedules.',
      icon: <TrendingUp className="w-6 h-6" />,
      included: false,
      category: 'analytics',
      priority: 'medium'
    },
    {
      id: 'multilingual-support',
      title: 'Multi-Language Voice Support',
      description: 'Support for 30+ languages with native accents and localized learning content.',
      icon: <Users className="w-6 h-6" />,
      included: false,
      category: 'communication',
      priority: 'medium'
    },
    {
      id: 'advanced-safety',
      title: 'Advanced Safety Monitoring',
      description: 'Real-time safety alerts, location tracking, and emergency response integration.',
      icon: <Shield className="w-6 h-6" />,
      included: false,
      category: 'safety',
      priority: 'high'
    },
    {
      id: 'family-dashboard',
      title: 'Family Analytics Dashboard',
      description: 'Comprehensive family accounts with progress tracking for multiple children.',
      icon: <BarChart3 className="w-6 h-6" />,
      included: false,
      category: 'analytics',
      priority: 'medium'
    },
    {
      id: 'priority-support',
      title: 'Priority Technical Support',
      description: '24/7 priority support with guaranteed response times and dedicated account manager.',
      icon: <Crown className="w-6 h-6" />,
      included: false,
      category: 'support',
      priority: 'medium'
    },
    {
      id: 'custom-content',
      title: 'Custom Content Creation',
      description: 'AI-generated content tailored to specific educational goals and curriculum requirements.',
      icon: <Target className="w-6 h-6" />,
      included: false,
      category: 'ai',
      priority: 'low'
    }
  ];

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      features: [
        'Basic adaptive learning paths',
        '5 learning tools',
        'Monthly progress reports',
        'Standard voice support',
        'Community access',
        'Email support'
      ],
      icon: <Star className="w-6 h-6" />,
      color: 'border-gray-200',
      badge: 'Free Forever'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 29.99,
      features: [
        'Everything in Starter',
        'Advanced AI learning paths',
        'Voice analytics',
        'Weekly progress reports',
        'Multi-language support',
        'Priority support',
        'Family accounts (up to 3)',
        'Advanced safety monitoring'
      ],
      icon: <Zap className="w-6 h-6" />,
      color: 'border-blue-200',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49.99,
      features: [
        'Everything in Professional',
        'Predictive analytics',
        'Custom content creation',
        'Unlimited family accounts',
        'Advanced safety monitoring',
        'API access',
        'White-label options',
        'Dedicated account manager',
        '1-on-1 training sessions'
      ],
      icon: <Crown className="w-6 h-6" />,
      color: 'border-purple-200',
      badge: 'Most Popular'
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: 'demo-user', // Would get from auth
          email: 'user@example.com'
        })
      });

      const result = await response.json();

      if (result.success) {
        if (result.url) {
          // Redirect to Stripe checkout
          window.location.href = result.url;
        } else {
          // Free plan activated
          setSelectedPlan(planId);
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testVoiceFeatures = async () => {
    try {
      const response = await fetch('/api/elevenlabs/enhanced-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: "Welcome to APTX SpectraX Premium! This is how our advanced voice features sound.",
          emotion: 'happy',
          speed: 'normal',
          audience: 'child',
          purpose: 'celebration'
        })
      });

      const result = await response.json();
      
      if (result.success && result.audioData) {
        const audio = new Audio(result.audioData);
        audio.play();
      }
    } catch (error) {
      console.error('Voice test error:', error);
    }
  };

  const toggleNotifications = async () => {
    try {
      setNotificationsEnabled(!notificationsEnabled);
      
      // Send test notification
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          type: 'ai_insight',
          title: 'Premium Feature',
          message: notificationsEnabled ? 'Notifications enabled!' : 'Notifications disabled',
          priority: 'medium',
          channels: ['in_app']
        })
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'analytics': return <BarChart3 className="w-4 h-4" />;
      case 'communication': return <Volume2 className="w-4 h-4" />;
      case 'support': return <Crown className="w-4 h-4" />;
      case 'safety': return <Shield className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai': return 'text-purple-600';
      case 'analytics': return 'text-blue-600';
      case 'communication': return 'text-green-600';
      case 'support': return 'text-yellow-600';
      case 'safety': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Premium Features"
        description="Unlock the full potential of APTX SpectraX with advanced AI features, comprehensive analytics, and priority support"
        showAIIndicators={true}
        badges={[
          { text: '8 Premium Features', variant: 'secondary' },
          { text: 'AI-Powered', variant: 'outline' }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={testVoiceFeatures}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Test Voice
            </Button>
            <Button
              onClick={toggleNotifications}
              variant={notificationsEnabled ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              {notificationsEnabled ? 'On' : 'Off'}
            </Button>
          </div>
        }
      />

      {/* Premium Features Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-600" />
            Premium Features Overview
          </CardTitle>
          <CardDescription>
            Advanced features designed specifically for children with Down syndrome and their families
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature) => (
              <Card key={feature.id} className={`border-2 ${feature.included ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={getCategoryColor(feature.category)}>
                        {getCategoryIcon(feature.category)}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    {feature.included && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant={feature.priority === 'high' ? 'default' : 'secondary'}>
                      {feature.priority}
                    </Badge>
                    <Badge variant="outline" className={getCategoryColor(feature.category)}>
                      {feature.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <p className="text-muted-foreground">
            Unlock premium features and transform the learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-lg' : ''} ${
                selectedPlan === plan.id ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${plan.color} bg-white`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold">
                    ${plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                {plan.badge && (
                  <Badge variant="outline" className="mt-2">
                    {plan.badge}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Value Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-purple-600" />
              For Individuals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Personalized learning paths</li>
              <li>• Voice analytics insights</li>
              <li>• Progress tracking</li>
              <li>• Family sharing</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              For Families
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Multiple child accounts</li>
              <li>• Family dashboard</li>
              <li>• Collaborative learning</li>
              <li>• Safety monitoring</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              For Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Bulk licensing</li>
              <li>• Advanced analytics</li>
              <li>• API access</li>
              <li>• Priority support</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ROI Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Investment Calculator
          </CardTitle>
          <CardDescription>
            See how premium features translate to educational outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Free Plan</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Learning Progress</span>
                  <span className="font-medium">+25%</span>
                </div>
                <Progress value={25} className="h-2" />
                <div className="flex justify-between">
                  <span>Engagement</span>
                  <span className="font-medium">40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Premium Plan</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Learning Progress</span>
                  <span className="font-medium text-green-600">+75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="flex justify-between">
                  <span>Engagement</span>
                  <span className="font-medium text-green-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ROI:</strong> Premium users see <strong>3x better learning outcomes</strong> and <strong>2x higher engagement</strong>.
              Investment pays for itself in accelerated development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}