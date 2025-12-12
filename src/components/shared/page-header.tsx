import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Star, Sparkles } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  badges?: Array<{
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }>;
  showAIIndicators?: boolean;
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  actions, 
  badges,
  showAIIndicators = false 
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {showAIIndicators && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  AI-Powered
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Adaptive
                </Badge>
              </div>
            )}
            {badges?.map((badge, index) => (
              <Badge key={index} variant={badge.variant || 'default'}>
                {badge.text}
              </Badge>
            ))}
          </div>
          {description && (
            <p className="text-muted-foreground text-lg">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
      
      {children && (
        <Card>
          <CardContent className="pt-6">
            {children}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface FeatureHighlightProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: string;
}

export function FeatureHighlight({ icon, title, description, color = "text-primary" }: FeatureHighlightProps) {
  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
      <div className={`flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface AIStatusIndicatorProps {
  status: 'active' | 'processing' | 'idle';
  message?: string;
}

export function AIStatusIndicator({ status, message }: AIStatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'processing': return 'text-yellow-600';
      case 'idle': return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active': return <Sparkles className="w-4 h-4" />;
      case 'processing': return <Brain className="w-4 h-4 animate-pulse" />;
      case 'idle': return <Star className="w-4 h-4" />;
    }
  };

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{message || status}</span>
    </Badge>
  );
}