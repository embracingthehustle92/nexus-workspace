import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from "@monaco-editor/react";
import { 
  FileText, 
  Users, 
  FolderOpen, 
  Kanban, 
  Mail, 
  Code2, 
  Search,
  Plus,
  File,
  Folder,
  ChevronRight,
  ChevronDown,
  Play,
  Terminal,
  Settings,
  X,
  Save,
  Copy,
  Trash2,
  MoreHorizontal,
  Home,
  Layers,
  Sparkles,
  Send,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  Upload
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useRef } from "react";
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

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  content?: string;
  children?: FileNode[];
}

const fileTree: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      { id: "1-1", name: "index.ts", type: "file", language: "typescript", content: `import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Nexus API!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});` },
      { id: "1-2", name: "utils.ts", type: "file", language: "typescript", content: `export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}` },
      {
        id: "1-3",
        name: "components",
        type: "folder",
        children: [
          { id: "1-3-1", name: "Button.tsx", type: "file", language: "typescript", content: `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'border border-gray-300 hover:bg-gray-100'
  };

  return (
    <button 
      className={\`\${baseStyles} \${variants[variant]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}` },
          { id: "1-3-2", name: "Card.tsx", type: "file", language: "typescript", content: `import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={\`bg-white rounded-xl shadow-lg p-6 \${className}\`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}` },
        ]
      }
    ]
  },
  { id: "2", name: "package.json", type: "file", language: "json", content: `{
  "name": "nexus-project",
  "version": "1.0.0",
  "description": "A Nexus workspace project",
  "main": "src/index.ts",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsx": "^4.0.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0"
  }
}` },
  { id: "3", name: "README.md", type: "file", language: "markdown", content: `# Nexus Project

A sample project created in Nexus Workspace.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- Express.js API server
- TypeScript support
- Hot reload development

## API Endpoints

- \`GET /\` - Welcome message
- \`GET /api/health\` - Health check
` },
  { id: "4", name: ".env", type: "file", language: "plaintext", content: `PORT=3000
NODE_ENV=development
API_KEY=your-api-key-here` },
];

const terminalHistory = [
  { type: "input", content: "npm install" },
  { type: "output", content: "added 52 packages in 3.2s" },
  { type: "input", content: "npm run dev" },
  { type: "output", content: "Server running on port 3000" },
];

