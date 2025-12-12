import { DashboardLayout } from '@/components/dashboard-layout';

export default function GuardianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="guardian">{children}</DashboardLayout>;
}
