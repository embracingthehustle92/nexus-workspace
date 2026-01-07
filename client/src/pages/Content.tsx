import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Users, 
  FolderOpen, 
  Kanban, 
  Mail, 
  Code2, 
  Search,
  Plus,
  Image,
  Video,
  FileIcon,
  Link2,
  MoreHorizontal,
  Filter,
  Grid3X3,
  List,
  Upload,
  Download,
  Eye,
  Trash2,
  Edit,
  Home,
  Layers,
  File,
  Clock,
  Tag
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

const contentItems = [
  { id: 1, title: "Product Launch Video", type: "video", category: "Marketing", status: "published", size: "245 MB", updatedAt: "2 hours ago", thumbnail: null },
  { id: 2, title: "Brand Guidelines", type: "document", category: "Brand", status: "published", size: "12 MB", updatedAt: "1 day ago", thumbnail: null },
  { id: 3, title: "Hero Banner", type: "image", category: "Marketing", status: "draft", size: "2.4 MB", updatedAt: "2 days ago", thumbnail: null },
  { id: 4, title: "Q4 Report", type: "document", category: "Reports", status: "published", size: "5.8 MB", updatedAt: "3 days ago", thumbnail: null },
  { id: 5, title: "Team Photos", type: "image", category: "Internal", status: "published", size: "18 MB", updatedAt: "1 week ago", thumbnail: null },
  { id: 6, title: "Product Demo", type: "video", category: "Sales", status: "draft", size: "156 MB", updatedAt: "1 week ago", thumbnail: null },
  { id: 7, title: "API Documentation", type: "link", category: "Development", status: "published", size: "-", updatedAt: "2 weeks ago", thumbnail: null },
  { id: 8, title: "Social Media Kit", type: "file", category: "Marketing", status: "published", size: "45 MB", updatedAt: "2 weeks ago", thumbnail: null },
];

const categories = ["All", "Marketing", "Brand", "Reports", "Internal", "Sales", "Development"];

const typeIcons: Record<string, typeof Video> = {
  video: Video,
  document: FileText,
  image: Image,
  link: Link2,
  file: FileIcon,
};

const typeColors: Record<string, string> = {
  video: "bg-red-500/20 text-red-400",
  document: "bg-blue-500/20 text-blue-400",
  image: "bg-green-500/20 text-green-400",
  link: "bg-purple-500/20 text-purple-400",
  file: "bg-orange-500/20 text-orange-400",
};

const statusColors: Record<string, string> = {
  published: "bg-green-500/20 text-green-400",
  draft: "bg-yellow-500/20 text-yellow-400",
  archived: "bg-gray-500/20 text-gray-400",
};

export default function Content() {
  const { user, loading, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading content...</p>
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
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Content Management</CardTitle>
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

  const filteredContent = contentItems.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUpload = () => {
    toast.info("Upload", { description: "File upload functionality coming soon!" });
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
            <p className="text-xs text-muted-foreground">Content</p>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.startsWith(item.path);
              return (
                <Link key={item.id} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-primary" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4 bg-sidebar-border" />

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2">CATEGORIES</p>
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${
                  selectedCategory === category ? "bg-sidebar-accent text-sidebar-primary" : "text-muted-foreground"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <Tag className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Storage Info */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Storage Used</span>
              <span className="font-medium">2.4 GB / 10 GB</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[24%] gradient-primary rounded-full" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold">Content Management</h2>
            <p className="text-sm text-muted-foreground">Manage your files and media assets</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button size="sm" className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Content
            </Button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="h-14 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search content..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredContent.map((item) => {
                  const TypeIcon = typeIcons[item.type];
                  return (
                    <Card key={item.id} className="glass hover:border-primary/50 cursor-pointer transition-all group">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                          <div className={`w-16 h-16 rounded-xl ${typeColors[item.type]} flex items-center justify-center`}>
                            <TypeIcon className="w-8 h-8" />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="secondary" className="w-8 h-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="secondary" className="w-8 h-8">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-sm truncate flex-1">{item.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-6 h-6 -mr-2">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Preview</DropdownMenuItem>
                                <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Download</DropdownMenuItem>
                                <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={statusColors[item.status]} variant="secondary">
                              {item.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{item.size}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {item.updatedAt}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredContent.map((item) => {
                  const TypeIcon = typeIcons[item.type];
                  return (
                    <Card key={item.id} className="glass hover:border-primary/50 cursor-pointer transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg ${typeColors[item.type]} flex items-center justify-center`}>
                            <TypeIcon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                          <Badge className={statusColors[item.status]} variant="secondary">
                            {item.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground w-20">{item.size}</span>
                          <span className="text-sm text-muted-foreground w-24">{item.updatedAt}</span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <Download className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
