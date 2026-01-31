/**
 * FloatingCards.tsx
 * Glassmorphism floating cards for the hero section
 * Shows Progress, Focus Mode, and Today's Tasks
 */

import { motion } from 'framer-motion';
import { Play, Pause, BookOpen, Timer, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Progress Card - Shows circular progress indicator
const ProgressCard = () => {
  const progress = 72;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 w-48"
      initial={{ opacity: 0, x: 50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <p className="text-sm font-medium text-muted-foreground mb-3">Your Progress</p>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/30"
            />
            {/* Progress circle with gradient */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
              }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(250, 70%, 60%)" />
                <stop offset="100%" stopColor="hsl(220, 90%, 56%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Focus Mode Card - Shows Pomodoro timer
const FocusModeCard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60); // 25 minutes

  // Format time as MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Timer effect (demo only - counts down when playing)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, seconds]);

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 w-52"
      initial={{ opacity: 0, x: 50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Timer className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Focus Mode</p>
      </div>
      <div className="text-center">
        <p className="text-4xl font-bold text-foreground font-display tracking-tight">
          {formatTime(seconds)}
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 shadow-md"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Today's Tasks Card
const TasksCard = () => {
  const tasks = [
    { name: 'DSA', time: '2h', done: false },
    { name: 'Physics', time: '1h', done: true },
    { name: 'React', time: '1.5h', done: false },
  ];

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 w-52"
      initial={{ opacity: 0, x: 50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Today's Tasks</p>
      </div>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 
                className={`h-4 w-4 ${task.done ? 'text-studyflow-success' : 'text-muted-foreground/40'}`} 
              />
              <span className={`text-sm font-medium ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.name}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{task.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Main FloatingCards component - Combines all cards with floating animation
export const FloatingCards = () => {
  return (
    <div className="relative w-full max-w-md">
      {/* Stack of floating cards with different animations */}
      <div className="relative space-y-4">
        <div className="float-slow">
          <ProgressCard />
        </div>
        <div className="float ml-8" style={{ animationDelay: '0.5s' }}>
          <FocusModeCard />
        </div>
        <div className="float-fast ml-4" style={{ animationDelay: '1s' }}>
          <TasksCard />
        </div>
      </div>
    </div>
  );
};
