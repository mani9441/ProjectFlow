import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Code, Tag, Plus, Edit2, Trash2 } from "lucide-react";
import { Project, Issue, Task } from "@/pages/Index";
import { CustomSectionEditor } from "@/components/common/CustomSectionEditor";
import { CustomSectionDisplay } from "@/components/common/CustomSectionDisplay";
import { ProjectIssueBoard } from "@/components/project/ProjectIssueBoard";
import { ProjectTaskBoard } from "@/components/project/ProjectTaskBoard";

interface ProjectDetailViewProps {
  project: Project;
  issues: Issue[];
  tasks: Task[];
  onUpdateProject: (project: Project) => void;
  onCreateIssue: (issue: Omit<Issue, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateIssue: (issue: Issue) => void;
  onCreateTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateTask: (task: Task) => void;
  onBack: () => void;
}

export const ProjectDetailView = ({ 
  project, 
  issues, 
  tasks, 
  onUpdateProject, 
  onCreateIssue,
  onUpdateIssue,
  onCreateTask,
  onUpdateTask,
  onBack 
}: ProjectDetailViewProps) => {
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const handleAddCustomSection = (title: string, content: string, type?: string) => {
    const newSection = {
      id: Date.now().toString(),
      title,
      content,
      type: type as "text" | "link" | "markdown" | "file" | undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProject = {
      ...project,
      customSections: [...project.customSections, newSection],
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    setShowAddSection(false);
  };

  const handleEditCustomSection = (sectionId: string, title: string, content: string, type?: string) => {
    const updatedProject = {
      ...project,
      customSections: project.customSections.map(section =>
        section.id === sectionId
          ? { ...section, title, content, type: type as any, updatedAt: new Date().toISOString() }
          : section
      ),
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    setEditingSectionId(null);
  };

  const handleDeleteCustomSection = (sectionId: string) => {
    const updatedProject = {
      ...project,
      customSections: project.customSections.filter(section => section.id !== sectionId),
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{project.name}</h1>
          <p className="text-slate-600 mt-1">Project Details</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="sections">Custom Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">Project Overview</CardTitle>
                <Badge 
                  variant={project.status === "active" ? "default" : 
                          project.status === "completed" ? "secondary" : "outline"}
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Description</h3>
                <p className="text-slate-600">{project.description || "No description provided"}</p>
              </div>

              {project.techStack.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Code className="h-4 w-4 text-slate-600" />
                    <h3 className="font-medium text-slate-800">Tech Stack</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {project.tags.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="h-4 w-4 text-slate-600" />
                    <h3 className="font-medium text-slate-800">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.dueDate && (
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="text-sm text-slate-500">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <ProjectIssueBoard
            project={project}
            issues={issues.filter(issue => issue.projectId === project.id)}
            onCreateIssue={onCreateIssue}
            onUpdateIssue={onUpdateIssue}
          />
        </TabsContent>

        <TabsContent value="tasks">
          <ProjectTaskBoard
            project={project}
            tasks={tasks.filter(task => task.projectId === project.id)}
            onCreateTask={onCreateTask}
            onUpdateTask={onUpdateTask}
          />
        </TabsContent>

        <TabsContent value="sections" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Custom Sections</CardTitle>
                <Button 
                  onClick={() => setShowAddSection(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddSection && (
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <CustomSectionEditor
                    onSave={handleAddCustomSection}
                    onCancel={() => setShowAddSection(false)}
                  />
                </div>
              )}

              {project.customSections.length === 0 && !showAddSection && (
                <div className="text-center py-8 text-slate-500">
                  <p>No custom sections yet</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddSection(true)}
                    className="mt-2"
                  >
                    Add your first section
                  </Button>
                </div>
              )}

              {project.customSections.map((section, index) => (
                <div key={section.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="group">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-slate-800">{section.title}</h3>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSectionId(section.id)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCustomSection(section.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {editingSectionId === section.id ? (
                      <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <CustomSectionEditor
                          initialTitle={section.title}
                          initialContent={section.content}
                          initialType={section.type}
                          onSave={(title, content, type) => handleEditCustomSection(section.id, title, content, type)}
                          onCancel={() => setEditingSectionId(null)}
                        />
                      </div>
                    ) : (
                      <CustomSectionDisplay section={section} />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
