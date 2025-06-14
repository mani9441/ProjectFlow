
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  FolderOpen, 
  Plus, 
  Bug, 
  CheckSquare,
  BarChart3
} from "lucide-react";
import { CurrentView } from "@/pages/Index";

interface NavigationProps {
  currentView: CurrentView;
  onViewChange: (view: CurrentView) => void;
  projectCount: number;
}

export const Navigation = ({ currentView, onViewChange, projectCount }: NavigationProps) => {
  const navItems = [
    { 
      key: "dashboard" as CurrentView, 
      label: "Dashboard", 
      icon: Home,
      badge: projectCount > 0 ? projectCount.toString() : undefined
    },
    { 
      key: "new-project" as CurrentView, 
      label: "New Project", 
      icon: Plus 
    },
    { 
      key: "issues" as CurrentView, 
      label: "Issues", 
      icon: Bug 
    },
    { 
      key: "tasks" as CurrentView, 
      label: "Tasks", 
      icon: CheckSquare 
    },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">ProjectFlow</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.key}
                  variant={currentView === item.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.key)}
                  className="relative"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 h-5 px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
