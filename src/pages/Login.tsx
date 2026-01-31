/**
 * Login.tsx
 * Login page with email/password authentication
 * Updated with purple-blue gradient and glassmorphism
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    toast({
      title: 'Welcome back!',
      description: 'Successfully logged in.',
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-12 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-bg-animated opacity-50 -z-10" />
        
        {/* Theme toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link to="/" className="mb-8 flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg"
            >
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <span className="font-display text-xl font-bold gradient-text">StudyFlow AI</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-2xl font-bold text-foreground">Welcome back!</h1>
            <p className="mt-2 text-muted-foreground">
              Log in to continue your learning journey.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
          >
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/50 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background/50 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="hero"
              className="w-full btn-glow"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Log In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:block lg:flex-1">
        <div className="relative h-full bg-gradient-to-br from-primary via-accent to-studyflow-info overflow-hidden">
          {/* Animated orbs */}
          <div className="glow-orb w-96 h-96 bg-white/20 top-10 -left-20" />
          <div className="glow-orb w-64 h-64 bg-white/10 bottom-20 right-10" style={{ animationDelay: '3s' }} />
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-center p-12 text-primary-foreground">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-md text-center"
            >
              <motion.div 
                className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <BookOpen className="h-10 w-10" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold">
                Continue Your Journey
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Pick up where you left off. Your learning progress and achievements are waiting for you.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
