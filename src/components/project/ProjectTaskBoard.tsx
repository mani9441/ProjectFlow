
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Play, CheckCircle2, Calendar } from "lucide-react";
import { Project, Task } from "@/pages/Index";
import { NewTaskDialog } from "@/components/tasks/NewTaskDialog";

interface ProjectTaskBoardProps {
  project: Project;
  tasks: Task[];
  onCreateTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateTask: (task: Task) => void;
}

export const ProjectTaskBoard = ({ project, tasks, onCreateTask, onUpdateTask }: ProjectTaskBoardProps) => {
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);

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

  const todoTasks = tasks.filter(task => task.status === "todo");
  const inProgressTasks = tasks.filter(task => task.status === "in-progress");
  const doneTasks = tasks.filter(task => task.status === "done");

  const TaskCard = ({ task }: { task: Task }) => {
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
            </div>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2">
            {task.description}
          </p>
          {task.dueDate && (
            <div className={`flex items-center space-x-1 text-xs ${
              isOverdue ? "text-red-600" : "text-slate-500"
            }`}>
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
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
          <h2 className="text-2xl font-bold text-slate-800">Tasks for {project.name}</h2>
          <p className="text-slate-600 mt-1">Manage tasks for this project</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewTaskDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
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

      <NewTaskDialog
        open={showNewTaskDialog}
        onOpenChange={setShowNewTaskDialog}
        projects={[project]}
        onCreateTask={onCreateTask}
      />
    </div>
  );
};
