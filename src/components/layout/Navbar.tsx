/**
 * Navbar.tsx
 * Main navigation component with user info, gamification badges, and theme toggle
 */

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Home, 
  Trophy, 
  User, 
  LogOut, 
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { XPBadge } from '@/components/gamification/XPBadge';
import { StreakBadge } from '@/components/gamification/StreakBadge';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg"
          >
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="font-display text-xl font-bold gradient-text">
            StudyFlow AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {user ? (
            <>
              {/* Gamification badges */}
              <div className="flex items-center gap-3">
                <XPBadge xp={profile?.xp ?? 0} size="sm" />
                <LevelBadge level={profile?.level ?? 1} size="sm" />
                <StreakBadge streak={profile?.streak ?? 0} size="sm" />
              </div>

              {/* Nav links */}
              <div className="flex items-center gap-1">
                <NavLink to="/dashboard" icon={Home} label="Dashboard" />
                <NavLink to="/leaderboard" icon={Trophy} label="Leaderboard" />
                <NavLink to="/profile" icon={User} label="Profile" />
              </div>

              {/* Create course button */}
              <Button 
                variant="hero" 
                size="sm" 
                onClick={() => navigate('/create-course')}
                className="btn-glow"
              >
                <Plus className="h-4 w-4" />
                New Course
              </Button>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Logout */}
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <ThemeToggle />
              
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button variant="hero" onClick={() => navigate('/signup')} className="btn-glow">
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <div className="container mx-auto space-y-4 px-4 py-4">
            {user ? (
              <>
                {/* Gamification badges */}
                <div className="flex flex-wrap gap-2">
                  <XPBadge xp={profile?.xp ?? 0} size="sm" />
                  <LevelBadge level={profile?.level ?? 1} size="sm" />
                  <StreakBadge streak={profile?.streak ?? 0} size="sm" />
                </div>

                {/* Nav links */}
                <div className="space-y-2">
                  <MobileNavLink to="/dashboard" icon={Home} label="Dashboard" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink to="/leaderboard" icon={Trophy} label="Leaderboard" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink to="/profile" icon={User} label="Profile" onClick={() => setMobileMenuOpen(false)} />
                </div>

                <Button variant="hero" className="w-full btn-glow" onClick={() => { navigate('/create-course'); setMobileMenuOpen(false); }}>
                  <Plus className="h-4 w-4" />
                  New Course
                </Button>

                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button variant="hero" className="w-full btn-glow" onClick={() => navigate('/signup')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// Desktop nav link component
const NavLink = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => (
  <Link
    to={to}
    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
  >
    <Icon className="h-4 w-4" />
    {label}
  </Link>
);

// Mobile nav link component
const MobileNavLink = ({ to, icon: Icon, label, onClick }: { to: string; icon: React.ElementType; label: string; onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-secondary"
  >
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);
