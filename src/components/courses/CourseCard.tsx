/**
 * CourseCard.tsx
 * Card component to display a course with progress
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Target, CheckCircle2 } from 'lucide-react';
import { ProgressRing } from '@/components/gamification/ProgressRing';
import type { Course } from '@/hooks/useCourses';

interface CourseCardProps {
  course: Course;
  index?: number;
}

export const CourseCard = ({ course, index = 0 }: CourseCardProps) => {
  // Difficulty badge colors
  const levelColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/course/${course.id}`}>
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg card-hover">
          {/* Completed badge */}
          {course.is_completed && (
            <div className="absolute right-3 top-3">
              <div className="flex items-center gap-1 rounded-full bg-studyflow-success px-2 py-1 text-xs font-medium text-primary-foreground">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </div>
            </div>
          )}

          <div className="flex items-start gap-4">
            {/* Progress ring */}
            <ProgressRing
              progress={course.progress_percentage}
              size={60}
              strokeWidth={5}
              color={course.is_completed ? 'success' : 'primary'}
            />

            <div className="flex-1 space-y-2">
              {/* Title */}
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {course.title}
              </h3>

              {/* Description */}
              {course.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Level badge */}
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${levelColors[course.learning_level]}`}>
                  {course.learning_level.charAt(0).toUpperCase() + course.learning_level.slice(1)}
                </span>

                {/* XP */}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3.5 w-3.5" />
                  {course.total_xp} XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
