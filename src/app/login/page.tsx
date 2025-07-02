import { LoginForm } from '@/components/auth/LoginForm';
import { BookOpenCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex flex-col items-center space-y-4 mb-8">
        <BookOpenCheck className="w-16 h-16 text-primary" />
        <h1 className="text-4xl font-headline font-bold text-center text-foreground">Welcome back to ScholarAI</h1>
        <p className="text-muted-foreground text-center">Your personal AI-powered study assistant.</p>
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
