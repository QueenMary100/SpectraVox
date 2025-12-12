export default function StudentCommunityLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// This layout is nested under `src/app/student/layout.tsx` which already
	// provides the `DashboardLayout` (role=student). Return children only
	// to avoid double-wrapping the dashboard/sidebar.
	return <>{children}</>;
}
