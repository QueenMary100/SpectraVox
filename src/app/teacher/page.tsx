import { UnifiedDashboard } from '@/components/unified-dashboard';

export default function TeacherDashboard() {
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
      <UnifiedDashboard role="teacher" userName="Sarah" />
    </div>
  );
}