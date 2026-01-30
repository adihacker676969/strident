/**
 * Landing.tsx
 * Beautiful landing page for StudyFlow AI
 */

import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-studyflow-xp/5" />
        
        {/* Floating elements */}
        <div className="absolute left-10 top-32 h-20 w-20 rounded-full bg-primary/10 blur-2xl float" />
        <div className="absolute right-20 top-48 h-32 w-32 rounded-full bg-studyflow-xp/10 blur-3xl float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 h-24 w-24 rounded-full bg-studyflow-streak/10 blur-2xl float" style={{ animationDelay: '2s' }} />

        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <Sparkles className="h-4 w-4" />
              AI-Powered Learning Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Learn{' '}
              <span className="gradient-text">Any Subject</span>
              <br />
              With AI-Powered Gamification
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl"
            >
              From coding to science, college subjects to competitive exams — 
              upload any syllabus and let AI create your personalized learning path with 
              quizzes, videos, and gamified progress tracking.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate('/signup')}
                className="group"
              >
                Start Learning Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => navigate('/login')}
              >
                I Already Have an Account
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
            >
              <StatItem icon={BookOpen} value="1000+" label="Subjects" />
              <StatItem icon={Brain} value="AI" label="Powered" />
              <StatItem icon={Trophy} value="XP" label="Gamified" />
              <StatItem icon={Rocket} value="Fast" label="Learning" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to <span className="gradient-text">Master Any Subject</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our AI-powered platform adapts to your learning style and helps you achieve your goals.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="AI Learning Paths"
              description="Upload any syllabus or topic and our AI will create a personalized, structured learning path just for you."
              delay={0}
            />
            <FeatureCard
              icon={Zap}
              title="Gamified Progress"
              description="Earn XP, unlock badges, maintain streaks, and climb the leaderboard as you learn. Learning has never been this fun!"
              delay={0.1}
            />
            <FeatureCard
              icon={Target}
              title="Smart Quizzes"
              description="AI-generated quizzes that test your knowledge and adapt to your progress. Get instant feedback and explanations."
              delay={0.2}
            />
            <FeatureCard
              icon={BookOpen}
              title="Curated Resources"
              description="We find the best YouTube videos, articles, and community recommendations for each topic you're learning."
              delay={0.3}
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Study Assistant"
              description="Ask questions, get explanations, and receive personalized study tips from your AI learning companion."
              delay={0.4}
            />
            <FeatureCard
              icon={Trophy}
              title="Smart Revision"
              description="Our spaced repetition system reminds you when to revise topics to maximize retention and save time."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in just three simple steps
            </p>
          </div>

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
      <section className="border-t border-border bg-gradient-to-br from-primary/5 via-background to-studyflow-xp/5 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
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
              className="mt-8 group"
            >
              Get Started — It's Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
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
const StatItem = ({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <span className="mt-2 font-display text-2xl font-bold text-foreground">{value}</span>
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

// Feature card component
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
    className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-lg card-hover"
  >
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(168,76%,36%)] text-2xl font-bold text-primary-foreground shadow-lg">
      {step}
    </div>
    <h3 className="mt-6 font-display text-xl font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </motion.div>
);

export default Landing;
