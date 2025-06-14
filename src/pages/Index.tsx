
import { useState } from "react";
import { ProjectDashboard } from "@/components/dashboard/ProjectDashboard";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";
import { NewProjectWizard } from "@/components/project/NewProjectWizard";
import { IssueBoard } from "@/components/issues/IssueBoard";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { Navigation } from "@/components/layout/Navigation";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "planned";
  dueDate?: string;
  completionDate?: string;
  techStack: string[];
  tags: string[];
  customSections: CustomSection[];
  createdAt: string;
  updatedAt: string;
};

export type CustomSection = {
  id: string;
  title: string;
  content: string;
  type?: "text" | "link" | "markdown" | "file";
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
  customSections: CustomSection[];
  createdAt: string;
  updatedAt: string;
};

export type Issue = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  labels: string[];
  customSections: CustomSection[];
  createdAt: string;
  updatedAt: string;
};

export type CurrentView = "dashboard" | "project" | "new-project" | "issues" | "tasks";

const Index = () => {
  const [currentView, setCurrentView] = useState<CurrentView>("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Personal Portfolio Website",
      description: "A modern portfolio website showcasing my projects and skills",
      status: "active",
      dueDate: "2025-07-01",
      techStack: ["React", "TypeScript", "Tailwind CSS"],
      tags: ["web", "portfolio", "frontend"],
      customSections: [
        {
          id: "cs1",
          title: "Deployment Info",
          content: "Hosted on Vercel at https://myportfolio.vercel.app",
          type: "link",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
      createdAt: "2025-06-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Mobile Task Manager",
      description: "Cross-platform mobile app for task management",
      status: "planned",
      dueDate: "2025-08-15",
      techStack: ["React Native", "Expo", "Firebase"],
      tags: ["mobile", "productivity", "app"],
      customSections: [],
      createdAt: "2025-06-10T00:00:00Z",
      updatedAt: new Date().toISOString(),
    }
  ]);

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "1",
      projectId: "1",
      title: "API endpoint returning 500 error",
      description: "The /api/users endpoint is throwing internal server errors",
      status: "open" as const,
      labels: ["bug", "api", "critical"],
      customSections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2", 
      projectId: "1",
      title: "Mobile responsive layout issues",
      description: "Navigation menu doesn't work properly on mobile devices",
      status: "in-progress" as const,
      labels: ["frontend", "mobile", "ui"],
      customSections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      projectId: "1",
      title: "Design homepage mockups",
      description: "Create wireframes and high-fidelity mockups for the portfolio homepage",
      status: "todo" as const,
      dueDate: "2025-06-20",
      customSections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      projectId: "1", 
      title: "Implement contact form",
      description: "Build a working contact form with validation and email integration",
      status: "in-progress" as const,
      dueDate: "2025-06-25",
      customSections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const handleViewChange = (view: CurrentView, projectId?: string) => {
    setCurrentView(view);
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  };

  const handleCreateProject = (projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "customSections">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      customSections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
    setCurrentView("dashboard");
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleCreateIssue = (issueData: Omit<Issue, "id" | "createdAt" | "updatedAt">) => {
    const newIssue: Issue = {
      ...issueData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIssues([...issues, newIssue]);
  };

  const handleUpdateIssue = (updatedIssue: Issue) => {
    setIssues(issues.map(i => i.id === updatedIssue.id ? updatedIssue : i));
  };

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation 
        currentView={currentView} 
        onViewChange={handleViewChange}
        projectCount={projects.length}
      />
      
      <main className="container mx-auto px-6 py-8">
        {currentView === "dashboard" && (
          <ProjectDashboard 
            projects={projects}
            onViewProject={(projectId) => handleViewChange("project", projectId)}
            onCreateProject={() => handleViewChange("new-project")}
            onUpdateProject={handleUpdateProject}
          />
        )}
        
        {currentView === "project" && selectedProject && (
          <ProjectDetailView 
            project={selectedProject}
            issues={issues}
            tasks={tasks}
            onUpdateProject={handleUpdateProject}
            onCreateIssue={handleCreateIssue}
            onUpdateIssue={handleUpdateIssue}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onBack={() => handleViewChange("dashboard")}
          />
        )}
        
        {currentView === "new-project" && (
          <NewProjectWizard 
            onCreateProject={handleCreateProject}
            onCancel={() => handleViewChange("dashboard")}
          />
        )}
        
        {currentView === "issues" && (
          <IssueBoard 
            projects={projects}
            issues={issues}
            onCreateIssue={handleCreateIssue}
            onUpdateIssue={handleUpdateIssue}
          />
        )}
        
        {currentView === "tasks" && (
          <TaskBoard 
            projects={projects}
            tasks={tasks}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
