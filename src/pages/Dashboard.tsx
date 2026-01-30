/**
 * Dashboard.tsx
 * Main dashboard showing user's courses and progress
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Learner'}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Continue your learning journey and earn more XP today.
          </p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* XP Card */}
          <StatsCard
            icon={Target}
            label="Total XP"
            value={
              <XPBadge xp={profile?.xp ?? 0} size="lg" showLabel={false} />
            }
            sublabel="Keep learning to earn more!"
            color="xp"
          />

          {/* Level Card */}
          <StatsCard
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
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-studyflow-level to-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${getLevelProgress()}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            }
            color="level"
          />

          {/* Streak Card */}
          <StatsCard
            icon={Flame}
            label="Current Streak"
            value={
              <StreakBadge streak={profile?.streak ?? 0} size="lg" />
            }
            sublabel="Study daily to maintain!"
            color="streak"
          />

          {/* Courses Card */}
          <StatsCard
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
            color="success"
          />
        </motion.div>

        {/* Create course CTA (if no courses) */}
        {!coursesLoading && (!courses || courses.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="overflow-hidden rounded-xl border border-dashed border-primary/50 bg-gradient-to-br from-primary/5 to-studyflow-xp/5 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
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
                className="mt-6 group"
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
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">
                Your Courses
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/create-course')}
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
              <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Stats card component
const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  sublabel,
  color,
}: { 
  icon: React.ElementType; 
  label: string; 
  value: React.ReactNode; 
  sublabel: React.ReactNode;
  color: 'xp' | 'level' | 'streak' | 'success';
}) => {
  const bgColors = {
    xp: 'from-studyflow-xp/10 to-studyflow-badge/10',
    level: 'from-studyflow-level/10 to-primary/10',
    streak: 'from-studyflow-streak/10 to-studyflow-warning/10',
    success: 'from-studyflow-success/10 to-primary/10',
  };

  const iconColors = {
    xp: 'text-studyflow-xp',
    level: 'text-studyflow-level',
    streak: 'text-studyflow-streak',
    success: 'text-studyflow-success',
  };

  return (
    <div className={`rounded-xl border border-border bg-gradient-to-br ${bgColors[color]} p-5`}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className={`h-4 w-4 ${iconColors[color]}`} />
        {label}
      </div>
      <div className="mt-3">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{sublabel}</div>
    </div>
  );
};

export default Dashboard;
