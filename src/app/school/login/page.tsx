
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpenCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { schoolLoginAction } from './actions';

export default function SchoolAdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await schoolLoginAction({ email, password });

    if (result.success) {
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your school dashboard...',
      });
      router.push('/school/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
             <BookOpenCheck className="h-8 w-8 text-primary" />
             <span className="text-2xl font-bold font-headline">Wisdomis Fun</span>
          </div>
          <CardTitle className="text-2xl font-headline">School Portal</CardTitle>
          <CardDescription>Sign in to manage your institution's account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@school.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
             <p className="text-xs text-center text-muted-foreground pt-2">
                Use the admin email and password provided during setup.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
