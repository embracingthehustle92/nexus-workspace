import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  Users, 
  FolderOpen, 
  Kanban, 
  Mail, 
  Code2, 
  Search,
  Plus,
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  GripVertical,
  Home,
  Layers,
  LayoutGrid,
  List,
  CalendarDays,
  Target,
  Sparkles
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { getLoginUrl } from "@/const";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/dashboard" },
  { id: "notes", label: "Notes", icon: FileText, path: "/notes" },
  { id: "crm", label: "CRM", icon: Users, path: "/crm" },
  { id: "content", label: "Content", icon: FolderOpen, path: "/content" },
  { id: "projects", label: "Projects", icon: Kanban, path: "/projects" },
  { id: "email", label: "Email", icon: Mail, path: "/email" },
  { id: "code", label: "Code", icon: Code2, path: "/code" },
];

const projects = [
  { id: 1, name: "Website Redesign", description: "Complete overhaul of company website", progress: 65, status: "active", color: "#6366f1", tasks: 24, completedTasks: 16 },
  { id: 2, name: "Mobile App v2", description: "New version of mobile application", progress: 30, status: "active", color: "#8b5cf6", tasks: 45, completedTasks: 14 },
  { id: 3, name: "Marketing Campaign", description: "Q4 marketing initiatives", progress: 85, status: "active", color: "#ec4899", tasks: 18, completedTasks: 15 },
  { id: 4, name: "API Integration", description: "Third-party API integrations", progress: 100, status: "completed", color: "#10b981", tasks: 12, completedTasks: 12 },
];

const columns = [
  { id: "backlog", title: "Backlog", color: "bg-gray-500" },
  { id: "todo", title: "To Do", color: "bg-blue-500" },
  { id: "in_progress", title: "In Progress", color: "bg-yellow-500" },
  { id: "review", title: "Review", color: "bg-purple-500" },
  { id: "done", title: "Done", color: "bg-green-500" },
];

const tasks = [
  { id: 1, title: "Design homepage mockup", status: "done", priority: "high", assignee: "JD", dueDate: "Jan 5", projectId: 1 },
  { id: 2, title: "Implement navigation", status: "in_progress", priority: "high", assignee: "MC", dueDate: "Jan 8", projectId: 1 },
  { id: 3, title: "Create contact form", status: "todo", priority: "medium", assignee: "SJ", dueDate: "Jan 10", projectId: 1 },
  { id: 4, title: "SEO optimization", status: "backlog", priority: "low", assignee: null, dueDate: "Jan 15", projectId: 1 },
  { id: 5, title: "User authentication", status: "review", priority: "high", assignee: "JD", dueDate: "Jan 6", projectId: 2 },
  { id: 6, title: "Push notifications", status: "in_progress", priority: "medium", assignee: "MC", dueDate: "Jan 12", projectId: 2 },
  { id: 7, title: "Social media ads", status: "done", priority: "high", assignee: "SJ", dueDate: "Jan 3", projectId: 3 },
  { id: 8, title: "Email campaign", status: "in_progress", priority: "high", assignee: "ED", dueDate: "Jan 7", projectId: 3 },
  { id: 9, title: "Analytics setup", status: "todo", priority: "medium", assignee: null, dueDate: "Jan 14", projectId: 3 },
];

const priorityColors: Record<string, string> = {
  high: "bg-red-500/20 text-red-400 border-red-500/50",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  low: "bg-green-500/20 text-green-400 border-green-500/50",
};

export default function Projects() {
  const { user, loading, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<"board" | "list" | "timeline">("board");
  const [selectedProject, setSelectedProject] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md glass">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
              <Kanban className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full gradient-primary" asChild>
              <a href={getLoginUrl()}>Sign In to Continue</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectTasks = selectedProject 
    ? tasks.filter(t => t.projectId === selectedProject)
    : tasks;

  const filteredTasks = projectTasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAiSuggest = () => {
    toast.info("AI Suggestions", { description: "AI project suggestions coming soon!" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 flex items-center gap-3">
          <Link href="/dashboard">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center cursor-pointer hover:opacity-90">
              <Layers className="w-5 h-5 text-white" />
            </div>
          </Link>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">Nexus</h1>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        <div className="p-4">
          <Button className="w-full justify-start gap-2" variant="outline">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2">PROJECTS</p>
            {projects.map((project) => (
              <Button
                key={project.id}
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  selectedProject === project.id ? "bg-sidebar-accent" : ""
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: project.color }}
                />
                <span className="flex-1 text-left truncate">{project.name}</span>
                <span className="text-xs text-muted-foreground">{project.progress}%</span>
              </Button>
            ))}
          </div>

          <Separator className="my-4 bg-sidebar-border" />

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.startsWith(item.path);
              return (
                <Link key={item.id} href={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 ${
                      isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold">
              {selectedProject ? projects.find(p => p.id === selectedProject)?.name : "All Projects"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedProject ? projects.find(p => p.id === selectedProject)?.description : "Manage all your projects"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleAiSuggest}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Suggest
            </Button>
            <Button size="sm" className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="h-14 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search tasks..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === "board" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("board")}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Board
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewMode === "timeline" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Timeline
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          {viewMode === "board" && (
            <div className="p-6">
              <div className="flex gap-4 min-w-max">
                {columns.map((column) => {
                  const columnTasks = filteredTasks.filter(t => t.status === column.id);
                  return (
                    <div key={column.id} className="w-72 flex-shrink-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${column.color}`} />
                          <span className="font-medium">{column.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {columnTasks.length}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {columnTasks.map((task) => (
                          <Card 
                            key={task.id} 
                            className="glass cursor-pointer hover:border-primary/50 transition-all"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-2 mb-3">
                                <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 cursor-grab" />
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{task.title}</h4>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${priorityColors[task.priority]}`}
                                  >
                                    {task.priority}
                                  </Badge>
                                  {task.dueDate && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {task.dueDate}
                                    </span>
                                  )}
                                </div>
                                {task.assignee && (
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                      {task.assignee}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <Button 
                          variant="ghost" 
                          className="w-full border border-dashed border-border text-muted-foreground"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === "list" && (
            <div className="p-6 space-y-2">
              {filteredTasks.map((task) => {
                const column = columns.find(c => c.id === task.status);
                return (
                  <Card key={task.id} className="glass hover:border-primary/50 cursor-pointer transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-8 rounded-full ${column?.color}`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{column?.title}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={priorityColors[task.priority]}
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {task.dueDate}
                        </span>
                        {task.assignee && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-primary/20 text-primary">
                              {task.assignee}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Move</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {viewMode === "timeline" && (
            <div className="p-6">
              <div className="space-y-4">
                {projects.filter(p => !selectedProject || p.id === selectedProject).map((project) => (
                  <Card key={project.id} className="glass">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: project.color }}
                          />
                          <h3 className="font-semibold">{project.name}</h3>
                          <Badge variant="secondary">{project.status}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {project.completedTasks}/{project.tasks} tasks
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-3 mb-4" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Progress: {project.progress}%</span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {project.tasks - project.completedTasks} remaining
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </main>
    </div>
  );
}
