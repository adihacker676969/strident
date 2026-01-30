/**
 * Learn.tsx
 * Topic learning page with video player, notes, and quiz
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2,
  Loader2,
  Sparkles,
  MessageSquare,
  FileText,
  HelpCircle,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { useCompleteTopic } from '@/hooks/useCourses';
import { useAddXP } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Learn = () => {
  const { id: topicId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const completeTopic = useCompleteTopic();
  const addXP = useAddXP();

  // State
  const [notes, setNotes] = useState('');
  const [aiNotes, setAiNotes] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant'; content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  // Fetch topic data
  const { data: topic, isLoading } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      if (!topicId) return null;
      
      const { data, error } = await supabase
        .from('topics')
        .select('*, courses(*)')
        .eq('id', topicId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!topicId,
  });

  // Generate AI notes
  const handleGenerateNotes = async () => {
    if (!topic) return;
    
    setIsGeneratingNotes(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-notes', {
        body: {
          topic: topic.name,
          description: topic.description,
          level: topic.courses?.learning_level || 'beginner',
        },
      });

      if (error) throw error;
      setAiNotes(data.notes);
    } catch (error) {
      toast({
        title: 'Failed to generate notes',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  // Chat with AI
  const handleSendChat = async () => {
    if (!chatInput.trim() || !topic) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatting(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: [
            ...chatMessages,
            { role: 'user', content: userMessage }
          ],
          context: {
            topic: topic.name,
            description: topic.description,
            level: topic.courses?.learning_level || 'beginner',
          },
        },
      });

      if (error) throw error;
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      toast({
        title: 'Chat failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsChatting(false);
    }
  };

  // Mark topic as complete
  const handleComplete = async () => {
    if (!topic) return;

    try {
      await completeTopic.mutateAsync({ 
        topicId: topic.id, 
        courseId: topic.course_id 
      });
      
      // Add XP
      await addXP.mutateAsync(topic.xp_reward);

      toast({
        title: '🎉 Topic Completed!',
        description: `You earned ${topic.xp_reward} XP!`,
      });

      // Navigate back to course
      navigate(`/course/${topic.course_id}`);
    } catch (error) {
      toast({
        title: 'Failed to complete topic',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Topic not found</h1>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/course/${topic.course_id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Topic header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                {topic.name}
              </h1>
              {topic.description && (
                <p className="mt-2 text-muted-foreground">{topic.description}</p>
              )}
              <div className="mt-3 flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm font-medium text-studyflow-xp">
                  <Zap className="h-4 w-4" />
                  {topic.xp_reward} XP
                </span>
                <span className="text-sm text-muted-foreground">
                  ~{topic.estimated_time} min
                </span>
              </div>
            </motion.div>

            {/* Tabs for content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs defaultValue="learn" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="learn" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Learn
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Ask AI
                  </TabsTrigger>
                </TabsList>

                {/* Learn tab */}
                <TabsContent value="learn" className="mt-4">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h2 className="font-display text-lg font-semibold">Study Material</h2>
                    </div>
                    <p className="text-muted-foreground">
                      Start learning about <strong>{topic.name}</strong>. Take your time to understand the concepts, 
                      then use the AI assistant to clarify any doubts.
                    </p>
                    <div className="mt-6 rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Tip:</strong> Use the "Ask AI" tab to get explanations tailored to your level. 
                        The AI knows what you're learning and can help you understand better!
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Notes tab */}
                <TabsContent value="notes" className="mt-4">
                  <div className="space-y-4">
                    {/* AI Generated Notes */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-studyflow-xp" />
                          <h2 className="font-display text-lg font-semibold">AI Notes</h2>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateNotes}
                          disabled={isGeneratingNotes}
                        >
                          {isGeneratingNotes ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Generate Notes
                            </>
                          )}
                        </Button>
                      </div>
                      {aiNotes ? (
                        <div className="prose prose-sm max-w-none text-foreground">
                          <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
                            {aiNotes}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Click "Generate Notes" to get AI-powered study notes for this topic.
                        </p>
                      )}
                    </div>

                    {/* Personal Notes */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h2 className="font-display text-lg font-semibold">Your Notes</h2>
                      </div>
                      <Textarea
                        placeholder="Write your own notes here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={6}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Chat tab */}
                <TabsContent value="chat" className="mt-4">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <h2 className="font-display text-lg font-semibold">Ask AI About This Topic</h2>
                    </div>

                    {/* Chat messages */}
                    <div className="mb-4 max-h-80 space-y-3 overflow-y-auto scrollbar-custom">
                      {chatMessages.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                          Ask a question about {topic.name}. The AI will explain in a way that matches your level!
                        </p>
                      ) : (
                        chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`rounded-lg p-3 ${
                              msg.role === 'user'
                                ? 'bg-primary/10 text-foreground ml-8'
                                : 'bg-muted text-foreground mr-8'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        ))
                      )}
                      {isChatting && (
                        <div className="bg-muted rounded-lg p-3 mr-8 flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      )}
                    </div>

                    {/* Chat input */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ask a question..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        rows={2}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChat();
                          }
                        }}
                      />
                      <Button onClick={handleSendChat} disabled={!chatInput.trim() || isChatting}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 space-y-4"
            >
              {/* Progress card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-semibold text-foreground">Your Progress</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {topic.is_completed 
                    ? '✅ You\'ve completed this topic!'
                    : 'Complete this topic to earn XP and continue your learning journey.'
                  }
                </p>

                {!topic.is_completed && (
                  <Button
                    variant="hero"
                    className="mt-4 w-full"
                    onClick={handleComplete}
                    disabled={completeTopic.isPending}
                  >
                    {completeTopic.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as Complete
                        <span className="ml-1 text-xs opacity-80">+{topic.xp_reward} XP</span>
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Quick actions */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-semibold text-foreground">Quick Actions</h3>
                <div className="mt-3 space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleGenerateNotes}>
                    <Sparkles className="h-4 w-4" />
                    Generate AI Notes
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
