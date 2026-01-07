import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  FolderOpen, 
  Kanban, 
  Mail, 
  Code2, 
  Settings, 
  LogOut,
  Home,
  Search,
  Bell,
  Plus,
  Star,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Sparkles,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  Link2,
  Image,
  Heading1,
  Heading2,
  Quote,
  Layers
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { getLoginUrl } from "@/const";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
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

interface NoteItem {
  id: number;
  title: string;
  icon: string;
  isFavorite: boolean;
  children?: NoteItem[];
  updatedAt: string;
}

const sampleNotes: NoteItem[] = [
  { id: 1, title: "Getting Started", icon: "📚", isFavorite: true, updatedAt: "2 hours ago" },
  { id: 2, title: "Meeting Notes", icon: "📝", isFavorite: false, updatedAt: "Yesterday", children: [
    { id: 21, title: "Q4 Planning", icon: "📊", isFavorite: false, updatedAt: "Yesterday" },
    { id: 22, title: "Team Standup", icon: "👥", isFavorite: false, updatedAt: "2 days ago" },
  ]},
  { id: 3, title: "Project Ideas", icon: "💡", isFavorite: true, updatedAt: "3 days ago" },
  { id: 4, title: "Research", icon: "🔬", isFavorite: false, updatedAt: "1 week ago", children: [
    { id: 41, title: "Market Analysis", icon: "📈", isFavorite: false, updatedAt: "1 week ago" },
    { id: 42, title: "Competitor Review", icon: "🎯", isFavorite: false, updatedAt: "1 week ago" },
  ]},
  { id: 5, title: "Personal", icon: "🏠", isFavorite: false, updatedAt: "2 weeks ago" },
];

function NoteTreeItem({ note, level = 0, selectedId, onSelect }: { 
  note: NoteItem; 
  level?: number; 
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = note.children && note.children.length > 0;

  return (
    <div>
      <div 
        className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer group transition-colors ${
          selectedId === note.id ? "bg-primary/20 text-primary" : "hover:bg-muted"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(note.id)}
      >
        {hasChildren ? (
          <button 
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="w-4 h-4 flex items-center justify-center"
          >
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span className="text-base">{note.icon}</span>
        <span className="flex-1 truncate text-sm">{note.title}</span>
        {note.isFavorite && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-6 h-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Star className="w-4 h-4 mr-2" />
              {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="w-4 h-4 mr-2" />
              Add subpage
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {hasChildren && expanded && (
        <div>
          {note.children!.map((child) => (
            <NoteTreeItem 
              key={child.id} 
              note={child} 
              level={level + 1} 
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Notes() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [selectedNote, setSelectedNote] = useState<number | null>(1);
  const [noteTitle, setNoteTitle] = useState("Getting Started");
  const [noteContent, setNoteContent] = useState(`# Welcome to Nexus Notes

This is your AI-powered note-taking workspace. Here's what you can do:

## Features

- **Rich Text Editing**: Format your notes with headers, lists, code blocks, and more
- **AI Assistance**: Use AI to help write, summarize, or expand your content
- **Hierarchical Organization**: Create nested pages and folders
- **Quick Search**: Find any note instantly with powerful search

## Getting Started

1. Create a new note using the + button
2. Organize notes into folders
3. Use the AI assistant for writing help
4. Star important notes for quick access

> Pro tip: Use keyboard shortcuts for faster editing!

\`\`\`javascript
// Example code block
const greeting = "Hello, Nexus!";
console.log(greeting);
\`\`\`
`);
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading notes...</p>
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Notes</CardTitle>
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

  const handleAiAssist = () => {
    setIsAiLoading(true);
    toast.info("AI Assistant", { description: "AI writing assistance coming soon!" });
    setTimeout(() => setIsAiLoading(false), 1000);
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
            <p className="text-xs text-muted-foreground">Notes</p>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              className="pl-9 bg-sidebar-accent border-sidebar-border"
            />
          </div>
        </div>

        <div className="px-4 mb-2">
          <Button className="w-full justify-start gap-2" variant="outline">
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2">FAVORITES</p>
            {sampleNotes.filter(n => n.isFavorite).map((note) => (
              <NoteTreeItem 
                key={note.id} 
                note={note} 
                selectedId={selectedNote}
                onSelect={setSelectedNote}
              />
            ))}
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2">ALL NOTES</p>
            {sampleNotes.map((note) => (
              <NoteTreeItem 
                key={note.id} 
                note={note} 
                selectedId={selectedNote}
                onSelect={setSelectedNote}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border">
          <nav className="space-y-1">
            {navItems.slice(0, 4).map((item) => {
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <Input 
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="border-none bg-transparent text-lg font-semibold focus-visible:ring-0 p-0 h-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleAiAssist} disabled={isAiLoading}>
              <Sparkles className={`w-4 h-4 mr-2 ${isAiLoading ? "animate-spin" : ""}`} />
              AI Assist
            </Button>
            <Button variant="ghost" size="icon">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="h-12 border-b border-border flex items-center gap-1 px-4">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Underline className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Heading2 className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Quote className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Code className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Link2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Image className="w-4 h-4" />
          </Button>
        </div>

        {/* Editor */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto p-8">
            <Textarea 
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-[600px] border-none bg-transparent resize-none focus-visible:ring-0 text-base leading-relaxed font-mono"
              placeholder="Start writing..."
            />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
