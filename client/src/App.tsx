import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import CRM from "./pages/CRM";
import Content from "./pages/Content";
import Projects from "./pages/Projects";
import Email from "./pages/Email";
import CodeEditor from "./pages/CodeEditor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/notes" component={Notes} />
      <Route path="/notes/:id" component={Notes} />
      <Route path="/crm" component={CRM} />
      <Route path="/crm/:tab" component={CRM} />
      <Route path="/content" component={Content} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={Projects} />
      <Route path="/email" component={Email} />
      <Route path="/email/:folder" component={Email} />
      <Route path="/code" component={CodeEditor} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
