import { CheckSquare, LayoutDashboard, BarChart3, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="animate-fade-in space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="h-4 w-4" />
            Enterprise-grade task management
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Manage tasks with
            <span className="text-primary block mt-2">data-driven insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful SaaS platform for teams to organize projects, track productivity, and make smarter decisions with real-time analytics.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline">View Demo</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: LayoutDashboard, title: 'Kanban Boards', description: 'Visualize workflows with drag-and-drop task management across customizable columns.' },
            { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track team velocity, completion rates, and project progress with beautiful charts.' },
            { icon: Zap, title: 'AI Assistant', description: 'Get smart task suggestions and priority recommendations powered by AI.' },
          ].map((feature, i) => (
            <div key={i} className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 TaskFlow. Enterprise Task Management Platform.</p>
        </div>
      </footer>
    </div>
  );
}
