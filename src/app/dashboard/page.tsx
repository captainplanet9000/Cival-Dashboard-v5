import { redirect } from 'next/navigation';

// Redirect to the comprehensive dashboard with all services and advanced tab
export default function DashboardPage() {
  redirect('/dashboard-v2');
}