import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Users, 
  FolderOpen, 
  Kanban, 
  Mail, 
  Code2, 
  Search,
  Plus,
  Inbox,
  Send,
  FileIcon,
  Trash2,
  Archive,
  Star,
  MoreHorizontal,
  Reply,
  ReplyAll,
  Forward,
  Paperclip,
  Clock,
  AlertCircle,
  Home,
  Layers,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  X
} from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
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

const folders = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 12 },
  { id: "sent", label: "Sent", icon: Send, count: 0 },
  { id: "drafts", label: "Drafts", icon: FileIcon, count: 3 },
  { id: "archive", label: "Archive", icon: Archive, count: 0 },
  { id: "trash", label: "Trash", icon: Trash2, count: 0 },
];

const emails = [
  { 
    id: 1, 
    from: "John Smith", 
    email: "john@acme.com", 
    subject: "Q4 Planning Meeting", 
    preview: "Hi team, I wanted to follow up on our discussion about the Q4 planning...",
    body: `Hi team,

I wanted to follow up on our discussion about the Q4 planning meeting. Here are the key points we need to address:

1. Budget allocation for marketing initiatives
2. Product roadmap priorities
3. Team expansion plans
4. Customer success metrics

Please review the attached documents before our meeting on Friday.

Best regards,
John`,
    time: "10:30 AM", 
    isRead: false, 
    isStarred: true,
    hasAttachments: true,
    folder: "inbox"
  },
  { 
    id: 2, 
    from: "Sarah Johnson", 
    email: "sarah@techstart.io", 
    subject: "Partnership Proposal", 
    preview: "Thank you for your interest in partnering with TechStart. We've reviewed...",
    body: `Thank you for your interest in partnering with TechStart. We've reviewed your proposal and would like to schedule a call to discuss further.

Our team is particularly interested in:
- Integration possibilities
- Joint marketing opportunities
- Revenue sharing models

Let me know your availability for next week.

Best,
Sarah`,
    time: "9:15 AM", 
    isRead: true, 
    isStarred: false,
    hasAttachments: false,
    folder: "inbox"
  },
  { 
    id: 3, 
    from: "Marketing Team", 
    email: "marketing@company.com", 
    subject: "Campaign Results - December", 
    preview: "Here are the results from our December marketing campaign...",
    body: `Here are the results from our December marketing campaign:

📊 Key Metrics:
- Total Reach: 1.2M impressions
- Click-through Rate: 3.8%
- Conversions: 2,450
- ROI: 285%

The social media campaign performed exceptionally well, exceeding our targets by 40%.

Full report attached.

Marketing Team`,
    time: "Yesterday", 
    isRead: true, 
    isStarred: false,
    hasAttachments: true,
    folder: "inbox"
  },
  { 
    id: 4, 
    from: "Support", 
    email: "support@vendor.com", 
    subject: "Your ticket #4521 has been resolved", 
    preview: "We're pleased to inform you that your support ticket has been resolved...",
    body: `We're pleased to inform you that your support ticket #4521 has been resolved.

Issue: API rate limiting errors
Resolution: Increased rate limits for your account

If you experience any further issues, please don't hesitate to reach out.

Support Team`,
    time: "Yesterday", 
    isRead: true, 
    isStarred: false,
    hasAttachments: false,
    folder: "inbox"
  },
  { 
    id: 5, 
    from: "Emily Davis", 
    email: "emily@innovate.co", 
    subject: "Project Update - Website Redesign", 
    preview: "Quick update on the website redesign project. We've completed...",
    body: `Quick update on the website redesign project.

We've completed:
✅ Homepage design
✅ Navigation structure
✅ Mobile responsive layouts

In progress:
🔄 Contact page
🔄 About section
🔄 Blog templates

Expected completion: January 15th

Let me know if you have any questions!

Emily`,
    time: "2 days ago", 
    isRead: false, 
    isStarred: true,
    hasAttachments: false,
    folder: "inbox"
  },
];

