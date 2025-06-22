import { redirect } from 'next/navigation';

// Force redirect to modern white shadcn dashboard (NOT dashboard-v2)
export default function Home() {
  redirect('/dashboard');
}
