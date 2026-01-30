/**
 * ProgressRing.tsx
 * Circular progress indicator for visualizing completion
 */

import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  color?: 'primary' | 'xp' | 'streak' | 'success';
}

export const ProgressRing = ({
  progress,
  size = 80,
  strokeWidth = 6,
  showPercentage = true,
  color = 'primary',
}: ProgressRingProps) => {
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Color mappings
  const colors = {
    primary: 'stroke-primary',
    xp: 'stroke-studyflow-xp',
    streak: 'stroke-studyflow-streak',
    success: 'stroke-studyflow-success',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`fill-none ${colors[color]}`}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};