function FileTreeItem({ node, level = 0, selectedFile, onSelect }: { 
  node: FileNode; 
  level?: number; 
  selectedFile: string | null;
  onSelect: (node: FileNode) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const isFolder = node.type === "folder";

  return (
    <div>
      <div 
        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer group transition-colors ${
          selectedFile === node.id ? "bg-primary/20 text-primary" : "hover:bg-muted"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            setExpanded(!expanded);
          } else {
            onSelect(node);
          }
        }}
      >
        {isFolder ? (
          expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        ) : (
          <span className="w-4" />
        )}
        {isFolder ? (
          <Folder className="w-4 h-4 text-yellow-400" />
        ) : (
          <File className="w-4 h-4 text-blue-400" />
        )}
        <span className="text-sm flex-1">{node.name}</span>
      </div>
      {isFolder && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem 
              key={child.id} 
              node={child} 
              level={level + 1}
              selectedFile={selectedFile}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CodeEditor() {
  const { user, loading, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [openTabs, setOpenTabs] = useState<FileNode[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState(terminalHistory);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading editor...</p>
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
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Code Editor</CardTitle>
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

  const handleFileSelect = (node: FileNode) => {
    setSelectedFile(node);
    if (!openTabs.find(t => t.id === node.id)) {
      setOpenTabs([...openTabs, node]);
    }
  };

  const handleCloseTab = (nodeId: string) => {
    const newTabs = openTabs.filter(t => t.id !== nodeId);
    setOpenTabs(newTabs);
    if (selectedFile?.id === nodeId) {
      setSelectedFile(newTabs[newTabs.length - 1] || null);
    }
  };

  const handleTerminalSubmit = () => {
    if (!terminalInput.trim()) return;
    
    const newOutput = [
      ...terminalOutput,
      { type: "input", content: terminalInput },
    ];

    // Simulate command responses
    if (terminalInput.includes("help")) {
      newOutput.push({ type: "output", content: "Available commands: help, clear, ls, npm, node, git" });
    } else if (terminalInput === "clear") {
      setTerminalOutput([]);
      setTerminalInput("");
      return;
    } else if (terminalInput.startsWith("ls")) {
      newOutput.push({ type: "output", content: "src/  package.json  README.md  .env" });
    } else {
      newOutput.push({ type: "output", content: `Executing: ${terminalInput}...` });
    }

    setTerminalOutput(newOutput);
    setTerminalInput("");
  };

  const handleAiAssist = () => {
    if (!aiPrompt.trim()) {
      toast.info("AI Assistant", { description: "Enter a prompt to get AI assistance" });
      return;
    }
    toast.info("AI Assistant", { description: "AI code assistance coming soon!" });
    setAiPrompt("");
  };

  const getLanguage = (lang?: string) => {
    const langMap: Record<string, string> = {
      typescript: "typescript",
      javascript: "javascript",
      json: "json",
      markdown: "markdown",
      plaintext: "plaintext",
    };
    return langMap[lang || ""] || "plaintext";
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
            <p className="text-xs text-muted-foreground">Code</p>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* File Explorer */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">EXPLORER</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <Plus className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 px-2">
            {fileTree.map((node) => (
              <FileTreeItem 
                key={node.id} 
                node={node}
                selectedFile={selectedFile?.id || null}
                onSelect={handleFileSelect}
              />
            ))}
          </ScrollArea>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <ScrollArea className="max-h-48 px-3 py-2">
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
        {/* Tabs */}
        <div className="h-10 bg-muted/30 border-b border-border flex items-center overflow-x-auto">
          {openTabs.map((tab) => (
            <div
              key={tab.id}
              className={`h-full flex items-center gap-2 px-4 border-r border-border cursor-pointer ${
                selectedFile?.id === tab.id ? "bg-background" : "hover:bg-muted/50"
              }`}
              onClick={() => setSelectedFile(tab)}
            >
              <File className="w-4 h-4 text-blue-400" />
              <span className="text-sm">{tab.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-4 h-4 hover:bg-destructive/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedFile ? (
            <div className="flex-1 flex flex-col">
              {/* Editor Toolbar */}
              <div className="h-10 border-b border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {selectedFile.language || "plaintext"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Copy</DropdownMenuItem>
                      <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Download</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguage(selectedFile.language)}
                  value={selectedFile.content}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', monospace",
                    lineNumbers: "on",
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16 },
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No file open</h3>
                <p className="text-muted-foreground">Select a file from the explorer to start editing</p>
              </div>
            </div>
          )}
        </div>

        {/* Terminal / AI Panel */}
        <div className={`border-t border-border transition-all ${isTerminalExpanded ? "h-80" : "h-48"}`}>
          <Tabs defaultValue="terminal" className="h-full flex flex-col">
            <div className="h-10 border-b border-border flex items-center justify-between px-4">
              <TabsList className="bg-transparent h-8">
                <TabsTrigger value="terminal" className="text-xs data-[state=active]:bg-muted">
                  <Terminal className="w-3 h-3 mr-2" />
                  Terminal
                </TabsTrigger>
                <TabsTrigger value="ai" className="text-xs data-[state=active]:bg-muted">
                  <Sparkles className="w-3 h-3 mr-2" />
                  AI Assistant
                </TabsTrigger>
              </TabsList>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-6 h-6"
                onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
              >
                {isTerminalExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>

            <TabsContent value="terminal" className="flex-1 m-0 flex flex-col">
              <ScrollArea className="flex-1 p-4 font-mono text-sm">
                {terminalOutput.map((line, index) => (
                  <div key={index} className={line.type === "input" ? "text-green-400" : "text-muted-foreground"}>
                    {line.type === "input" ? "$ " : ""}{line.content}
                  </div>
                ))}
              </ScrollArea>
              <div className="p-2 border-t border-border flex items-center gap-2">
                <span className="text-green-400 font-mono">$</span>
                <Input 
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTerminalSubmit()}
                  placeholder="Enter command..."
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 m-0 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 glass rounded-lg p-3">
                      <p className="text-sm">
                        Hello! I'm your AI coding assistant. I can help you with:
                      </p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Writing and explaining code</li>
                        <li>• Debugging and fixing errors</li>
                        <li>• Code optimization suggestions</li>
                        <li>• Documentation generation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-2 border-t border-border flex items-center gap-2">
                <Input 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiAssist()}
                  placeholder="Ask AI for help..."
                  className="flex-1"
                />
                <Button size="icon" onClick={handleAiAssist}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
