import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  HardDrive, Cloud, Server, Usb, Network, FolderOpen, File, FileText,
  Image, Video, Music, Archive, Code, Database, Key, Shield, Lock,
  Plus, Search, Grid3X3, List, Upload, Download, Trash2, Star,
  MoreVertical, RefreshCw, Settings, Eye, Edit, Copy, Move,
  Share2, Info, ChevronRight, ChevronDown, Home, Folder,
  FileJson, FilePlus, FolderPlus, Sparkles, Zap, Activity,
  HardDriveDownload, CloudUpload, ExternalLink, Check, X
} from "lucide-react";

// Types
interface Drive {
  id: string;
  name: string;
  type: "local" | "cloud" | "virtual" | "network" | "external";
  provider?: string;
  icon: string;
  color: string;
  totalSpace: string;
  usedSpace: string;
  usedPercent: number;
  status: "connected" | "disconnected" | "syncing" | "error";
  lastSynced?: string;
  fileCount: number;
}

interface StorageFile {
  id: string;
  name: string;
  type: "file" | "folder";
  mimeType?: string;
  size?: string;
  path: string;
  isStarred: boolean;
  isShared: boolean;
  modifiedAt: string;
  thumbnail?: string;
}

interface Secret {
  id: string;
  name: string;
  type: "api_key" | "credential" | "certificate" | "token" | "ssh_key";
  category: string;
  description?: string;
  expiresAt?: string;
  lastUsed?: string;
}

// Mock data
const mockDrives: Drive[] = [
  { id: "1", name: "Local Storage", type: "local", icon: "💾", color: "#6366f1", totalSpace: "500 GB", usedSpace: "234 GB", usedPercent: 47, status: "connected", fileCount: 12453 },
  { id: "2", name: "Google Drive", type: "cloud", provider: "gdrive", icon: "☁️", color: "#4285f4", totalSpace: "15 GB", usedSpace: "8.2 GB", usedPercent: 55, status: "connected", lastSynced: "2 min ago", fileCount: 892 },
  { id: "3", name: "AWS S3 Bucket", type: "cloud", provider: "s3", icon: "🪣", color: "#ff9900", totalSpace: "Unlimited", usedSpace: "156 GB", usedPercent: 0, status: "connected", lastSynced: "Just now", fileCount: 3421 },
  { id: "4", name: "Dropbox", type: "cloud", provider: "dropbox", icon: "📦", color: "#0061ff", totalSpace: "2 TB", usedSpace: "456 GB", usedPercent: 22, status: "syncing", lastSynced: "Syncing...", fileCount: 2156 },
  { id: "5", name: "Network Drive", type: "network", icon: "🌐", color: "#10b981", totalSpace: "10 TB", usedSpace: "3.2 TB", usedPercent: 32, status: "connected", fileCount: 45678 },
  { id: "6", name: "USB Drive", type: "external", icon: "🔌", color: "#f59e0b", totalSpace: "128 GB", usedSpace: "64 GB", usedPercent: 50, status: "connected", fileCount: 234 },
  { id: "7", name: "Virtual Disk", type: "virtual", icon: "💿", color: "#8b5cf6", totalSpace: "100 GB", usedSpace: "45 GB", usedPercent: 45, status: "connected", fileCount: 567 },
];

