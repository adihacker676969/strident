/**
 * Course.tsx
 * Course detail page showing topics and learning progress
 */

import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Circle,
  Clock,
  Zap,
  Play,
  Lock,
  Target,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { ProgressRing } from '@/components/gamification/ProgressRing';
import { useCourse, type Topic } from '@/hooks/useCourses';

const Course = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useCourse(id);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-muted" />
          <div className="mx-auto mt-4 h-8 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Course not found</h1>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { course, topics } = data;
  const completedTopics = topics.filter(t => t.is_completed).length;
  const progressPercentage = topics.length > 0 ? (completedTopics / topics.length) * 100 : 0;
  const totalXP = topics.reduce((sum, t) => sum + t.xp_reward, 0);
  const earnedXP = topics.filter(t => t.is_completed).reduce((sum, t) => sum + t.xp_reward, 0);

  // Level badge colors
  const levelColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  // Find the next topic to learn
  const nextTopicIndex = topics.findIndex(t => !t.is_completed);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Course header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[course.learning_level]}`}>
                  <GraduationCap className="h-3 w-3" />
                  {course.learning_level.charAt(0).toUpperCase() + course.learning_level.slice(1)}
                </span>
                {course.is_completed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-studyflow-success px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                {course.title}
              </h1>
              {course.description && (
                <p className="mt-2 text-muted-foreground">{course.description}</p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <ProgressRing
                progress={progressPercentage}
                size={80}
                strokeWidth={6}
                color={course.is_completed ? 'success' : 'primary'}
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{completedTopics}/{topics.length}</span>
                  <span className="text-muted-foreground">topics</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-studyflow-xp" />
                  <span className="font-medium text-studyflow-xp">{earnedXP}/{totalXP}</span>
                  <span className="text-muted-foreground">XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue button */}
          {nextTopicIndex !== -1 && (
            <div className="mt-6 pt-6 border-t border-border">
              <Link to={`/learn/${topics[nextTopicIndex].id}`}>
                <Button variant="hero" size="lg" className="group">
                  <Play className="h-5 w-5" />
                  Continue Learning: {topics[nextTopicIndex].name}
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Topics list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">
            Learning Path
          </h2>

          <div className="space-y-3">
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                isNext={index === nextTopicIndex}
                isLocked={index > nextTopicIndex && nextTopicIndex !== -1}
              />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Topic card component
const TopicCard = ({ 
  topic, 
  index, 
  isNext,
  isLocked,
}: { 
  topic: Topic; 
  index: number; 
  isNext: boolean;
  isLocked: boolean;
}) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const CardContent = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        flex items-center gap-4 rounded-xl border p-4 transition-all
        ${topic.is_completed 
          ? 'border-studyflow-success/30 bg-studyflow-success/5' 
          : isNext 
            ? 'border-primary bg-primary/5 shadow-md' 
            : isLocked
              ? 'border-border bg-muted/50 opacity-60'
              : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
        }
      `}
    >
      {/* Status indicator */}
      <div className={`
        flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full
        ${topic.is_completed 
          ? 'bg-studyflow-success text-primary-foreground' 
          : isNext 
            ? 'bg-primary text-primary-foreground' 
            : isLocked
              ? 'bg-muted text-muted-foreground'
              : 'bg-muted text-foreground'
        }
      `}>
        {topic.is_completed ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : isLocked ? (
          <Lock className="h-4 w-4" />
        ) : (
          <span className="font-bold">{index + 1}</span>
        )}
      </div>

      {/* Topic info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium ${topic.is_completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
          {topic.name}
        </h3>
        {topic.description && (
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
            {topic.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[topic.difficulty]}`}>
            {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {topic.estimated_time} min
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-studyflow-xp">
            <Zap className="h-3 w-3" />
            {topic.xp_reward} XP
          </span>
        </div>
      </div>

      {/* Action indicator */}
      {isNext && (
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Play className="h-5 w-5" />
          </div>
        </div>
      )}
    </motion.div>
  );

  // Wrap in link if not locked
  if (isLocked) {
    return CardContent;
  }

  return (
    <Link to={`/learn/${topic.id}`}>
      {CardContent}
    </Link>
  );
};

export default Course;
