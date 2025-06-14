
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Code, Tag } from "lucide-react";
import { Project } from "@/pages/Index";

interface ProjectDashboardProps {
  projects: Project[];
  onViewProject: (projectId: string) => void;
  onCreateProject: () => void;
  onUpdateProject: (project: Project) => void;
}

export const ProjectDashboard = ({ projects, onViewProject, onCreateProject, onUpdateProject }: ProjectDashboardProps) => {
  const activeProjects = projects.filter(p => p.status === "active");
  const completedProjects = projects.filter(p => p.status === "completed");
  const plannedProjects = projects.filter(p => p.status === "planned");

  const updateProjectStatus = (project: Project, newStatus: Project["status"]) => {
    const updatedProject = {
      ...project,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      ...(newStatus === "completed" && { completionDate: new Date().toISOString() })
    };
    onUpdateProject(updatedProject);
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1 bg-white/60 backdrop-blur-sm border-slate-200"
      onClick={() => onViewProject(project.id)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">
            {project.name}
          </h3>
          <div className="flex items-center space-x-2">
            <select
              value={project.status}
              onChange={(e) => {
                e.stopPropagation();
                updateProjectStatus(project, e.target.value as Project["status"]);
              }}
              className="text-xs border border-slate-200 rounded px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <Badge 
              variant={project.status === "active" ? "default" : 
                      project.status === "completed" ? "secondary" : "outline"}
            >
              {project.status}
            </Badge>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm line-clamp-2">
          {project.description}
        </p>
        
        {project.techStack.length > 0 && (
          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4 text-slate-400" />
            <div className="flex flex-wrap gap-1">
              {project.techStack.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.techStack.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.techStack.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {project.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-slate-400" />
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {project.dueDate && (
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Project Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage and track all your projects in one place</p>
        </div>
        <Button onClick={onCreateProject} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Active Projects */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
          Active Projects
          <Badge className="ml-2 bg-green-100 text-green-800">
            {activeProjects.length}
          </Badge>
        </h2>
        {activeProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/40 rounded-lg border-dashed border-2 border-slate-300">
            <p className="text-slate-500">No active projects yet</p>
            <Button 
              variant="outline" 
              onClick={onCreateProject}
              className="mt-2"
            >
              Create your first project
            </Button>
          </div>
        )}
      </section>

      {/* Planned Projects */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
          Planned Projects
          <Badge className="ml-2 bg-blue-100 text-blue-800">
            {plannedProjects.length}
          </Badge>
        </h2>
        {plannedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plannedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/20 rounded-lg">
            <p className="text-slate-500">No planned projects</p>
          </div>
        )}
      </section>

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            Completed Projects
            <Badge className="ml-2 bg-gray-100 text-gray-800">
              {completedProjects.length}
            </Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