export default function Email() {
  const { user, loading, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const params = useParams();
  const [selectedFolder, setSelectedFolder] = useState(params.folder || "inbox");
  const [selectedEmail, setSelectedEmail] = useState<typeof emails[0] | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading emails...</p>
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
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Email</CardTitle>
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

  const folderEmails = emails.filter(e => e.folder === selectedFolder);
  const filteredEmails = folderEmails.filter(e => 
    e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAiCompose = () => {
    toast.info("AI Compose", { description: "AI email composition coming soon!" });
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
            <p className="text-xs text-muted-foreground">Email</p>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        <div className="p-4">
          <Button 
            className="w-full gradient-primary" 
            onClick={() => setIsComposing(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  selectedFolder === folder.id ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground"
                }`}
                onClick={() => {
                  setSelectedFolder(folder.id);
                  setSelectedEmail(null);
                }}
              >
                <folder.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{folder.label}</span>
                {folder.count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {folder.count}
                  </Badge>
                )}
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

      {/* Email List */}
      <div className="w-96 border-r border-border flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search emails..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={selectedEmails.length === filteredEmails.length && filteredEmails.length > 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedEmails(filteredEmails.map(e => e.id));
                } else {
                  setSelectedEmails([]);
                }
              }}
            />
            <span className="text-sm text-muted-foreground">
              {selectedEmails.length > 0 ? `${selectedEmails.length} selected` : `${filteredEmails.length} emails`}
            </span>
          </div>
          <Button variant="ghost" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Email List */}
        <ScrollArea className="flex-1">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`p-4 border-b border-border cursor-pointer transition-colors ${
                selectedEmail?.id === email.id ? "bg-muted" : "hover:bg-muted/50"
              } ${!email.isRead ? "bg-primary/5" : ""}`}
              onClick={() => setSelectedEmail(email)}
            >
              <div className="flex items-start gap-3">
                <Checkbox 
                  checked={selectedEmails.includes(email.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedEmails([...selectedEmails, email.id]);
                    } else {
                      setSelectedEmails(selectedEmails.filter(id => id !== email.id));
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium text-sm ${!email.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                      {email.from}
                    </span>
                    <span className="text-xs text-muted-foreground">{email.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm truncate ${!email.isRead ? "font-medium" : ""}`}>
                      {email.subject}
                    </span>
                    {email.hasAttachments && <Paperclip className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-6 h-6 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle star
                  }}
                >
                  <Star className={`w-4 h-4 ${email.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Email Content / Compose */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {isComposing ? (
          <>
            {/* Compose Header */}
            <header className="h-14 border-b border-border flex items-center justify-between px-6">
              <h2 className="font-semibold">New Message</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleAiCompose}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Compose
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsComposing(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </header>

            {/* Compose Form */}
            <div className="flex-1 p-6">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-16">To:</span>
                  <Input placeholder="recipient@example.com" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-16">Subject:</span>
                  <Input placeholder="Email subject" />
                </div>
                <Separator />
                <Textarea 
                  placeholder="Write your message..." 
                  className="min-h-[400px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">Save Draft</Button>
                    <Button className="gradient-primary">
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : selectedEmail ? (
          <>
            {/* Email Header */}
            <header className="h-14 border-b border-border flex items-center justify-between px-6">
              <Button variant="ghost" size="sm" onClick={() => setSelectedEmail(null)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Reply className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ReplyAll className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Forward className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon">
                  <Archive className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                    <DropdownMenuItem>Add label</DropdownMenuItem>
                    <DropdownMenuItem>Print</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Email Content */}
            <ScrollArea className="flex-1">
              <div className="p-6 max-w-3xl">
                <h1 className="text-2xl font-semibold mb-6">{selectedEmail.subject}</h1>
                
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {selectedEmail.from.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedEmail.from}</p>
                        <p className="text-sm text-muted-foreground">{selectedEmail.email}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{selectedEmail.time}</span>
                    </div>
                  </div>
                </div>

                {selectedEmail.hasAttachments && (
                  <Card className="glass mb-6">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Paperclip className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">attachment.pdf</p>
                          <p className="text-xs text-muted-foreground">2.4 MB</p>
                        </div>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-foreground bg-transparent p-0 border-none">
                    {selectedEmail.body}
                  </pre>
                </div>
              </div>
            </ScrollArea>

            {/* Quick Reply */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-4 max-w-3xl">
                <Input placeholder="Write a reply..." className="flex-1" />
                <Button className="gradient-primary">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select an email</h3>
              <p className="text-muted-foreground">Choose an email from the list to view its contents</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
