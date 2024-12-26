import React, { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { projects as initialProjects } from "../../data/dummyData";
import { Input } from "./../ui/input";
import { Label } from "./../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select";
import { Button } from "./../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./../ui/textarea";
import { Project } from "../../types";
import { PlusCircle } from "lucide-react";

export function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [techFilter, setTechFilter] = useState("all");
  const [projects, setProjects] = useState(initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    tech: [],
    stars: 0,
    progress: 0,
    githubUrl: "",
  });

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (techFilter === "all" || project.tech.includes(techFilter))
  );

  const allTechnologies = Array.from(new Set(projects.flatMap((project) => project.tech)));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (value: string) => {
    setNewProject((prev) => ({ ...prev, tech: value.split(",").map((t) => t.trim()) }));
  };

  const fetchGitHubActivity = async (repoUrl: string): Promise<string[]> => {
    try {
      const [, owner, repo] = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/) || [];
      if (!owner || !repo) throw new Error("Invalid GitHub URL");

      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`);
      if (!response.ok) throw new Error("Failed to fetch GitHub data");

      const data = await response.json();
      return data.slice(0, 5).map((commit: any) => commit.commit.message); 
    } catch (error) {
      console.error(error);
      return ["Could not fetch activity"];
    }
  };

  const handleAddProject = async () => {
    const { githubUrl } = newProject;

    let recentActivity: string[] = [];
    if (githubUrl) {
      recentActivity = await fetchGitHubActivity(githubUrl);
    }

    const projectToAdd: Project = {
      ...newProject as Project,
      id: Date.now().toString(),
      collaborators: [],
      recentActivity,
      upcomingMilestones: [],
    };

    setProjects((prev) => [...prev, projectToAdd]);
    console.log("Updated Projects:", [...projects, projectToAdd]);
    setIsDialogOpen(false);
    setNewProject({
      title: "",
      description: "",
      tech: [],
      stars: 0,
      progress: 0,
      githubUrl: "",
    });

    toast({
      title: "Project Added Successfully!",
      description: `${projectToAdd.title} has been added to your projects.`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Projects</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Explore and collaborate on innovative projects from our community.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={newProject.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tech" className="text-right">
                  Technologies
                </Label>
                <Input
                  id="tech"
                  name="tech"
                  value={newProject.tech?.join(", ")}
                  onChange={(e) => handleTechChange(e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="githubUrl" className="text-right">
                  GitHub URL
                </Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  value={newProject.githubUrl}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="progress" className="text-right">
                  Progress
                </Label>
                <Input
                  id="progress"
                  name="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={newProject.progress}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddProject}>Add Project</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label
            htmlFor="search"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
          >
            Search Projects
          </Label>
          <Input
            id="search"
            placeholder="Search by project name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-64">
          <Label
            htmlFor="tech-filter"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
          >
            Filter by Technology
          </Label>
          <Select value={techFilter} onValueChange={setTechFilter}>
            <SelectTrigger id="tech-filter">
              <SelectValue placeholder="All Technologies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technologies</SelectItem>
              {allTechnologies.map((tech) => (
                <SelectItem key={tech} value={tech}>
                  {tech}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
