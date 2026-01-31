/**
 * Dashboard.tsx
 * Main dashboard showing user's courses and progress
 * Updated with glassmorphism design and enhanced animations
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  BookOpen, 
  Target, 
  Flame,
  Trophy,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { CourseCard } from '@/components/courses/CourseCard';
import { XPBadge } from '@/components/gamification/XPBadge';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { StreakBadge } from '@/components/gamification/StreakBadge';
import { ProgressRing } from '@/components/gamification/ProgressRing';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useCourses } from '@/hooks/useCourses';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  // Calculate overall progress
  const completedCourses = courses?.filter(c => c.is_completed).length ?? 0;
  const totalCourses = courses?.length ?? 0;
  const overallProgress = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  // Calculate XP needed for next level
  const getLevelProgress = () => {
    const xp = profile?.xp ?? 0;
    if (xp >= 600) return 100;
    if (xp >= 300) return ((xp - 300) / 300) * 100;
    if (xp >= 100) return ((xp - 100) / 200) * 100;
    return (xp / 100) * 100;
  };

  // Trending topics (mock data - will be replaced with real API)
  const trendingTopics = [
    { name: 'Machine Learning', icon: '🤖', color: 'from-purple-500 to-pink-500' },
    { name: 'Data Structures', icon: '📊', color: 'from-blue-500 to-cyan-500' },
    { name: 'System Design', icon: '🏗️', color: 'from-green-500 to-emerald-500' },
    { name: 'Web Development', icon: '🌐', color: 'from-orange-500 to-yellow-500' },
    { name: 'Physics', icon: '⚡', color: 'from-indigo-500 to-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Gradient background overlay */}
      <div className="fixed inset-0 -z-10 gradient-bg-animated opacity-50" />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'Learner'}</span>! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Continue your learning journey and earn more XP today.
          </p>
        </motion.div>

        {/* Stats cards - Glassmorphism style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* XP Card */}
          <GlassStatsCard
            icon={Zap}
            label="Total XP"
            value={
              <XPBadge xp={profile?.xp ?? 0} size="lg" showLabel={false} />
            }
            sublabel="Keep learning to earn more!"
            gradientFrom="from-studyflow-xp"
            gradientTo="to-studyflow-badge"
            delay={0}
          />

          {/* Level Card */}
          <GlassStatsCard
            icon={Trophy}
            label="Current Level"
            value={
              <LevelBadge level={profile?.level ?? 1} size="lg" />
            }
            sublabel={
              <div className="mt-2 w-full">
                <div className="mb-1 flex justify-between text-xs">
                  <span>Level Progress</span>
                  <span>{Math.round(getLevelProgress())}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${getLevelProgress()}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            }
            gradientFrom="from-primary"
            gradientTo="to-accent"
            delay={0.1}
          />

          {/* Streak Card */}
          <GlassStatsCard
            icon={Flame}
            label="Current Streak"
            value={
              <StreakBadge streak={profile?.streak ?? 0} size="lg" />
            }
            sublabel="Study daily to maintain!"
            gradientFrom="from-studyflow-streak"
            gradientTo="to-studyflow-warning"
            delay={0.2}
          />

          {/* Courses Card */}
          <GlassStatsCard
            icon={BookOpen}
            label="Courses"
            value={
              <div className="flex items-center gap-3">
                <ProgressRing progress={overallProgress} size={50} strokeWidth={5} color="success" />
                <div>
                  <span className="text-2xl font-bold">{completedCourses}</span>
                  <span className="text-muted-foreground">/{totalCourses}</span>
                </div>
              </div>
            }
            sublabel="Completed"
            gradientFrom="from-studyflow-success"
            gradientTo="to-primary"
            delay={0.3}
          />
        </motion.div>

        {/* Trending Topics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Trending Topics</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trendingTopics.map((topic, index) => (
              <motion.button
                key={topic.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/create-course')}
                className="glass-card flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium whitespace-nowrap transition-all hover:shadow-lg"
              >
                <span className="text-lg">{topic.icon}</span>
                <span className="text-foreground">{topic.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Create course CTA (if no courses) */}
        {!coursesLoading && (!courses || courses.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="glass-card overflow-hidden rounded-2xl border border-primary/20 p-8 text-center">
              <motion.div 
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </motion.div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Start Your First Course
              </h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Create a course by entering a subject or uploading your syllabus. 
                Our AI will generate a personalized learning path just for you!
              </p>
              <Button
                variant="hero"
                size="lg"
                className="mt-6 group btn-glow"
                onClick={() => navigate('/create-course')}
              >
                <Plus className="h-5 w-5" />
                Create Your First Course
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Courses section */}
        {courses && courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">
                Your Courses
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/create-course')}
                className="glass"
              >
                <Plus className="h-4 w-4" />
                New Course
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {coursesLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl glass-card shimmer" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Glass Stats Card Component with gradient accent
const GlassStatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  sublabel,
  gradientFrom,
  gradientTo,
  delay,
}: { 
  icon: React.ElementType; 
  label: string; 
  value: React.ReactNode; 
  sublabel: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    className="glass-card rounded-2xl p-5 card-hover"
  >
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${gradientFrom} ${gradientTo}`}>
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      {label}
    </div>
    <div className="mt-3">{value}</div>
    <div className="mt-2 text-sm text-muted-foreground">{sublabel}</div>
  </motion.div>
);

export default Dashboard;
