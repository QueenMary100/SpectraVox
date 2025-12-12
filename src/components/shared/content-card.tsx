import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Users, 
  Award, 
  PlayCircle, 
  Star,
  Heart,
  Calendar,
  BookOpen,
  CheckCircle
} from 'lucide-react';

interface ContentCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  image?: string;
  badges?: Array<{
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    color?: string;
  }>;
  stats?: Array<{
    icon: ReactNode;
    label: string;
    value: string;
  }>;
  progress?: number;
  actions?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
    icon?: ReactNode;
    primary?: boolean;
  }>;
  footer?: ReactNode;
  status?: 'completed' | 'in-progress' | 'not-started' | 'locked';
  timestamp?: string;
  className?: string;
}

export function ContentCard({
  title,
  description,
  icon,
  image,
  badges,
  stats,
  progress,
  actions,
  footer,
  status,
  timestamp,
  className
}: ContentCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'not-started': return 'text-gray-600';
      case 'locked': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'not-started': return <PlayCircle className="w-4 h-4" />;
      case 'locked': return <Star className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
              {status && getStatusIcon()}
            </div>
            {badges && (
              <div className="flex flex-wrap gap-1">
                {badges.map((badge, index) => (
                  <Badge 
                    key={index} 
                    variant={badge.variant || 'secondary'} 
                    className={badge.color}
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
        {image && (
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden mt-3">
            <img 
              src={image} 
              alt={title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {stats && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-1">
                {stat.icon}
                <span>{stat.label}: {stat.value}</span>
              </div>
            ))}
          </div>
        )}
        
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {actions && (
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || (action.primary ? 'default' : 'outline')}
                size={action.primary ? 'default' : 'sm'}
                onClick={action.onClick}
                asChild={action.href ? true : false}
                className={action.primary ? 'flex-1' : ''}
              >
                {action.href ? (
                  <a href={action.href}>
                    {action.icon}
                    {action.icon && <span className="ml-2">{action.label}</span>}
                    {!action.icon && action.label}
                  </a>
                ) : (
                  <>
                    {action.icon}
                    {action.icon && <span className="ml-2">{action.label}</span>}
                    {!action.icon && action.label}
                  </>
                )}
              </Button>
            ))}
          </div>
        )}
        
        {timestamp && (
          <p className="text-xs text-muted-foreground">
            {timestamp}
          </p>
        )}
        
        {footer}
      </CardContent>
    </Card>
  );
}