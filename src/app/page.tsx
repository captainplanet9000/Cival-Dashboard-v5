import { redirect } from 'next/navigation';

// Redirect to the comprehensive dashboard with all services
export default function Home() {
  redirect('/dashboard-v2');
}
