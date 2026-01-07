import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Lock, Key, Shield, ShieldCheck, ShieldAlert, Eye, EyeOff,
  Plus, Search, Copy, Edit, Trash2, Star, MoreVertical,
  RefreshCw, Settings, Smartphone, QrCode, Clock, AlertTriangle,
  Check, X, Folder, FolderPlus, Globe, User, Mail, CreditCard,
  Wifi, Server, Database, Code, FileText, Home, HardDrive,
  Download, Upload, Fingerprint, Scan, Timer, History,
  ChevronRight, ChevronDown, ExternalLink, Zap, Sparkles
} from "lucide-react";

// Types
interface PasswordEntry {
  id: string;
  odId: string;
  name: string;
  username: string;
  password: string;
  url?: string;
  category: string;
  folderId?: string;
  icon?: string;
  favicon?: string;
  notes?: string;
  isFavorite: boolean;
  lastUsed?: string;
  passwordStrength: number;
  customFields?: { label: string; value: string; hidden: boolean }[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  hasTOTP?: boolean;
}

interface TOTPEntry {
  id: string;
  odId: string;
  name: string;
  issuer: string;
  secret: string;
  algorithm: string;
  digits: number;
  period: number;
  icon?: string;
  category?: string;
  isFavorite: boolean;
  currentCode?: string;
  timeRemaining?: number;
}

interface PasswordFolder {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

// Mock data
const mockFolders: PasswordFolder[] = [
  { id: "1", name: "Personal", icon: "👤", color: "#6366f1", count: 24 },
  { id: "2", name: "Work", icon: "💼", color: "#10b981", count: 18 },
  { id: "3", name: "Finance", icon: "💰", color: "#f59e0b", count: 12 },
  { id: "4", name: "Social", icon: "🌐", color: "#3b82f6", count: 8 },
  { id: "5", name: "Development", icon: "💻", color: "#8b5cf6", count: 15 },
];

const mockPasswords: PasswordEntry[] = [
  { id: "1", odId: "od1", name: "Google Account", username: "user@gmail.com", password: "••••••••••••", url: "https://google.com", category: "Personal", isFavorite: true, lastUsed: "2 hours ago", passwordStrength: 95, hasTOTP: true, createdAt: "2024-01-15", updatedAt: "2024-12-01" },
  { id: "2", odId: "od2", name: "GitHub", username: "developer123", password: "••••••••••••", url: "https://github.com", category: "Development", isFavorite: true, lastUsed: "1 hour ago", passwordStrength: 88, hasTOTP: true, createdAt: "2024-02-20", updatedAt: "2024-11-15" },
  { id: "3", odId: "od3", name: "AWS Console", username: "admin@company.com", password: "••••••••••••", url: "https://aws.amazon.com", category: "Work", isFavorite: false, lastUsed: "1 day ago", passwordStrength: 100, hasTOTP: true, createdAt: "2024-03-10", updatedAt: "2024-10-20" },
  { id: "4", odId: "od4", name: "Bank of America", username: "johnsmith", password: "••••••••••••", url: "https://bankofamerica.com", category: "Finance", isFavorite: true, lastUsed: "3 days ago", passwordStrength: 92, hasTOTP: true, createdAt: "2024-01-05", updatedAt: "2024-09-30" },
  { id: "5", odId: "od5", name: "Netflix", username: "user@email.com", password: "••••••••••••", url: "https://netflix.com", category: "Personal", isFavorite: false, lastUsed: "1 week ago", passwordStrength: 75, createdAt: "2024-04-12", updatedAt: "2024-08-15" },
  { id: "6", odId: "od6", name: "Slack Workspace", username: "john@company.com", password: "••••••••••••", url: "https://slack.com", category: "Work", isFavorite: false, lastUsed: "5 hours ago", passwordStrength: 82, createdAt: "2024-05-20", updatedAt: "2024-12-05" },
  { id: "7", odId: "od7", name: "Twitter/X", username: "@johndoe", password: "••••••••••••", url: "https://x.com", category: "Social", isFavorite: false, lastUsed: "2 days ago", passwordStrength: 68, createdAt: "2024-06-01", updatedAt: "2024-11-01" },
  { id: "8", odId: "od8", name: "LinkedIn", username: "john.smith@email.com", password: "••••••••••••", url: "https://linkedin.com", category: "Social", isFavorite: true, lastUsed: "4 hours ago", passwordStrength: 85, hasTOTP: true, createdAt: "2024-02-28", updatedAt: "2024-12-03" },
];

const mockTOTPs: TOTPEntry[] = [
  { id: "1", odId: "totp1", name: "Google", issuer: "Google", secret: "JBSWY3DPEHPK3PXP", algorithm: "SHA1", digits: 6, period: 30, isFavorite: true },
  { id: "2", odId: "totp2", name: "GitHub", issuer: "GitHub", secret: "GEZDGNBVGY3TQOJQ", algorithm: "SHA1", digits: 6, period: 30, isFavorite: true },
  { id: "3", odId: "totp3", name: "AWS", issuer: "Amazon Web Services", secret: "HXDMVJECJJWSRB3H", algorithm: "SHA1", digits: 6, period: 30, isFavorite: false },
  { id: "4", odId: "totp4", name: "Bank of America", issuer: "BoA", secret: "KRMVATZTJFZUC4DU", algorithm: "SHA1", digits: 6, period: 30, isFavorite: true },
  { id: "5", odId: "totp5", name: "LinkedIn", issuer: "LinkedIn", secret: "NBSWY3DPEHPK3PXP", algorithm: "SHA1", digits: 6, period: 30, isFavorite: false },
];

// TOTP Generator (simplified - in production use a proper library)
function generateTOTP(secret: string, period: number = 30): { code: string; remaining: number } {
  const now = Math.floor(Date.now() / 1000);
  const counter = Math.floor(now / period);
  const remaining = period - (now % period);
  
  // Simplified TOTP - in production use proper HMAC-SHA1
  const hash = (counter * 12345 + secret.charCodeAt(0) * 67890) % 1000000;
  const code = hash.toString().padStart(6, "0");
  
  return { code, remaining };
}

// Password strength helper
function getStrengthColor(strength: number): string {
  if (strength >= 80) return "text-green-500";
  if (strength >= 60) return "text-yellow-500";
  if (strength >= 40) return "text-orange-500";
  return "text-red-500";
}

function getStrengthLabel(strength: number): string {
  if (strength >= 80) return "Strong";
  if (strength >= 60) return "Good";
  if (strength >= 40) return "Fair";
  return "Weak";
}

// Category icon helper
function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "personal": return <User className="w-4 h-4" />;
    case "work": return <Server className="w-4 h-4" />;
    case "finance": return <CreditCard className="w-4 h-4" />;
    case "social": return <Globe className="w-4 h-4" />;
    case "development": return <Code className="w-4 h-4" />;
    default: return <Key className="w-4 h-4" />;
  }
}

