import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Project, Task, Issue } from "@/types";

const mapProject = (p: any): Project => ({
  id: p.id,
  name: p.name,
  description: p.description ?? "",
  status: p.status,
  dueDate: p.due_date ?? undefined,
  completionDate: p.completion_date ?? undefined,
  techStack: p.tech_stack ?? [],
  tags: p.tags ?? [],
  customSections: [],
  createdAt: p.created_at,
  updatedAt: p.updated_at,
});
const mapTask = (t: any): Task => ({
  id: t.id,
  projectId: t.project_id,
  title: t.title,
  description: t.description ?? "",
  status: t.status,
  dueDate: t.due_date ?? undefined,
  customSections: [],
  createdAt: t.created_at,
  updatedAt: t.updated_at,
});
const mapIssue = (i: any): Issue => ({
  id: i.id,
  projectId: i.project_id,
  title: i.title,
  description: i.description ?? "",
  status: i.status,
  labels: i.labels ?? [],
  customSections: [],
  createdAt: i.created_at,
  updatedAt: i.updated_at,
});

const fetchProjects = async () => {
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(mapProject);
};

const fetchTasks = async () => {
  const { data, error } = await supabase.from("tasks").select("*");
  if (error) throw error;
  return data.map(mapTask);
};

const fetchIssues = async () => {
  const { data, error } = await supabase.from("issues").select("*");
  if (error) throw error;
  return data.map(mapIssue);
};

export function useProjectData() {
  const queryClient = useQueryClient();

  // Queries
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  const { data: issues = [], isLoading: issuesLoading, error: issuesError } = useQuery({
    queryKey: ["issues"],
    queryFn: fetchIssues,
  });
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Mutations (Projects)
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "customSections">) => {
      console.log("Attempting to create project with data:", projectData);
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: projectData.name,
            description: projectData.description,
            status: projectData.status,
            due_date: projectData.dueDate ?? null,
            completion_date: projectData.completionDate ?? null,
            tech_stack: projectData.techStack,
            tags: projectData.tags,
          },
        ])
        .select("*")
        .single();
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      console.log("Insert Success. Supabase returned:", data);
      return mapProject(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject: Project) => {
      const { error } = await supabase
        .from("projects")
        .update({
          name: updatedProject.name,
          description: updatedProject.description,
          status: updatedProject.status,
          due_date: updatedProject.dueDate ?? null,
          completion_date: updatedProject.completionDate ?? null,
          tech_stack: updatedProject.techStack,
          tags: updatedProject.tags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedProject.id);
      if (error) throw error;
      return updatedProject;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  // Mutations (Issues)
  const createIssueMutation = useMutation({
    mutationFn: async (issueData: Omit<Issue, "id" | "createdAt" | "updatedAt">) => {
      const { data, error } = await supabase
        .from("issues")
        .insert([
          {
            project_id: issueData.projectId,
            title: issueData.title,
            description: issueData.description,
            status: issueData.status,
            labels: issueData.labels,
          },
        ])
        .select("*")
        .single();
      if (error) throw error;
      return mapIssue(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["issues"] }),
  });

  const updateIssueMutation = useMutation({
    mutationFn: async (updatedIssue: Issue) => {
      const { error } = await supabase
        .from("issues")
        .update({
          title: updatedIssue.title,
          description: updatedIssue.description,
          status: updatedIssue.status,
          labels: updatedIssue.labels,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedIssue.id);
      if (error) throw error;
      return updatedIssue;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["issues"] }),
  });

  // Mutations (Tasks)
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            project_id: taskData.projectId,
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            due_date: taskData.dueDate ?? null,
          },
        ])
        .select("*")
        .single();
      if (error) throw error;
      return mapTask(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: Task) => {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          due_date: updatedTask.dueDate ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedTask.id);
      if (error) throw error;
      return updatedTask;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Mutations (Delete Project, Issue, Task)
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", projectId);
      if (error) throw error;
      return projectId;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
  const deleteIssueMutation = useMutation({
    mutationFn: async (issueId: string) => {
      const { error } = await supabase.from("issues").delete().eq("id", issueId);
      if (error) throw error;
      return issueId;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["issues"] }),
  });
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) throw error;
      return taskId;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Retry error reload
  const retryAll = () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["issues"] });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }

  return {
    projects, issues, tasks,
    projectsLoading, issuesLoading, tasksLoading,
    projectsError, issuesError, tasksError,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    createIssue: createIssueMutation.mutate,
    updateIssue: updateIssueMutation.mutate,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    deleteIssue: deleteIssueMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    retryAll
  };
}
