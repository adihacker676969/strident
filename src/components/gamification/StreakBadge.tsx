/**
 * StreakBadge.tsx
 * Displays the user's current streak with fire animation
 */

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StreakBadge = ({ streak, size = 'md' }: StreakBadgeProps) => {
  // Size configurations
  const sizes = {
    sm: {
      container: 'h-7 px-2.5 text-xs',
      icon: 'h-3.5 w-3.5',
    },
    md: {
      container: 'h-9 px-3.5 text-sm',
      icon: 'h-4 w-4',
    },
    lg: {
      container: 'h-11 px-4 text-base',
      icon: 'h-5 w-5',
    },
  };

  return (
    <motion.div
      className={`
        inline-flex items-center gap-1.5 rounded-full font-bold
        bg-gradient-to-r from-studyflow-streak to-studyflow-warning
        text-primary-foreground shadow-md
        ${sizes[size].container}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Flame className={`${sizes[size].icon} fill-current streak-fire`} />
      <span>{streak}</span>
      <span className="opacity-80">day{streak !== 1 ? 's' : ''}</span>
    </motion.div>
  );
};
