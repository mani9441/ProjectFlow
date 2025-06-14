import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Bug, AlertCircle, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import type { Project, Issue } from "@/types";
import { NewIssueDialog } from "./NewIssueDialog";
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

interface IssueBoardProps {
  projects: Project[];
  issues: Issue[];
  onCreateIssue: (issue: Omit<Issue, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateIssue: (issue: Issue) => void;
  onDeleteIssue?: (issueId: string) => void;
}

export const IssueBoard = ({
  projects,
  issues,
  onCreateIssue,
  onUpdateIssue,
  onDeleteIssue,
}: IssueBoardProps) => {
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const [deleteDialogOpenId, setDeleteDialogOpenId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "in-progress":
        return <Bug className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "closed":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const updateIssueStatus = (issue: Issue, newStatus: Issue["status"]) => {
    onUpdateIssue({
      ...issue,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const openIssues = issues.filter(issue => issue.status === "open");
  const inProgressIssues = issues.filter(issue => issue.status === "in-progress");
  const closedIssues = issues.filter(issue => issue.status === "resolved" || issue.status === "closed");

  const IssueCard = ({ issue }: { issue: Issue }) => {
    const project = projects.find(p => p.id === issue.projectId);
    return (
      <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium text-slate-800 line-clamp-2">
              {issue.title}
            </h3>
            <div className="flex items-center space-x-1">
              {getStatusIcon(issue.status)}
              <select
                value={issue.status}
                onChange={(e) => updateIssueStatus(issue, e.target.value as Issue["status"])}
                className="text-xs border-none bg-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <AlertDialog open={deleteDialogOpenId === issue.id} onOpenChange={open => setDeleteDialogOpenId(open ? issue.id : null)}>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 ml-2" onClick={e => { e.stopPropagation(); setDeleteDialogOpenId(issue.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Issue</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this issue? This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline" onClick={() => setDeleteDialogOpenId(null)}>Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (onDeleteIssue) {
                            onDeleteIssue(issue.id);
                            toast({ title: "Issue deleted" });
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
            {issue.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {issue.labels.slice(0, 2).map(label => (
                <Badge key={label} variant="outline" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-slate-500">
              {project?.name}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Issue Tracker</h1>
          <p className="text-slate-600 mt-2">Track and manage issues across all projects</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewIssueDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Issue
        </Button>
      </div>

      {/* Project-specific sections */}
      {projects.map(project => {
        const projectIssues = issues.filter(issue => issue.projectId === project.id);
        const projectOpenIssues = projectIssues.filter(issue => issue.status === "open");
        const projectInProgressIssues = projectIssues.filter(issue => issue.status === "in-progress");
        const projectClosedIssues = projectIssues.filter(issue => issue.status === "resolved" || issue.status === "closed");

        if (projectIssues.length === 0) return null;

        return (
          <div key={project.id} className="space-y-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-slate-800">{project.name}</h2>
              <Badge variant="outline">{projectIssues.length} issues</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Open Issues */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span>Open</span>
                    <Badge className="bg-red-100 text-red-800">{projectOpenIssues.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projectOpenIssues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                  {projectOpenIssues.length === 0 && (
                    <div className="text-center py-4 text-slate-500">
                      <p className="text-sm">No open issues</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* In Progress Issues */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bug className="h-5 w-5 text-yellow-500" />
                    <span>In Progress</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{projectInProgressIssues.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projectInProgressIssues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                  {projectInProgressIssues.length === 0 && (
                    <div className="text-center py-4 text-slate-500">
                      <p className="text-sm">No issues in progress</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Closed Issues */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Closed</span>
                    <Badge className="bg-green-100 text-green-800">{projectClosedIssues.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projectClosedIssues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                  {projectClosedIssues.length === 0 && (
                    <div className="text-center py-4 text-slate-500">
                      <p className="text-sm">No closed issues</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}

      <NewIssueDialog
        open={showNewIssueDialog}
        onOpenChange={setShowNewIssueDialog}
        projects={projects}
        onCreateIssue={onCreateIssue}
      />
    </div>
  );
};
