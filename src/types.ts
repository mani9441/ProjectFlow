
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

export type CustomSection = {
  id: string;
  title: string;
  content: string;
  type?: "text" | "link" | "markdown" | "file";
  createdAt: string;
  updatedAt: string;
};

export type CurrentView = "dashboard" | "project" | "new-project" | "issues" | "tasks";
