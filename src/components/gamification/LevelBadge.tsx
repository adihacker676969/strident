/**
 * LevelBadge.tsx
 * Displays the user's current level with a styled badge
 */

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

export const LevelBadge = ({ level, size = 'md' }: LevelBadgeProps) => {
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

  // Level colors based on level
  const getLevelColor = () => {
    if (level >= 4) return 'from-yellow-400 to-amber-500';
    if (level >= 3) return 'from-blue-400 to-blue-600';
    if (level >= 2) return 'from-green-400 to-emerald-500';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <motion.div
      className={`
        inline-flex items-center gap-1.5 rounded-full font-bold
        bg-gradient-to-r ${getLevelColor()}
        text-primary-foreground shadow-md
        ${sizes[size].container}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Star className={`${sizes[size].icon} fill-current`} />
      <span>Level {level}</span>
    </motion.div>
  );
};
