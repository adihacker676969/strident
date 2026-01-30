/**
 * CreateCourse.tsx
 * Page for creating a new course with AI-generated learning path
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  GraduationCap,
  Zap,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { useCreateCourse, useCreateTopics } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Learning level type
type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createCourse = useCreateCourse();
  const createTopics = useCreateTopics();

  // Form state
  const [step, setStep] = useState<'details' | 'generating' | 'review'>('details');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [syllabusText, setSyllabusText] = useState('');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>('beginner');
  const [generatedTopics, setGeneratedTopics] = useState<GeneratedTopic[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generated topic structure
  interface GeneratedTopic {
    name: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimated_time: number;
    xp_reward: number;
  }

  // Handle AI generation
  const handleGeneratePath = async () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a course title.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setStep('generating');

    try {
      // Call the AI edge function
      const { data, error } = await supabase.functions.invoke('generate-learning-path', {
        body: {
          subject: title,
          level: learningLevel,
          syllabusText: syllabusText || undefined,
        },
      });

      if (error) throw error;

      // Parse the AI response
      const topics = data.topics as GeneratedTopic[];
      setGeneratedTopics(topics);
      setStep('review');

    } catch (error) {
      console.error('Error generating learning path:', error);
      toast({
        title: 'Generation failed',
        description: 'Failed to generate learning path. Please try again.',
        variant: 'destructive',
      });
      setStep('details');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle course creation
  const handleCreateCourse = async () => {
    try {
      // Create the course
      const course = await createCourse.mutateAsync({
        title,
        description: description || undefined,
        learning_level: learningLevel,
        syllabus_text: syllabusText || undefined,
      });

      // Create topics for the course
      await createTopics.mutateAsync({
        course_id: course.id,
        topics: generatedTopics.map((topic, index) => ({
          name: topic.name,
          description: topic.description,
          difficulty: topic.difficulty,
          estimated_time: topic.estimated_time,
          xp_reward: topic.xp_reward,
          order_index: index + 1,
        })),
      });

      toast({
        title: '🎉 Course created!',
        description: 'Your learning path is ready. Start learning now!',
      });

      navigate(`/course/${course.id}`);

    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: 'Creation failed',
        description: 'Failed to create course. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-3xl px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Step: Details */}
        {step === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Create a New Course
              </h1>
              <p className="mt-2 text-muted-foreground">
                Enter your subject and let AI generate a personalized learning path.
              </p>
            </div>

            <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
              {/* Course title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Python Programming, Organic Chemistry, Machine Learning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What do you want to learn in this course?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Learning level */}
              <div className="space-y-3">
                <Label>Learning Level</Label>
                <div className="grid grid-cols-3 gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                    <LevelButton
                      key={level}
                      level={level}
                      selected={learningLevel === level}
                      onClick={() => setLearningLevel(level)}
                    />
                  ))}
                </div>
              </div>

              {/* Syllabus text */}
              <div className="space-y-2">
                <Label htmlFor="syllabus">
                  Syllabus / Topics (optional)
                </Label>
                <Textarea
                  id="syllabus"
                  placeholder="Paste your syllabus or list of topics here. The AI will use this to create your learning path."
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  You can paste a syllabus, list of topics, or leave empty for AI to generate based on the subject.
                </p>
              </div>

              {/* Generate button */}
              <Button
                variant="hero"
                size="lg"
                className="w-full group"
                onClick={handleGeneratePath}
                disabled={!title.trim()}
              >
                <Sparkles className="h-5 w-5" />
                Generate Learning Path with AI
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step: Generating */}
        {step === 'generating' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Creating Your Learning Path...
            </h2>
            <p className="mt-2 text-muted-foreground">
              Our AI is analyzing your subject and generating personalized topics.
            </p>
            <div className="mx-auto mt-8 max-w-xs">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-studyflow-xp"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 8, ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step: Review */}
        {step === 'review' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-studyflow-success/20">
                <Sparkles className="h-8 w-8 text-studyflow-success" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Your Learning Path is Ready!
              </h1>
              <p className="mt-2 text-muted-foreground">
                Review the topics below and start learning.
              </p>
            </div>

            {/* Course summary */}
            <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
              {description && <p className="mt-1 text-muted-foreground">{description}</p>}
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <GraduationCap className="mr-1.5 h-4 w-4" />
                  {learningLevel.charAt(0).toUpperCase() + learningLevel.slice(1)}
                </span>
                <span className="inline-flex items-center rounded-full bg-studyflow-xp/10 px-3 py-1 text-sm font-medium text-studyflow-xp">
                  <Zap className="mr-1.5 h-4 w-4" />
                  {generatedTopics.reduce((sum, t) => sum + t.xp_reward, 0)} XP Total
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                  <Target className="mr-1.5 h-4 w-4" />
                  {generatedTopics.length} Topics
                </span>
              </div>
            </div>

            {/* Topics list */}
            <div className="space-y-3">
              {generatedTopics.map((topic, index) => (
                <TopicPreviewCard key={index} topic={topic} index={index} />
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('details')}
              >
                <ArrowLeft className="h-4 w-4" />
                Edit Details
              </Button>
              <Button
                variant="hero"
                className="flex-1 group"
                onClick={handleCreateCourse}
                disabled={createCourse.isPending || createTopics.isPending}
              >
                {(createCourse.isPending || createTopics.isPending) ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Course & Start Learning
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

// Level selection button component
const LevelButton = ({ 
  level, 
  selected, 
  onClick 
}: { 
  level: 'beginner' | 'intermediate' | 'advanced'; 
  selected: boolean; 
  onClick: () => void;
}) => {
  const configs = {
    beginner: {
      label: 'Beginner',
      description: 'New to this',
      color: 'green',
    },
    intermediate: {
      label: 'Intermediate',
      description: 'Some knowledge',
      color: 'blue',
    },
    advanced: {
      label: 'Advanced',
      description: 'Deep dive',
      color: 'purple',
    },
  };

  const config = configs[level];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-lg border-2 p-3 text-left transition-all
        ${selected 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50'
        }
      `}
    >
      <span className="block font-medium text-foreground">{config.label}</span>
      <span className="text-xs text-muted-foreground">{config.description}</span>
    </button>
  );
};

// Topic preview card component
const TopicPreviewCard = ({ 
  topic, 
  index 
}: { 
  topic: { name: string; description: string; difficulty: string; estimated_time: number; xp_reward: number }; 
  index: number;
}) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {index + 1}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-foreground">{topic.name}</h3>
        {topic.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{topic.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[topic.difficulty as keyof typeof difficultyColors]}`}>
            {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            ~{topic.estimated_time} min
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-studyflow-xp">
            <Zap className="h-3 w-3" />
            {topic.xp_reward} XP
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCourse;
