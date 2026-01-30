/**
 * XPBadge.tsx
 * Displays the user's XP with a gradient animated badge
 */

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const XPBadge = ({ xp, size = 'md', showLabel = true }: XPBadgeProps) => {
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
        bg-gradient-to-r from-studyflow-xp to-studyflow-badge
        text-primary-foreground shadow-md xp-pulse
        ${sizes[size].container}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Zap className={`${sizes[size].icon} fill-current`} />
      <span>{xp.toLocaleString()}</span>
      {showLabel && <span className="opacity-80">XP</span>}
    </motion.div>
  );
};
