import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useCreateTask } from '@/hooks/useTasks';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Lightbulb, 
  ListOrdered, 
  MessageSquare, 
  Send, 
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface Suggestion {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  reasoning: string;
}

interface PriorityRecommendation {
  taskTitle: string;
  recommendedPriority: 'low' | 'medium' | 'high';
  reasoning: string;
  suggestedAction?: string;
}

export default function AIAssistant() {
  const { data: tasks } = useTasks();
  const { data: projects } = useProjects();
  const createTask = useCreateTask();
  const { toast } = useToast();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recommendations, setRecommendations] = useState<{ recommendations: PriorityRecommendation[]; summary: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState<'suggest' | 'prioritize' | 'chat' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (type: string, context: any) => {
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: { type, context }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);
    return data;
  };

  const handleGetSuggestions = async () => {
    setIsLoading('suggest');
    setError(null);
    try {
      const result = await callAI('suggest', { tasks, projects });
      setSuggestions(result.suggestions || []);
      toast({ title: 'Suggestions generated!', description: `${result.suggestions?.length || 0} task ideas ready` });
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Failed to get suggestions', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(null);
    }
  };

  const handlePrioritize = async () => {
    if (!tasks?.length) {
      toast({ title: 'No tasks to prioritize', description: 'Create some tasks first', variant: 'destructive' });
      return;
    }
    setIsLoading('prioritize');
    setError(null);
    try {
      const result = await callAI('prioritize', { tasks });
      setRecommendations(result);
      toast({ title: 'Prioritization complete!' });
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Failed to prioritize', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(null);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading('chat');
    setError(null);

    try {
      const result = await callAI('chat', { message: userMessage, tasks, projects });
      setChatMessages(prev => [...prev, { role: 'assistant', content: result.message }]);
    } catch (err: any) {
      setError(err.message);
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an error: ${err.message}` }]);
    } finally {
      setIsLoading(null);
    }
  };

  const handleAddSuggestion = async (suggestion: Suggestion) => {
    if (!projects?.length) {
      toast({ title: 'Create a project first', description: 'You need at least one project to add tasks', variant: 'destructive' });
      return;
    }

    try {
      await createTask.mutateAsync({
        title: suggestion.title,
        description: suggestion.description || suggestion.reasoning,
        project_id: projects[0].id,
        priority: suggestion.priority,
        status: 'todo',
      });
      setSuggestions(prev => prev.filter(s => s.title !== suggestion.title));
      toast({ title: 'Task created!', description: suggestion.title });
    } catch (err: any) {
      toast({ title: 'Failed to create task', description: err.message, variant: 'destructive' });
    }
  };

  const priorityColors = {
    high: 'bg-destructive/10 text-destructive border-destructive/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    low: 'bg-accent/10 text-accent border-accent/20',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground">Get smart suggestions and insights powered by AI</p>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Smart Suggestions</CardTitle>
                <CardDescription>Get AI-powered task recommendations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGetSuggestions} 
              disabled={isLoading === 'suggest'}
              className="w-full"
            >
              {isLoading === 'suggest' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Suggestions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <ListOrdered className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Priority Analysis</CardTitle>
                <CardDescription>Get recommendations on task priorities</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handlePrioritize} 
              disabled={isLoading === 'prioritize' || !tasks?.length}
              variant="secondary"
              className="w-full"
            >
              {isLoading === 'prioritize' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ListOrdered className="h-4 w-4 mr-2" />
                  Analyze Priorities
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions Results */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              Suggested Tasks
            </CardTitle>
            <CardDescription>Click to add any suggestion as a new task</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <Badge variant="outline" className={priorityColors[suggestion.priority]}>
                      {suggestion.priority}
                    </Badge>
                    <Badge variant="outline">{suggestion.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleAddSuggestion(suggestion)}
                  disabled={createTask.isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Priority Recommendations */}
      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-primary" />
              Priority Recommendations
            </CardTitle>
            <CardDescription>{recommendations.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.recommendations.map((rec, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{rec.taskTitle}</h4>
                  <Badge variant="outline" className={priorityColors[rec.recommendedPriority]}>
                    → {rec.recommendedPriority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                {rec.suggestedAction && (
                  <p className="text-sm mt-2 text-primary">💡 {rec.suggestedAction}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Ask AI</CardTitle>
              <CardDescription>Chat about your projects, tasks, or get productivity tips</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          {chatMessages.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto p-4 rounded-lg bg-secondary/30">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading === 'chat' && (
                <div className="flex justify-start">
                  <div className="bg-card border p-3 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Input */}
          <div className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your projects, get tips, or request help..."
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChat()}
              disabled={isLoading === 'chat'}
            />
            <Button onClick={handleChat} disabled={isLoading === 'chat' || !chatInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