// Sidebar Navigation
function Sidebar() {
  const navItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: FileText, label: "Notes", href: "/notes" },
    { icon: Database, label: "CRM", href: "/crm" },
    { icon: Folder, label: "Content", href: "/content" },
    { icon: Folder, label: "Projects", href: "/projects" },
    { icon: Mail, label: "Email", href: "/email" },
    { icon: Code, label: "Code", href: "/code" },
    { icon: HardDrive, label: "Storage", href: "/storage" },
    { icon: Lock, label: "Passwords", href: "/passwords", active: true },
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

// TOTP Card Component
function TOTPCard({ totp, onCopy }: { totp: TOTPEntry; onCopy: (code: string) => void }) {
  const [code, setCode] = useState("000000");
  const [remaining, setRemaining] = useState(30);
  
  useEffect(() => {
    const updateCode = () => {
      const result = generateTOTP(totp.secret, totp.period);
      setCode(result.code);
      setRemaining(result.remaining);
    };
    
    updateCode();
    const interval = setInterval(updateCode, 1000);
    return () => clearInterval(interval);
  }, [totp.secret, totp.period]);
  
  const progress = (remaining / totp.period) * 100;
  
  return (
    <Card className="bg-card/50 hover:bg-accent/30 transition-all cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{totp.name}</h3>
              <p className="text-xs text-muted-foreground">{totp.issuer}</p>
            </div>
          </div>
          {totp.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-mono font-bold tracking-wider text-primary">
              {code.slice(0, 3)} {code.slice(3)}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onCopy(code)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <svg className="w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-muted/30"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={100}
                  strokeDashoffset={100 - progress}
                  className={`${remaining <= 5 ? "text-red-500" : "text-primary"} transition-all`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {remaining}s
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Password Generator Component
function PasswordGenerator({ onGenerate }: { onGenerate: (password: string) => void }) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  
  const generatePassword = () => {
    let chars = "";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    if (!chars) {
      toast.error("Please select at least one character type");
      return;
    }
    
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    onGenerate(password);
  };
  
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);
  
  const strength = 
    (includeUppercase ? 20 : 0) + 
    (includeLowercase ? 20 : 0) + 
    (includeNumbers ? 20 : 0) + 
    (includeSymbols ? 20 : 0) + 
    Math.min(20, length);
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-lg break-all">{generatedPassword}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
              navigator.clipboard.writeText(generatedPassword);
              toast.success("Password copied!");
            }}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={generatePassword}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={strength} className="flex-1 h-2" />
          <span className={`text-sm font-medium ${getStrengthColor(strength)}`}>
            {getStrengthLabel(strength)}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Length: {length}</Label>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-32"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between">
            <Label>Uppercase (A-Z)</Label>
            <Switch checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Lowercase (a-z)</Label>
            <Switch checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Numbers (0-9)</Label>
            <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Symbols (!@#$)</Label>
            <Switch checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Passwords() {
  const [activeTab, setActiveTab] = useState("passwords");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showAddTOTP, setShowAddTOTP] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [totps, setTotps] = useState(mockTOTPs);
  
  // Simulate offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  
  const filteredPasswords = mockPasswords.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (p.url && p.url.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = !selectedFolder || p.category === mockFolders.find(f => f.id === selectedFolder)?.name;
    return matchesSearch && matchesFolder;
  });
  
  const handleCopyPassword = (password: string, name: string) => {
    navigator.clipboard.writeText(password);
    toast.success(`Password copied`, { description: `${name} password copied to clipboard` });
  };
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied", { description: "2FA code copied to clipboard" });
  };
  
  const handleAutoFill = (entry: PasswordEntry) => {
    toast.success("Auto-fill triggered", { description: `Filling credentials for ${entry.name}` });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold">Password Manager</h1>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-500">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
            {isOffline && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
                <Wifi className="w-3 h-3 mr-1" />
                Offline Mode
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowGenerator(true)}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generator
            </Button>
            <Button size="sm" onClick={() => setShowAddPassword(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Password
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Folders & Categories */}
          <div className="w-64 border-r border-border flex flex-col bg-card/20">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search vault..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background/50"
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1 px-4">
              {/* Quick Access */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Quick Access</h3>
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${!selectedFolder ? "bg-accent" : ""}`}
                    onClick={() => setSelectedFolder(null)}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    All Items
                    <Badge variant="secondary" className="ml-auto">{mockPasswords.length}</Badge>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    Favorites
                    <Badge variant="secondary" className="ml-auto">{mockPasswords.filter(p => p.isFavorite).length}</Badge>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Recently Used
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                    Weak Passwords
                    <Badge variant="secondary" className="ml-auto bg-red-500/20 text-red-500">3</Badge>
                  </Button>
                </div>
              </div>
              
              {/* Folders */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase">Folders</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <FolderPlus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {mockFolders.map((folder) => (
                    <Button
                      key={folder.id}
                      variant="ghost"
                      className={`w-full justify-start ${selectedFolder === folder.id ? "bg-accent" : ""}`}
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <span className="mr-2">{folder.icon}</span>
                      {folder.name}
                      <Badge variant="secondary" className="ml-auto">{folder.count}</Badge>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Security Score */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Security Score</span>
                    <span className="text-2xl font-bold text-green-500">85</span>
                  </div>
                  <Progress value={85} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    3 passwords need attention
                  </p>
                </CardContent>
              </Card>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b border-border px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="passwords" className="gap-2">
                    <Key className="w-4 h-4" />
                    Passwords
                  </TabsTrigger>
                  <TabsTrigger value="2fa" className="gap-2">
                    <Smartphone className="w-4 h-4" />
                    2FA / TOTP
                  </TabsTrigger>
                  <TabsTrigger value="security" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="passwords" className="flex-1 overflow-hidden mt-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {filteredPasswords.map((entry) => (
                      <Card 
                        key={entry.id}
                        className={`bg-card/50 hover:bg-accent/30 transition-all cursor-pointer ${
                          selectedPassword?.id === entry.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedPassword(entry)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                              {entry.favicon ? (
                                <img src={entry.favicon} alt="" className="w-6 h-6" />
                              ) : (
                                getCategoryIcon(entry.category)
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium truncate">{entry.name}</h3>
                                {entry.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                {entry.hasTOTP && <Smartphone className="w-4 h-4 text-blue-500" />}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{entry.username}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">{entry.category}</Badge>
                                <span className="text-xs text-muted-foreground">Used {entry.lastUsed}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="text-right mr-2">
                                <div className={`text-sm font-medium ${getStrengthColor(entry.passwordStrength)}`}>
                                  {entry.passwordStrength}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {getStrengthLabel(entry.passwordStrength)}
                                </div>
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowPassword(prev => ({ ...prev, [entry.id]: !prev[entry.id] }));
                                }}
                              >
                                {showPassword[entry.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyPassword("actualPassword123!", entry.name);
                                }}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAutoFill(entry);
                                }}
                              >
                                <Fingerprint className="w-4 h-4 mr-1" />
                                Auto-fill
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <ExternalLink className="w-4 h-4 mr-2" /> Open Website
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <User className="w-4 h-4 mr-2" /> Copy Username
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Key className="w-4 h-4 mr-2" /> Copy Password
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <History className="w-4 h-4 mr-2" /> Password History
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Star className="w-4 h-4 mr-2" /> Toggle Favorite
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-500">
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="2fa" className="flex-1 overflow-hidden mt-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
                      <p className="text-sm text-muted-foreground">Manage your 2FA tokens and backup codes</p>
                    </div>
                    <Button size="sm" onClick={() => setShowAddTOTP(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add 2FA
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {totps.map((totp) => (
                        <TOTPCard key={totp.id} totp={totp} onCopy={handleCopyCode} />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="flex-1 overflow-hidden mt-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="max-w-3xl mx-auto space-y-6">
                    {/* Security Overview */}
                    <Card className="bg-card/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-green-500" />
                          Security Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-3xl font-bold text-green-500">85</div>
                            <div className="text-sm text-muted-foreground">Security Score</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-3xl font-bold">{mockPasswords.length}</div>
                            <div className="text-sm text-muted-foreground">Total Passwords</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-3xl font-bold text-yellow-500">3</div>
                            <div className="text-sm text-muted-foreground">Weak Passwords</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-500">{totps.length}</div>
                            <div className="text-sm text-muted-foreground">2FA Enabled</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Security Recommendations */}
                    <Card className="bg-card/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          Security Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { icon: ShieldAlert, title: "Weak password detected", desc: "Netflix account has a weak password", action: "Update", severity: "high" },
                          { icon: Clock, title: "Password not changed in 90 days", desc: "Twitter/X password is old", action: "Update", severity: "medium" },
                          { icon: Smartphone, title: "Enable 2FA", desc: "Netflix doesn't have 2FA enabled", action: "Enable", severity: "medium" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.severity === "high" ? "bg-red-500/20" : "bg-yellow-500/20"
                            }`}>
                              <item.icon className={`w-5 h-5 ${
                                item.severity === "high" ? "text-red-500" : "text-yellow-500"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                            <Button size="sm">{item.action}</Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    {/* Breach Monitoring */}
                    <Card className="bg-card/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Scan className="w-5 h-5" />
                          Breach Monitoring
                        </CardTitle>
                        <CardDescription>
                          We monitor the dark web for your credentials
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <ShieldCheck className="w-8 h-8 text-green-500" />
                          <div>
                            <h4 className="font-medium text-green-500">No breaches detected</h4>
                            <p className="text-sm text-muted-foreground">Last checked 2 hours ago</p>
                          </div>
                          <Button variant="outline" size="sm" className="ml-auto">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Check Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Add Password Dialog */}
      <Dialog open={showAddPassword} onOpenChange={setShowAddPassword}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Password</DialogTitle>
            <DialogDescription>
              Store a new password securely in your vault
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="e.g., Google Account" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username / Email</Label>
                <Input placeholder="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="Personal, Work, etc." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex gap-2">
                <Input type="password" placeholder="Enter password" className="flex-1" />
                <Button variant="outline" onClick={() => setShowGenerator(true)}>
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input placeholder="https://example.com" />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea placeholder="Additional notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPassword(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("Password saved", { description: "Your password has been securely stored" });
              setShowAddPassword(false);
            }}>
              <Lock className="w-4 h-4 mr-2" />
              Save Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add TOTP Dialog */}
      <Dialog open={showAddTOTP} onOpenChange={setShowAddTOTP}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add 2FA Token</DialogTitle>
            <DialogDescription>
              Scan a QR code or enter the secret key manually
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center p-8 bg-muted/50 rounded-lg border-2 border-dashed border-border">
              <div className="text-center">
                <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Scan QR code or paste secret key</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Scan className="w-4 h-4 mr-2" />
                  Scan QR Code
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Or enter manually</Label>
              <Input placeholder="Enter secret key" />
            </div>
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input placeholder="e.g., Google (user@gmail.com)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTOTP(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("2FA token added", { description: "Your authenticator token has been saved" });
              setShowAddTOTP(false);
            }}>
              <Smartphone className="w-4 h-4 mr-2" />
              Add Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Generator Dialog */}
      <Dialog open={showGenerator} onOpenChange={setShowGenerator}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Password Generator</DialogTitle>
            <DialogDescription>
              Generate a strong, secure password
            </DialogDescription>
          </DialogHeader>
          <PasswordGenerator onGenerate={(password) => {
            // Could be used to fill a form
          }} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerator(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
