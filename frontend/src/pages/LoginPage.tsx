/**
 * LoginPage — full-screen centered card with email/password login form.
 * On success navigates back to the previous location or home.
 */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '../contexts/use-auth';
import { LandingGradientBackground } from '@/components/landing/landing-gradient-background';
import { LandingNoiseOverlay } from '@/components/landing/landing-noise-overlay';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/documents';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="dark">
      <div className="relative min-h-screen overflow-hidden bg-[#09090b]">
        <LandingGradientBackground />
        <LandingNoiseOverlay />
        <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-2">
                <FileText className="h-8 w-8 text-indigo-400" />
              </div>
              <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
              <CardDescription className="text-zinc-400">Sign in to your Profile Builder account</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>

                <p className="text-sm text-zinc-500 text-center">
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300">
                    Create one
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
