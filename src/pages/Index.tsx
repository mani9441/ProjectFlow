import { useState } from "react";
import { ProjectDashboard } from "@/components/dashboard/ProjectDashboard";
import { ProjectDetailView } from "@/components/project/ProjectDetailView";
import { NewProjectWizard } from "@/components/project/NewProjectWizard";
import { IssueBoard } from "@/components/issues/IssueBoard";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { Navigation } from "@/components/layout/Navigation";
import { useProjectData } from "@/hooks/useProjectData";
import type { Project, Task, Issue, CurrentView } from "@/types";

const Index = () => {
  const [currentView, setCurrentView] = useState<CurrentView>("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const {
    projects, issues, tasks,
    projectsLoading, issuesLoading, tasksLoading,
    projectsError, issuesError, tasksError,
    createProject, updateProject,
    createIssue, updateIssue,
    createTask, updateTask,
    retryAll
  } = useProjectData();

  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

  const handleViewChange = (view: CurrentView, projectId?: string) => {
    setCurrentView(view);
    if (projectId) setSelectedProjectId(projectId);
  };

  // For new/edit actions, back to dashboard or keep on details
  const handleCreateProject = (projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "customSections">) => {
    console.log("handleCreateProject called with:", projectData);
    createProject(projectData);
    setCurrentView("dashboard");
  };

  // Loading and error handling
  if (projectsLoading || tasksLoading || issuesLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50">
        <span className="text-lg text-slate-600">Loading...</span>
      </div>
    );
  }
  if (projectsError || tasksError || issuesError) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50">
        <span className="text-red-600 mb-4">Failed to load data from server.</span>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={retryAll}
        >
          Retry
        </button>
      </div>
    );
  }

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
            onUpdateProject={updateProject}
          />
        )}
        {currentView === "project" && selectedProject && (
          <ProjectDetailView 
            project={selectedProject}
            issues={issues}
            tasks={tasks}
            onUpdateProject={updateProject}
            onCreateIssue={createIssue}
            onUpdateIssue={updateIssue}
            onCreateTask={createTask}
            onUpdateTask={updateTask}
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
            onCreateIssue={createIssue}
            onUpdateIssue={updateIssue}
          />
        )}
        {currentView === "tasks" && (
          <TaskBoard 
            projects={projects}
            tasks={tasks}
            onCreateTask={createTask}
            onUpdateTask={updateTask}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
