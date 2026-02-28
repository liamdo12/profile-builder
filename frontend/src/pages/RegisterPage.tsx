/**
 * RegisterPage — full-screen centered card with registration form.
 * Client-side password match validation before submitting.
 * On success navigates to home.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ email, username, password });
      navigate('/documents', { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast.error(message);
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
              <CardTitle className="text-2xl text-white">Create an account</CardTitle>
              <CardDescription className="text-zinc-400">Start building your professional profile</CardDescription>
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
                  <label htmlFor="username" className="text-sm font-medium text-zinc-300">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-300">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </Button>

                <p className="text-sm text-zinc-500 text-center">
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300">
                    Sign in
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
