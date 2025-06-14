import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Code, Tag, Plus, Edit2, Trash2 } from "lucide-react";
import type { Project, Issue, Task } from "@/types";
import { CustomSectionEditor } from "@/components/common/CustomSectionEditor";
import { CustomSectionDisplay } from "@/components/common/CustomSectionDisplay";
import { ProjectIssueBoard } from "@/components/project/ProjectIssueBoard";
import { ProjectTaskBoard } from "@/components/project/ProjectTaskBoard";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

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
  onDeleteProject?: (projectId: string) => void;
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
  onBack,
  onDeleteProject,
}: ProjectDetailViewProps) => {
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state for editing
  const [editName, setEditName] = useState(project.name);
  const [editDescription, setEditDescription] = useState(project.description);
  const [editStatus, setEditStatus] = useState<Project["status"]>(project.status);
  const [editDueDate, setEditDueDate] = useState(project.dueDate || "");
  const [editTags, setEditTags] = useState(project.tags.join(", "));
  const [editTechStack, setEditTechStack] = useState(project.techStack.join(", "));

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

  const handleEditCustomSection = (
    sectionId: string,
    title: string,
    content: string,
    type?: string
  ) => {
    const updatedProject = {
      ...project,
      customSections: project.customSections.map((section) =>
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
      customSections: project.customSections.filter((section) => section.id !== sectionId),
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
  };

  const handleEditSave = () => {
    const updatedProject: Project = {
      ...project,
      name: editName,
      description: editDescription,
      status: editStatus,
      dueDate: editDueDate ? editDueDate : undefined,
      techStack: editTechStack.split(",").map((s) => s.trim()).filter(Boolean),
      tags: editTags.split(",").map((s) => s.trim()).filter(Boolean),
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updatedProject);
    setEditDialogOpen(false);
    toast({
      title: "Project updated",
      description: "Project details have been updated.",
    });
  };

  const handleDelete = () => {
    if (onDeleteProject) {
      onDeleteProject(project.id); // ensure this is called!
    } else {
      onBack();
    }
    setDeleteDialogOpen(false);
    toast({
      title: "Project deleted",
      description: "Project has been deleted and you have been returned to the dashboard.",
    });
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
          <Card className="bg-white/800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">Project Overview</CardTitle>
                <div className="flex gap-2">
                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditDialogOpen(true);
                          setEditName(project.name);
                          setEditDescription(project.description);
                          setEditStatus(project.status);
                          setEditDueDate(project.dueDate || "");
                          setEditTags(project.tags.join(", "));
                          setEditTechStack(project.techStack.join(", "));
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                      </DialogHeader>
                      <form
                        className="space-y-4"
                        onSubmit={e => {
                          e.preventDefault();
                          handleEditSave();
                        }}
                      >
                        <div>
                          <label className="block text-sm mb-1 font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            className="w-full border px-2 py-1 rounded"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1 font-medium text-gray-700">Description</label>
                          <textarea
                            className="w-full border px-2 py-1 rounded"
                            value={editDescription}
                            onChange={e => setEditDescription(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1 font-medium text-gray-700">Status</label>
                          <select
                            className="w-full border px-2 py-1 rounded"
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value as Project["status"])}
                          >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="planned">Planned</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1 font-medium text-gray-700">Due Date</label>
                          <input
                            type="date"
                            className="w-full border px-2 py-1 rounded"
                            value={editDueDate}
                            onChange={e => setEditDueDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1 font-medium text-gray-700">Tags (comma separated)</label>
                          <input
                            type="text"
                            className="w-full border px-2 py-1 rounded"
                            value={editTags}
                            onChange={e => setEditTags(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1 font-medium text-gray-700">Tech Stack (comma separated)</label>
                          <input
                            type="text"
                            className="w-full border px-2 py-1 rounded"
                            value={editTechStack}
                            onChange={e => setEditTechStack(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                          >Save</Button>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-2"
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Are you sure you want to delete this project?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            variant="destructive"
                            onClick={handleDelete}
                          >
                            Delete
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
                          onSave={(title, content, type) =>
                            handleEditCustomSection(section.id, title, content, type)
                          }
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