const mockFiles: StorageFile[] = [
  { id: "1", name: "Documents", type: "folder", path: "/Documents", isStarred: true, isShared: false, modifiedAt: "2 hours ago" },
  { id: "2", name: "Projects", type: "folder", path: "/Projects", isStarred: true, isShared: true, modifiedAt: "1 day ago" },
  { id: "3", name: "Media", type: "folder", path: "/Media", isStarred: false, isShared: false, modifiedAt: "3 days ago" },
  { id: "4", name: "Backups", type: "folder", path: "/Backups", isStarred: false, isShared: false, modifiedAt: "1 week ago" },
  { id: "5", name: "Q4_Report.pdf", type: "file", mimeType: "application/pdf", size: "2.4 MB", path: "/Documents/Q4_Report.pdf", isStarred: true, isShared: true, modifiedAt: "1 hour ago" },
  { id: "6", name: "presentation.pptx", type: "file", mimeType: "application/pptx", size: "15.8 MB", path: "/Documents/presentation.pptx", isStarred: false, isShared: false, modifiedAt: "3 hours ago" },
  { id: "7", name: "budget_2024.xlsx", type: "file", mimeType: "application/xlsx", size: "856 KB", path: "/Documents/budget_2024.xlsx", isStarred: false, isShared: true, modifiedAt: "5 hours ago" },
  { id: "8", name: "hero_image.png", type: "file", mimeType: "image/png", size: "4.2 MB", path: "/Media/hero_image.png", isStarred: false, isShared: false, modifiedAt: "1 day ago" },
  { id: "9", name: "demo_video.mp4", type: "file", mimeType: "video/mp4", size: "256 MB", path: "/Media/demo_video.mp4", isStarred: true, isShared: false, modifiedAt: "2 days ago" },
  { id: "10", name: "config.json", type: "file", mimeType: "application/json", size: "12 KB", path: "/Projects/config.json", isStarred: false, isShared: false, modifiedAt: "4 hours ago" },
];

const mockSecrets: Secret[] = [
  { id: "1", name: "OpenAI API Key", type: "api_key", category: "AI Services", description: "Production API key for GPT-4", lastUsed: "2 hours ago" },
  { id: "2", name: "AWS Access Key", type: "credential", category: "Cloud", description: "IAM user credentials", lastUsed: "1 day ago" },
  { id: "3", name: "SSL Certificate", type: "certificate", category: "Security", description: "Wildcard certificate for *.example.com", expiresAt: "2025-06-15" },
  { id: "4", name: "GitHub Token", type: "token", category: "Development", description: "Personal access token", lastUsed: "3 hours ago" },
  { id: "5", name: "Server SSH Key", type: "ssh_key", category: "Infrastructure", description: "Production server access", lastUsed: "1 week ago" },
];

