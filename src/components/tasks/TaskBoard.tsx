import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Play, CheckCircle2, Calendar, Trash2 } from "lucide-react";
import type { Project, Task } from "@/types";
import { NewTaskDialog } from "./NewTaskDialog";
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
import { toast } from "@/hooks/use-toast";

interface TaskBoardProps {
  projects: Project[];
  tasks: Task[];
  onCreateTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskBoard = ({ projects, tasks, onCreateTask, onUpdateTask, onDeleteTask }: TaskBoardProps) => {
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [deleteDialogOpenId, setDeleteDialogOpenId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Clock className="h-4 w-4 text-slate-500" />;
      case "in-progress":
        return <Play className="h-4 w-4 text-blue-500" />;
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const updateTaskStatus = (task: Task, newStatus: Task["status"]) => {
    onUpdateTask({
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const project = projects.find(p => p.id === task.projectId);
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";
    
    return (
      <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium text-slate-800 line-clamp-2">
              {task.title}
            </h3>
            <div className="flex items-center space-x-1">
              {getStatusIcon(task.status)}
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task, e.target.value as Task["status"])}
                className="text-xs border-none bg-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <AlertDialog open={deleteDialogOpenId === task.id} onOpenChange={open => setDeleteDialogOpenId(open ? task.id : null)}>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 ml-2" onClick={e => { e.stopPropagation(); setDeleteDialogOpenId(task.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this task? This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline" onClick={() => setDeleteDialogOpenId(null)}>
                        Cancel
                      </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (onDeleteTask) {
                            onDeleteTask(task.id); // Connect to actual delete
                            toast({ title: "Task deleted" });
                          }
                          setDeleteDialogOpenId(null);
                        }}
                      >
                        Delete
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2">
            {task.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {project?.name}
            </span>
            {task.dueDate && (
              <div className={`flex items-center space-x-1 text-xs ${
                isOverdue ? "text-red-600" : "text-slate-500"
              }`}>
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs">
              Overdue
            </Badge>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Task Board</h1>
          <p className="text-slate-600 mt-2">Organize and track tasks across all projects</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewTaskDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Project-specific sections */}
      {projects.map(project => {
        const projectTasks = tasks.filter(task => task.projectId === project.id);
        const todoTasks = projectTasks.filter(task => task.status === "todo");
        const inProgressTasks = projectTasks.filter(task => task.status === "in-progress");
        const doneTasks = projectTasks.filter(task => task.status === "done");

        if (projectTasks.length === 0) return null;

        return (
          <div key={project.id} className="space-y-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-slate-800">{project.name}</h2>
              <Badge variant="outline">{projectTasks.length} tasks</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* To Do */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-slate-500" />
                    <span>To Do</span>
                    <Badge className="bg-slate-100 text-slate-800">{todoTasks.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todoTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {todoTasks.length === 0 && (
                    <div className="text-center py-4 text-slate-500">
                      <p className="text-sm">No tasks to do</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* In Progress */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="h-5 w-5 text-blue-500" />
                    <span>In Progress</span>
                    <Badge className="bg-blue-100 text-blue-800">{inProgressTasks.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {inProgressTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {inProgressTasks.length === 0 && (
                    <div className="text-center py-4 text-slate-500">
                      <p className="text-sm">No tasks in progress</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Done */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Done</span>
                    <Badge className="bg-green-100 text-green-800">{doneTasks.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {doneTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {doneTasks.length === 0 && (
                    <div className="text-center py-4 text-slate-500">
                      <p className="text-sm">No completed tasks</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}

      <NewTaskDialog
        open={showNewTaskDialog}
        onOpenChange={setShowNewTaskDialog}
        projects={projects}
        onCreateTask={onCreateTask}
      />
    </div>
  );
};
