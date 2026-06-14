import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, Terminal, FolderTree, Play, Save, Settings, Search, 
  GitBranch, Sparkles, ChevronRight, ChevronDown, File, Folder,
  Plus, X, MoreVertical, Copy, Trash2, Edit3, Download, Upload,
  RefreshCw, Maximize2, Minimize2, Split, PanelLeft, PanelRight,
  Bug, Lightbulb, MessageSquare, Zap, FileCode, FileJson, FileText,
  Image, Database, Globe, Coffee, Hash, Braces, BookOpen, Command,
  Moon, Sun, Palette, Layout, Layers, Package, Clock, CheckCircle,
  AlertCircle, Info, Send, Bot, User, Wand2, FileQuestion, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";
import { trpc } from "@/lib/trpc";

interface VirtualFile {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: VirtualFile[];
  language?: string;
  isOpen?: boolean;
  isModified?: boolean;
  path: string;
}

interface OpenTab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isModified: boolean;
}

interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "info";
  content: string;
  timestamp: Date;
}

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Default project structure
const defaultProject: VirtualFile = {
  id: "root",
  name: "my-project",
  type: "folder",
  path: "/my-project",
  isOpen: true,
  children: [
    {
      id: "src",
      name: "src",
      type: "folder",
      path: "/my-project/src",
      isOpen: true,
      children: [
        {
          id: "index-js",
          name: "index.js",
          type: "file",
          path: "/my-project/src/index.js",
          language: "javascript",
          content: `// Welcome to Nexus Dev Environment
// Start coding your application here

console.log('Hello, Nexus!');
console.log('Welcome to the Virtual Development Environment');

// Your code here
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);
`,
        },
        {
          id: "app-tsx",
          name: "App.tsx",
          type: "file",
          path: "/my-project/src/App.tsx",
          language: "typescript",
          content: `import React, { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ]);

  return (
    <div className="app">
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
`,
        },
      ],
    },
    {
      id: "package-json",
      name: "package.json",
      type: "file",
      path: "/my-project/package.json",
      language: "json",
      content: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A Nexus workspace project",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "webpack --mode production",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
`,
    },
  ],
};

export default function DevEnvironment() {
  const [project, setProject] = useState<VirtualFile>(defaultProject);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { id: "1", type: "info", content: "Welcome to Nexus Terminal v1.0.0", timestamp: new Date() },
    { id: "2", type: "info", content: "Type 'help' for available commands", timestamp: new Date() },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const aiChatRef = useRef<HTMLDivElement>(null);

  const aiAssist = trpc.notes.aiAssist.useMutation();

  const getExtension = (filename: string): string => {
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  };

  const openFile = (file: VirtualFile) => {
    if (file.type !== "file") return;
    
    const existingTab = openTabs.find(tab => tab.id === file.id);
    if (existingTab) {
      setActiveTabId(file.id);
      return;
    }

    const ext = getExtension(file.name);
    const languageMap: Record<string, string> = {
      js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
      py: "python", html: "html", css: "css", json: "json", md: "markdown",
    };

    const newTab: OpenTab = {
      id: file.id,
      name: file.name,
      path: file.path,
      content: file.content || "",
      language: languageMap[ext] || "plaintext",
      isModified: false,
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTabId(file.id);
  };

  const closeTab = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const tab = openTabs.find(t => t.id === tabId);
    if (tab?.isModified) {
      if (!confirm("You have unsaved changes. Close anyway?")) return;
    }
    
    setOpenTabs(prev => prev.filter(t => t.id !== tabId));
    if (activeTabId === tabId) {
      const remaining = openTabs.filter(t => t.id !== tabId);
      setActiveTabId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const updateFileContent = (content: string | undefined) => {
    if (!activeTabId || content === undefined) return;
    
    setOpenTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, content, isModified: true }
        : tab
    ));
  };

  const saveFile = () => {
    if (!activeTabId) return;
    const tab = openTabs.find(t => t.id === activeTabId);
    if (!tab) return;

    setOpenTabs(prev => prev.map(t => 
      t.id === activeTabId ? { ...t, isModified: false } : t
    ));
    toast.success(`Saved ${tab.name}`);
  };

  const toggleFolder = (folderId: string) => {
    const updateNode = (node: VirtualFile): VirtualFile => {
      if (node.id === folderId) {
        return { ...node, isOpen: !node.isOpen };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateNode) };
      }
      return node;
    };
    setProject(updateNode(project));
  };

  const executeCommand = (cmd: string) => {
    let output: TerminalLine[] = [];

    if (cmd.toLowerCase() === "help") {
      output = [
        { id: Date.now().toString(), type: "info", content: "Available commands: help, clear, ls, pwd, echo, date, node, python", timestamp: new Date() },
      ];
    } else if (cmd.toLowerCase() === "clear") {
      setTerminalLines([]);
      return;
    } else if (cmd.toLowerCase() === "pwd") {
      output = [{ id: Date.now().toString(), type: "output", content: project.path, timestamp: new Date() }];
    } else if (cmd.toLowerCase().startsWith("echo ")) {
      const text = cmd.substring(5);
      output = [{ id: Date.now().toString(), type: "output", content: text, timestamp: new Date() }];
    } else if (cmd.toLowerCase() === "date") {
      output = [{ id: Date.now().toString(), type: "output", content: new Date().toString(), timestamp: new Date() }];
    } else {
      output = [{ id: Date.now().toString(), type: "error", content: `Command not found: ${cmd}. Type 'help' for available commands.`, timestamp: new Date() }];
    }

    setTerminalLines(prev => [
      ...prev,
      { id: Date.now().toString() + "cmd", type: "input", content: `$ ${cmd}`, timestamp: new Date() },
      ...output,
    ]);
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && terminalInput.trim()) {
      executeCommand(terminalInput);
      setTerminalInput("");
    }
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim() || isAiLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: "user",
      content: aiInput,
      timestamp: new Date(),
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiInput("");
    setIsAiLoading(true);

    try {
      const activeTab = openTabs.find(t => t.id === activeTabId);
      const context = activeTab ? `Current file: ${activeTab.name}\n\nCode:\n${activeTab.content}\n\n` : "";
      
      const result = await aiAssist.mutateAsync({
        content: `${context}User question: ${userMessage.content}`,
        action: "improve",
      });

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: (typeof result.result === 'string' ? result.result : String(result.result)) || "I can help you with your code.",
        timestamp: new Date(),
      };

      setAiMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setAiMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  useEffect(() => {
    if (aiChatRef.current) {
      aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
    }
  }, [aiMessages]);

  const renderFileTree = (node: VirtualFile, depth = 0) => {
    const isActive = openTabs.some(t => t.id === node.id && t.id === activeTabId);

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-white/5 rounded transition-colors ${
            isActive ? "bg-indigo-500/20 text-indigo-400" : ""
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => node.type === "folder" ? toggleFolder(node.id) : openFile(node)}
        >
          {node.type === "folder" ? (
            <>
              {node.isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <Folder className={`w-4 h-4 ${node.isOpen ? "text-yellow-400" : "text-yellow-600"}`} />
            </>
          ) : (
            <>
              <span className="w-4" />
              <FileCode className="w-4 h-4 text-blue-400" />
            </>
          )}
          <span className="text-sm truncate flex-1">{node.name}</span>
        </div>
        
        {node.type === "folder" && node.isOpen && node.children && (
          <div>
            {node.children.map(child => renderFileTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const activeTab = openTabs.find(t => t.id === activeTabId);

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-gray-200">
      {/* Top Bar */}
      <div className="h-12 bg-[#161b22] border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold">Nexus IDE</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <PanelLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Sidebar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8"
                onClick={saveFile}
                disabled={!activeTab?.isModified}
              >
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8"
                onClick={() => setShowTerminal(!showTerminal)}
              >
                <Terminal className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Terminal</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showAiPanel ? "default" : "ghost"}
                size="sm" 
                className="h-8"
                onClick={() => setShowAiPanel(!showAiPanel)}
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>AI Assistant</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#0d1117] border-r border-gray-800 flex flex-col"
            >
              <div className="p-2 border-b border-gray-800">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explorer</span>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="py-1">
                  {renderFileTree(project)}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div className="h-9 bg-[#161b22] border-b border-gray-800 flex items-center overflow-x-auto">
            {openTabs.map(tab => (
              <div
                key={tab.id}
                className={`flex items-center gap-2 px-3 h-full border-r border-gray-800 cursor-pointer group min-w-0 ${
                  tab.id === activeTabId 
                    ? "bg-[#0d1117] border-t-2 border-t-indigo-500" 
                    : "hover:bg-gray-800/50"
                }`}
                onClick={() => setActiveTabId(tab.id)}
              >
                <FileCode className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span className="text-sm truncate max-w-[120px]">{tab.name}</span>
                {tab.isModified && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  onClick={(e) => closeTab(tab.id, e)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1 flex">
            {activeTab ? (
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={activeTab.language}
                  value={activeTab.content}
                  theme={editorTheme}
                  onChange={updateFileContent}
                  options={{
                    fontSize,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Code2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg mb-2">No file open</p>
                  <p className="text-sm">Select a file from the explorer</p>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 200 }}
                exit={{ height: 0 }}
                className="bg-[#0d1117] border-t border-gray-800"
              >
                <div className="h-8 bg-[#161b22] border-b border-gray-800 flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium">Terminal</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => setShowTerminal(false)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                <div 
                  ref={terminalRef}
                  className="h-[calc(100%-32px)] overflow-auto p-2 font-mono text-sm"
                >
                  {terminalLines.map(line => (
                    <div 
                      key={line.id}
                      className={`${
                        line.type === "error" ? "text-red-400" :
                        line.type === "info" ? "text-blue-400" :
                        line.type === "input" ? "text-green-400" :
                        "text-gray-300"
                      }`}
                    >
                      {line.content}
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-green-400">$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={handleTerminalKeyDown}
                      className="flex-1 bg-transparent outline-none text-gray-300"
                      placeholder="Type a command..."
                      autoFocus
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Panel */}
        <AnimatePresence>
          {showAiPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#0d1117] border-l border-gray-800 flex flex-col"
            >
              <div className="h-12 bg-[#161b22] border-b border-gray-800 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="font-medium">AI Assistant</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setShowAiPanel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4" ref={aiChatRef}>
                {aiMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Ask me anything about your code!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiMessages.map(msg => (
                      <div 
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-purple-400" />
                          </div>
                        )}
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 text-sm ${
                            msg.role === "user" 
                              ? "bg-indigo-500/20 text-indigo-100" 
                              : "bg-gray-800/50 text-gray-300"
                          }`}
                        >
                          <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-indigo-400" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isAiLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                  <Textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask about your code..."
                    className="min-h-[60px] bg-gray-800/50 border-gray-700 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendAiMessage();
                      }
                    }}
                  />
                </div>
                <Button 
                  className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                  onClick={sendAiMessage}
                  disabled={isAiLoading || !aiInput.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#161b22] border-t border-gray-800 flex items-center justify-between px-4 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" /> main
          </span>
          {activeTab && (
            <>
              <span>{activeTab.language}</span>
              <span>UTF-8</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {activeTab && (
            <span>Ln 1, Col 1</span>
          )}
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-400" /> Ready
          </span>
        </div>
      </div>
    </div>
  );
}
