/**
 * CourseCard.tsx
 * Card component to display a course with progress
 * Updated with glassmorphism design
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, CheckCircle2 } from 'lucide-react';
import { ProgressRing } from '@/components/gamification/ProgressRing';
import type { Course } from '@/hooks/useCourses';

interface CourseCardProps {
  course: Course;
  index?: number;
}

export const CourseCard = ({ course, index = 0 }: CourseCardProps) => {
  // Difficulty badge colors using semantic tokens
  const levelStyles = {
    beginner: 'bg-studyflow-success/10 text-studyflow-success border-studyflow-success/20',
    intermediate: 'bg-studyflow-info/10 text-studyflow-info border-studyflow-info/20',
    advanced: 'bg-studyflow-xp/10 text-studyflow-xp border-studyflow-xp/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/course/${course.id}`}>
        <div className="group relative overflow-hidden rounded-2xl glass-card p-5 transition-all duration-300 hover:shadow-lg card-hover">
          {/* Gradient accent on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Completed badge */}
          {course.is_completed && (
            <div className="absolute right-3 top-3">
              <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-studyflow-success to-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </div>
            </div>
          )}

          <div className="relative flex items-start gap-4">
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
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${levelStyles[course.learning_level]}`}>
                  {course.learning_level.charAt(0).toUpperCase() + course.learning_level.slice(1)}
                </span>

                {/* XP */}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3.5 w-3.5 text-studyflow-xp" />
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
