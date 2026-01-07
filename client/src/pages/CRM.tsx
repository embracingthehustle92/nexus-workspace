import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Users, 
  FolderOpen, 
  Kanban, 
  Mail, 
  Code2, 
  Search,
  Plus,
  Building2,
  DollarSign,
  Phone,
  MailIcon,
  MapPin,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  TrendingUp,
  Target,
  Sparkles,
  Home,
  Layers,
  ChevronRight
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

const contacts = [
  { id: 1, name: "John Smith", email: "john@acme.com", company: "Acme Corp", status: "customer", phone: "+1 555-0123", avatar: null },
  { id: 2, name: "Sarah Johnson", email: "sarah@techstart.io", company: "TechStart", status: "lead", phone: "+1 555-0124", avatar: null },
  { id: 3, name: "Michael Chen", email: "m.chen@global.com", company: "Global Industries", status: "prospect", phone: "+1 555-0125", avatar: null },
  { id: 4, name: "Emily Davis", email: "emily@innovate.co", company: "Innovate Co", status: "customer", phone: "+1 555-0126", avatar: null },
  { id: 5, name: "Robert Wilson", email: "rwilson@enterprise.net", company: "Enterprise Solutions", status: "inactive", phone: "+1 555-0127", avatar: null },
];

const companies = [
  { id: 1, name: "Acme Corp", industry: "Technology", size: "500-1000", revenue: "$50M", contacts: 12, deals: 3 },
  { id: 2, name: "TechStart", industry: "Software", size: "50-100", revenue: "$5M", contacts: 5, deals: 2 },
  { id: 3, name: "Global Industries", industry: "Manufacturing", size: "1000+", revenue: "$200M", contacts: 8, deals: 1 },
  { id: 4, name: "Innovate Co", industry: "Consulting", size: "100-500", revenue: "$25M", contacts: 6, deals: 4 },
];

const deals = [
  { id: 1, title: "Enterprise License", company: "Acme Corp", value: 50000, stage: "negotiation", probability: 75 },
  { id: 2, title: "Annual Subscription", company: "TechStart", value: 12000, stage: "proposal", probability: 50 },
  { id: 3, title: "Custom Development", company: "Global Industries", value: 150000, stage: "qualified", probability: 30 },
  { id: 4, title: "Support Package", company: "Innovate Co", value: 8000, stage: "closed_won", probability: 100 },
  { id: 5, title: "Platform Migration", company: "Acme Corp", value: 75000, stage: "lead", probability: 10 },
];

const stages = [
  { id: "lead", label: "Lead", color: "bg-gray-500" },
  { id: "qualified", label: "Qualified", color: "bg-blue-500" },
  { id: "proposal", label: "Proposal", color: "bg-yellow-500" },
  { id: "negotiation", label: "Negotiation", color: "bg-purple-500" },
  { id: "closed_won", label: "Won", color: "bg-green-500" },
  { id: "closed_lost", label: "Lost", color: "bg-red-500" },
];

const statusColors: Record<string, string> = {
  lead: "bg-blue-500/20 text-blue-400",
  prospect: "bg-yellow-500/20 text-yellow-400",
  customer: "bg-green-500/20 text-green-400",
  inactive: "bg-gray-500/20 text-gray-400",
};

export default function CRM() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const params = useParams();
  const [activeTab, setActiveTab] = useState(params.tab || "contacts");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading CRM...</p>
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
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">CRM</CardTitle>
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

  const handleAiInsights = () => {
    toast.info("AI Insights", { description: "AI-powered CRM insights coming soon!" });
  };

  const totalPipelineValue = deals.filter(d => !d.stage.includes("closed")).reduce((sum, d) => sum + d.value, 0);
  const wonDeals = deals.filter(d => d.stage === "closed_won").reduce((sum, d) => sum + d.value, 0);

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
            <p className="text-xs text-muted-foreground">CRM</p>
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
        </ScrollArea>

        {/* Stats Summary */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pipeline</span>
            <span className="font-medium">${(totalPipelineValue / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Won</span>
            <span className="font-medium text-green-400">${(wonDeals / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Contacts</span>
            <span className="font-medium">{contacts.length}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold">CRM</h2>
            <p className="text-sm text-muted-foreground">Manage contacts, companies, and deals</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleAiInsights}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
            <Button size="sm" className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b border-border px-6">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger value="contacts" className="data-[state=active]:bg-muted">
                <Users className="w-4 h-4 mr-2" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="companies" className="data-[state=active]:bg-muted">
                <Building2 className="w-4 h-4 mr-2" />
                Companies
              </TabsTrigger>
              <TabsTrigger value="deals" className="data-[state=active]:bg-muted">
                <DollarSign className="w-4 h-4 mr-2" />
                Deals
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="data-[state=active]:bg-muted">
                <Target className="w-4 h-4 mr-2" />
                Pipeline
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            {/* Contacts Tab */}
            <TabsContent value="contacts" className="m-0 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search contacts..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </div>

              <div className="grid gap-4">
                {contacts.filter(c => 
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.company.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((contact) => (
                  <Card 
                    key={contact.id} 
                    className="glass hover:border-primary/50 cursor-pointer transition-all"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={contact.avatar || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {contact.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{contact.name}</h3>
                            <Badge className={statusColors[contact.status]} variant="secondary">
                              {contact.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{contact.company}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MailIcon className="w-4 h-4" />
                            {contact.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Send Email</DropdownMenuItem>
                            <DropdownMenuItem>Create Deal</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Companies Tab */}
            <TabsContent value="companies" className="m-0 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {companies.map((company) => (
                  <Card key={company.id} className="glass hover:border-primary/50 cursor-pointer transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{company.name}</h3>
                            <p className="text-sm text-muted-foreground">{company.industry}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Add Contact</DropdownMenuItem>
                            <DropdownMenuItem>Create Deal</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-medium">{company.size}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-medium">{company.revenue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Contacts</p>
                          <p className="font-medium">{company.contacts}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Active Deals</p>
                          <p className="font-medium">{company.deals}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Deals Tab */}
            <TabsContent value="deals" className="m-0 p-6">
              <div className="grid gap-4">
                {deals.map((deal) => {
                  const stage = stages.find(s => s.id === deal.stage);
                  return (
                    <Card key={deal.id} className="glass hover:border-primary/50 cursor-pointer transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-12 rounded-full ${stage?.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{deal.title}</h3>
                              <Badge variant="outline">{stage?.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{deal.company}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">${deal.value.toLocaleString()}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{deal.probability}% probability</span>
                            </div>
                          </div>
                          <div className="w-24">
                            <Progress value={deal.probability} className="h-2" />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Update Stage</DropdownMenuItem>
                              <DropdownMenuItem>Add Activity</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Pipeline Tab */}
            <TabsContent value="pipeline" className="m-0 p-6">
              <div className="grid grid-cols-5 gap-4">
                {stages.filter(s => !s.id.includes("lost")).map((stage) => {
                  const stageDeals = deals.filter(d => d.stage === stage.id);
                  const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
                  return (
                    <div key={stage.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                          <span className="font-medium text-sm">{stage.label}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          ${(stageValue / 1000).toFixed(0)}K
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {stageDeals.map((deal) => (
                          <Card key={deal.id} className="glass cursor-pointer hover:border-primary/50">
                            <CardContent className="p-3">
                              <h4 className="font-medium text-sm mb-1">{deal.title}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{deal.company}</p>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">${deal.value.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <Button variant="ghost" className="w-full border border-dashed border-border text-muted-foreground">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Deal
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </main>
    </div>
  );
}
