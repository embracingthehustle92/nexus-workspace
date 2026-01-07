import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  FolderOpen, 
  Kanban, 
  Mail, 
  Code2, 
  Sparkles,
  ArrowRight,
  Layers,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  Play
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Suspense, lazy } from "react";

const Workspace3D = lazy(() => import("@/components/Workspace3D"));

const features = [
  {
    icon: FileText,
    title: "AI Notes",
    description: "Notion-style note-taking with AI-powered writing assistance",
    color: "from-blue-500 to-cyan-500",
    path: "/notes"
  },
  {
    icon: Users,
    title: "Smart CRM",
    description: "Manage contacts, companies, and deals with AI insights",
    color: "from-purple-500 to-pink-500",
    path: "/crm"
  },
  {
    icon: FolderOpen,
    title: "Content Hub",
    description: "Centralized content management for all your assets",
    color: "from-orange-500 to-red-500",
    path: "/content"
  },
  {
    icon: Kanban,
    title: "Projects",
    description: "Visual project management with Kanban boards and timelines",
    color: "from-green-500 to-emerald-500",
    path: "/projects"
  },
  {
    icon: Mail,
    title: "Email",
    description: "Unified inbox with AI-powered composition and organization",
    color: "from-pink-500 to-rose-500",
    path: "/email"
  },
  {
    icon: Code2,
    title: "Code IDE",
    description: "Full-featured code editor with AI terminal and assistance",
    color: "from-indigo-500 to-violet-500",
    path: "/code"
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance for seamless productivity"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance ready"
  },
  {
    icon: Globe,
    title: "Work Anywhere",
    description: "Access your workspace from any device, anytime"
  },
];

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleModuleSelect = (moduleId: string) => {
    const feature = features.find(f => f.path.includes(moduleId));
    if (feature) {
      setLocation(feature.path);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Nexus</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#workspace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Workspace</a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="gradient-primary">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button className="gradient-primary" asChild>
                <a href={getLoginUrl()}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm">AI-Powered Virtual Workspace</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Complete
              <span className="gradient-text block">Enterprise Workspace</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A modern all-in-one platform combining AI note-taking, CRM, content management, 
              project boards, email, and a full development environment.
            </p>
            <div className="flex items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gradient-primary">
                    Open Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button size="lg" className="gradient-primary" asChild>
                  <a href={getLoginUrl()}>
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              )}
              <Button size="lg" variant="outline" className="glass">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold gradient-text">10K+</p>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold gradient-text">99.9%</p>
              <p className="text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold gradient-text">50+</p>
              <p className="text-muted-foreground">Integrations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Workspace Section */}
      <section id="workspace" className="py-20 relative">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Interactive 3D Workspace
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Navigate your workspace in an immersive 3D environment. Click on any module to explore.
            </p>
          </div>
          <Card className="glass overflow-hidden max-w-5xl mx-auto">
            <CardContent className="p-0">
              <div className="h-[500px] w-full">
                <Suspense fallback={
                  <div className="h-full flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                }>
                  <Workspace3D onModuleSelect={handleModuleSelect} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Six powerful modules working together to supercharge your productivity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} href={isAuthenticated ? feature.path : "#"}>
                <Card className="glass h-full hover:border-primary/50 transition-all cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {feature.title}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Enterprise
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted by teams worldwide for mission-critical work
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl glass mx-auto mb-4 flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="glass overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join thousands of teams already using Nexus to collaborate smarter and faster.
                </p>
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="gradient-primary">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" className="gradient-primary" asChild>
                    <a href={getLoginUrl()}>
                      Get Started for Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Nexus Workspace</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Nexus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
