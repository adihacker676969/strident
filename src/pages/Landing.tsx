/**
 * Landing.tsx
 * Beautiful landing page for StudyFlow AI
 * Updated with purple-blue gradient, glassmorphism, and floating cards
 */

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  Target, 
  Trophy, 
  Zap, 
  Brain,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { useState, useEffect, useRef } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for parallax
  const springConfig = { damping: 25, stiffness: 100 };
  const parallaxX = useSpring(useTransform(mouseX, [-500, 500], [-20, 20]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-500, 500], [-20, 20]), springConfig);

  // Track mouse position for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden min-h-[calc(100vh-4rem)]"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 gradient-bg-animated" />
        
        {/* Decorative glow orbs */}
        <div className="glow-orb w-96 h-96 bg-primary/30 top-10 -left-48" />
        <div className="glow-orb w-80 h-80 bg-accent/30 top-40 right-0" style={{ animationDelay: '2s' }} />
        <div className="glow-orb w-64 h-64 bg-studyflow-xp/20 bottom-20 left-1/4" style={{ animationDelay: '4s' }} />

        <div className="container relative mx-auto px-4 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left side - Hero text */}
            <div className="max-w-xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-sm font-medium text-primary"
              >
                <Sparkles className="h-4 w-4" />
                AI-Powered Learning Platform
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight"
              >
                Study smarter.
                <br />
                <span className="gradient-text">Not longer.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg text-muted-foreground lg:text-xl leading-relaxed"
              >
                An AI-powered platform that creates personalized study plans, 
                keeps you focused, and helps you actually finish what you start.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10"
              >
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => navigate('/signup')}
                  className="group btn-glow"
                >
                  Generate My Study Plan
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 flex flex-wrap gap-8"
              >
                <StatItem value="1000+" label="Subjects" />
                <StatItem value="AI" label="Powered" />
                <StatItem value="XP" label="Gamified" />
              </motion.div>
            </div>

            {/* Right side - Floating glassmorphism cards */}
            <motion.div 
              className="hidden lg:block relative"
              style={{ x: parallaxX, y: parallaxY }}
            >
              <FloatingCards />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/50 bg-muted/30 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to <span className="gradient-text">Master Any Subject</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our AI-powered platform adapts to your learning style and helps you achieve your goals.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="AI Learning Paths"
              description="Upload any syllabus or topic and our AI will create a personalized, structured learning path just for you."
              delay={0}
            />
            <FeatureCard
              icon={Zap}
              title="Gamified Progress"
              description="Earn XP, unlock badges, maintain streaks, and climb the leaderboard as you learn."
              delay={0.1}
            />
            <FeatureCard
              icon={Target}
              title="Smart Quizzes"
              description="AI-generated quizzes that test your knowledge and adapt to your progress."
              delay={0.2}
            />
            <FeatureCard
              icon={BookOpen}
              title="Curated Resources"
              description="We find the best YouTube videos, articles, and community recommendations for each topic."
              delay={0.3}
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Study Assistant"
              description="Ask questions, get explanations, and receive personalized study tips from your AI companion."
              delay={0.4}
            />
            <FeatureCard
              icon={Trophy}
              title="Smart Revision"
              description="Our spaced repetition system reminds you when to revise topics to maximize retention."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in just three simple steps
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <StepCard
              step={1}
              title="Create a Course"
              description="Enter a subject name or upload your syllabus. Choose your learning level."
            />
            <StepCard
              step={2}
              title="AI Generates Your Path"
              description="Our AI analyzes your content and creates a structured learning path with topics."
            />
            <StepCard
              step={3}
              title="Learn & Level Up"
              description="Watch curated videos, take quizzes, earn XP, and track your progress."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-animated opacity-50" />
        <div className="container relative mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Ready to Transform Your Learning?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of learners who are mastering subjects faster with AI.
            </p>
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate('/signup')}
              className="mt-8 group btn-glow"
            >
              Get Started — It's Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold gradient-text">StudyFlow AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StudyFlow AI. Learn smarter, not harder.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Stat item component
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col">
    <span className="font-display text-2xl font-bold text-foreground">{value}</span>
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

// Feature card component with glassmorphism
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="group glass-card rounded-2xl p-6 card-hover"
  >
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-all group-hover:from-primary group-hover:to-accent group-hover:text-primary-foreground group-hover:scale-110">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </motion.div>
);

// Step card component
const StepCard = ({ step, title, description }: { step: number; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: step * 0.1 }}
    className="relative text-center"
  >
    <motion.div 
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground shadow-lg"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {step}
    </motion.div>
    <h3 className="mt-6 font-display text-xl font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </motion.div>
);

// Floating Cards Component for Hero Section
const FloatingCards = () => {
  return (
    <div className="relative w-full max-w-md ml-auto">
      {/* Progress Card */}
      <motion.div
        className="glass-card rounded-2xl p-6 w-52 absolute top-0 right-0"
        initial={{ opacity: 0, x: 50, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="float-slow">
          <p className="text-sm font-medium text-muted-foreground mb-3">Your Progress</p>
          <ProgressCircle progress={72} />
        </div>
      </motion.div>

      {/* Focus Mode Card */}
      <motion.div
        className="glass-card rounded-2xl p-6 w-56 absolute top-36 left-0"
        initial={{ opacity: 0, x: 50, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="float" style={{ animationDelay: '0.5s' }}>
          <FocusModeCard />
        </div>
      </motion.div>

      {/* Tasks Card */}
      <motion.div
        className="glass-card rounded-2xl p-6 w-52 absolute top-72 right-8"
        initial={{ opacity: 0, x: 50, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <div className="float-fast" style={{ animationDelay: '1s' }}>
          <TasksCard />
        </div>
      </motion.div>
    </div>
  );
};

// Progress Circle Component
const ProgressCircle = ({ progress }: { progress: number }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted/30"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
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
  );
};

// Focus Mode Card Component
const FocusModeCard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && seconds > 0) {
      interval = setInterval(() => setSeconds(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, seconds]);

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Timer className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Focus Mode</p>
      </div>
      <div className="text-center">
        <p className="text-4xl font-bold text-foreground font-display tracking-tight">
          {formatTime(seconds)}
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </motion.button>
        </div>
      </div>
    </>
  );
};

// Tasks Card Component
const TasksCard = () => {
  const tasks = [
    { name: 'DSA', time: '2h', done: false },
    { name: 'Physics', time: '1h', done: true },
    { name: 'React', time: '1.5h', done: false },
  ];

  return (
    <>
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
    </>
  );
};

export default Landing;
