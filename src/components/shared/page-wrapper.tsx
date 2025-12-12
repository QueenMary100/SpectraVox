import { ReactNode } from 'react';
import { PageHeader } from './page-header';

interface PageWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  headerActions?: ReactNode;
  showAIIndicators?: boolean;
  badges?: Array<{
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }>;
}

export function PageWrapper({ 
  title, 
  description, 
  children, 
  headerActions, 
  showAIIndicators = false,
  badges 
}: PageWrapperProps) {
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title={title}
        description={description}
        actions={headerActions}
        showAIIndicators={showAIIndicators}
        badges={badges}
      />
      {children}
    </div>
  );
}