// File icon helper
function getFileIcon(mimeType?: string) {
  if (!mimeType) return <Folder className="w-5 h-5 text-yellow-500" />;
  if (mimeType.startsWith("image/")) return <Image className="w-5 h-5 text-green-500" />;
  if (mimeType.startsWith("video/")) return <Video className="w-5 h-5 text-purple-500" />;
  if (mimeType.startsWith("audio/")) return <Music className="w-5 h-5 text-pink-500" />;
  if (mimeType.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
  if (mimeType.includes("json")) return <FileJson className="w-5 h-5 text-yellow-500" />;
  if (mimeType.includes("zip") || mimeType.includes("archive")) return <Archive className="w-5 h-5 text-orange-500" />;
  if (mimeType.includes("spreadsheet") || mimeType.includes("xlsx")) return <Database className="w-5 h-5 text-green-600" />;
  if (mimeType.includes("presentation") || mimeType.includes("pptx")) return <FileText className="w-5 h-5 text-orange-500" />;
  return <File className="w-5 h-5 text-gray-500" />;
}

// Drive icon helper
function getDriveIcon(type: string) {
  switch (type) {
    case "local": return <HardDrive className="w-6 h-6" />;
    case "cloud": return <Cloud className="w-6 h-6" />;
    case "virtual": return <Server className="w-6 h-6" />;
    case "network": return <Network className="w-6 h-6" />;
    case "external": return <Usb className="w-6 h-6" />;
    default: return <HardDrive className="w-6 h-6" />;
  }
}

// Secret type icon helper
function getSecretIcon(type: string) {
  switch (type) {
    case "api_key": return <Key className="w-5 h-5 text-purple-500" />;
    case "credential": return <Lock className="w-5 h-5 text-blue-500" />;
    case "certificate": return <Shield className="w-5 h-5 text-green-500" />;
    case "token": return <Zap className="w-5 h-5 text-yellow-500" />;
    case "ssh_key": return <Code className="w-5 h-5 text-cyan-500" />;
    default: return <Key className="w-5 h-5 text-gray-500" />;
  }
}

// 3D Drive Visualization Component
function Drive3DVisualization({ drives }: { drives: Drive[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    let animationId: number;
    let time = 0;
    
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      // Draw background grid
      ctx.strokeStyle = "rgba(99, 102, 241, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
      
      // Draw drive nodes
      drives.forEach((drive, index) => {
        const angle = (index / drives.length) * Math.PI * 2 + time * 0.001;
        const radius = 120;
        const centerX = width / 2;
        const centerY = height / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.5;
        
        // Draw connection line
        ctx.strokeStyle = drive.color + "40";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Draw node glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
        gradient.addColorStop(0, drive.color + "60");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw node
        ctx.fillStyle = drive.color;
        ctx.beginPath();
        ctx.arc(x, y, 20 + Math.sin(time * 0.005 + index) * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw status indicator
        const statusColor = drive.status === "connected" ? "#10b981" : 
                           drive.status === "syncing" ? "#f59e0b" : 
                           drive.status === "error" ? "#ef4444" : "#6b7280";
        ctx.fillStyle = statusColor;
        ctx.beginPath();
        ctx.arc(x + 15, y - 15, 6, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw central hub
      const hubGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, 50);
      hubGradient.addColorStop(0, "#6366f1");
      hubGradient.addColorStop(1, "#4f46e5");
      ctx.fillStyle = hubGradient;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 30 + Math.sin(time * 0.003) * 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw hub ring
      ctx.strokeStyle = "#6366f180";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 45 + Math.sin(time * 0.002) * 5, 0, Math.PI * 2);
      ctx.stroke();
      
      time++;
      animationId = requestAnimationFrame(draw);
    }
    
    draw();
    
    return () => cancelAnimationFrame(animationId);
  }, [drives]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={300}
      className="w-full h-full"
    />
  );
}

// Sidebar Navigation
function Sidebar() {
  const navItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: FileText, label: "Notes", href: "/notes" },
    { icon: Database, label: "CRM", href: "/crm" },
    { icon: FolderOpen, label: "Content", href: "/content" },
    { icon: Grid3X3, label: "Projects", href: "/projects" },
    { icon: FileText, label: "Email", href: "/email" },
    { icon: Code, label: "Code", href: "/code" },
    { icon: HardDrive, label: "Storage", href: "/storage", active: true },
    { icon: Lock, label: "Passwords", href: "/passwords" },
  ];

  return (
    <div className="w-16 bg-card/50 border-r border-border flex flex-col items-center py-4 gap-2">
      <Link href="/">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform">
          <span className="text-white font-bold text-lg">N</span>
        </div>
      </Link>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            size="icon"
            className={`w-10 h-10 ${item.active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <item.icon className="w-5 h-5" />
          </Button>
        </Link>
      ))}
    </div>
  );
}

export default function Storage() {
  const [selectedDrive, setSelectedDrive] = useState<Drive | null>(mockDrives[0]);
  const [currentPath, setCurrentPath] = useState("/");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showAddDrive, setShowAddDrive] = useState(false);
  const [showAddSecret, setShowAddSecret] = useState(false);
  const [activeTab, setActiveTab] = useState("drives");

  const filteredFiles = mockFiles.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleUpload = () => {
    toast.success("Upload started", { description: "Your files are being uploaded..." });
  };

  const handleAIOrganize = () => {
    toast.success("AI Organization", { description: "AI is analyzing your files and suggesting organization..." });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold">Storage Manager</h1>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAIOrganize}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Organize
            </Button>
            <Button size="sm" onClick={handleUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Drives */}
          <div className="w-80 border-r border-border flex flex-col bg-card/20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4 grid grid-cols-3">
                <TabsTrigger value="drives">Drives</TabsTrigger>
                <TabsTrigger value="secrets">Secrets</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="drives" className="flex-1 flex flex-col mt-0 p-4 overflow-hidden">
                {/* 3D Visualization */}
                <Card className="mb-4 bg-card/50 border-border/50">
                  <CardContent className="p-2">
                    <Drive3DVisualization drives={mockDrives} />
                  </CardContent>
                </Card>
                
                {/* Drive List */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Connected Drives</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowAddDrive(true)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="space-y-2">
                    {mockDrives.map((drive) => (
                      <Card 
                        key={drive.id}
                        className={`cursor-pointer transition-all hover:bg-accent/50 ${
                          selectedDrive?.id === drive.id ? "ring-2 ring-primary bg-accent/30" : "bg-card/50"
                        }`}
                        onClick={() => setSelectedDrive(drive)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: drive.color + "20", color: drive.color }}
                            >
                              {getDriveIcon(drive.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate">{drive.name}</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    drive.status === "connected" ? "border-green-500 text-green-500" :
                                    drive.status === "syncing" ? "border-yellow-500 text-yellow-500" :
                                    drive.status === "error" ? "border-red-500 text-red-500" :
                                    "border-gray-500 text-gray-500"
                                  }`}
                                >
                                  {drive.status}
                                </Badge>
                              </div>
                              <div className="mt-1">
                                <Progress value={drive.usedPercent} className="h-1" />
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {drive.usedSpace} / {drive.totalSpace}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {drive.fileCount.toLocaleString()} files
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="secrets" className="flex-1 flex flex-col mt-0 p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">Secrets Vault</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowAddSecret(true)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="space-y-2">
                    {mockSecrets.map((secret) => (
                      <Card key={secret.id} className="bg-card/50 hover:bg-accent/50 cursor-pointer transition-all">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              {getSecretIcon(secret.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate">{secret.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {secret.type.replace("_", " ")}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {secret.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {secret.category}
                                </Badge>
                                {secret.lastUsed && (
                                  <span className="text-xs text-muted-foreground">
                                    Used {secret.lastUsed}
                                  </span>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Copy className="w-4 h-4 mr-2" /> Copy Value
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="activity" className="flex-1 flex flex-col mt-0 p-4 overflow-hidden">
                <ScrollArea className="flex-1">
                  <div className="space-y-3">
                    {[
                      { action: "Uploaded", file: "report.pdf", drive: "Google Drive", time: "2 min ago", icon: Upload },
                      { action: "Synced", file: "project_files/", drive: "Dropbox", time: "5 min ago", icon: RefreshCw },
                      { action: "Downloaded", file: "backup.zip", drive: "AWS S3", time: "15 min ago", icon: Download },
                      { action: "Shared", file: "presentation.pptx", drive: "Local", time: "1 hour ago", icon: Share2 },
                      { action: "Deleted", file: "old_data.csv", drive: "Network Drive", time: "2 hours ago", icon: Trash2 },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/30">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <activity.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.action}</span>{" "}
                            <span className="text-muted-foreground">{activity.file}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.drive} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Content - File Browser */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card/20">
              <div className="flex items-center gap-2">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-sm">
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Home className="w-4 h-4" />
                  </Button>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  {currentPath.split("/").filter(Boolean).map((segment, index, arr) => (
                    <div key={index} className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        {segment}
                      </Button>
                      {index < arr.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-64 bg-background/50"
                  />
                </div>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${viewMode === "grid" ? "bg-accent" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${viewMode === "list" ? "bg-accent" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <FolderPlus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <FilePlus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* File Grid/List */}
            <ScrollArea className="flex-1 p-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredFiles.map((file) => (
                    <Card 
                      key={file.id}
                      className={`cursor-pointer transition-all hover:bg-accent/50 group ${
                        selectedFiles.includes(file.id) ? "ring-2 ring-primary bg-accent/30" : "bg-card/50"
                      }`}
                      onClick={() => handleFileSelect(file.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            {file.type === "folder" ? (
                              <Folder className="w-10 h-10 text-yellow-500" />
                            ) : (
                              getFileIcon(file.mimeType)
                            )}
                          </div>
                          <span className="text-sm font-medium truncate w-full">{file.name}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {file.size || "Folder"} • {file.modifiedAt}
                          </span>
                          <div className="flex items-center gap-1 mt-2">
                            {file.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                            {file.isShared && <Share2 className="w-3 h-3 text-blue-500" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                        selectedFiles.includes(file.id) ? "bg-accent/30 ring-1 ring-primary" : ""
                      }`}
                      onClick={() => handleFileSelect(file.id)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        {file.type === "folder" ? (
                          <Folder className="w-6 h-6 text-yellow-500" />
                        ) : (
                          getFileIcon(file.mimeType)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{file.name}</span>
                          {file.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          {file.isShared && <Share2 className="w-4 h-4 text-blue-500" />}
                        </div>
                        <span className="text-sm text-muted-foreground">{file.path}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{file.size || "-"}</span>
                      <span className="text-sm text-muted-foreground">{file.modifiedAt}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Preview</DropdownMenuItem>
                          <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Download</DropdownMenuItem>
                          <DropdownMenuItem><Share2 className="w-4 h-4 mr-2" /> Share</DropdownMenuItem>
                          <DropdownMenuItem><Move className="w-4 h-4 mr-2" /> Move</DropdownMenuItem>
                          <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Copy</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem><Star className="w-4 h-4 mr-2" /> Star</DropdownMenuItem>
                          <DropdownMenuItem><Info className="w-4 h-4 mr-2" /> Details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Status Bar */}
            <div className="h-8 border-t border-border flex items-center justify-between px-4 bg-card/20 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>{filteredFiles.length} items</span>
                {selectedFiles.length > 0 && (
                  <span>{selectedFiles.length} selected</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {selectedDrive && (
                  <>
                    <span>{selectedDrive.usedSpace} used of {selectedDrive.totalSpace}</span>
                    <Progress value={selectedDrive.usedPercent} className="w-24 h-1" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Drive Dialog */}
      <Dialog open={showAddDrive} onOpenChange={setShowAddDrive}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Drive</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {[
              { icon: Cloud, label: "Google Drive", color: "#4285f4" },
              { icon: Cloud, label: "Dropbox", color: "#0061ff" },
              { icon: Cloud, label: "OneDrive", color: "#0078d4" },
              { icon: Cloud, label: "AWS S3", color: "#ff9900" },
              { icon: Network, label: "Network Drive", color: "#10b981" },
              { icon: Usb, label: "External Drive", color: "#f59e0b" },
            ].map((provider) => (
              <Card 
                key={provider.label}
                className="cursor-pointer hover:bg-accent/50 transition-all"
                onClick={() => {
                  toast.success(`${provider.label} added`, { description: "Drive is being configured..." });
                  setShowAddDrive(false);
                }}
              >
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: provider.color + "20", color: provider.color }}
                  >
                    <provider.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">{provider.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Secret Dialog */}
      <Dialog open={showAddSecret} onOpenChange={setShowAddSecret}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Secret</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="e.g., API Key for Service X" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["API Key", "Credential", "Token", "Certificate", "SSH Key", "Other"].map((type) => (
                  <Button key={type} variant="outline" size="sm" className="justify-start">
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Value</label>
              <Input type="password" placeholder="Enter secret value" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input placeholder="e.g., Cloud, Development, Security" />
            </div>
            <Button className="w-full" onClick={() => {
              toast.success("Secret added", { description: "Your secret has been securely stored." });
              setShowAddSecret(false);
            }}>
              <Lock className="w-4 h-4 mr-2" />
              Save Secret
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
