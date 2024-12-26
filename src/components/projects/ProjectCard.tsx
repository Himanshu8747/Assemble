import React from "react";
import { Link } from "react-router-dom";
import { Project, User } from "../../types";
import { Star, Users, GitFork, Copy, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./../ui/avatar";
import { Button } from "./../ui/button";
import { Progress } from "./../ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./../ui/tooltip";
import { Badge } from "./../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./../ui/card";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_AVATAR = "/placeholder.svg";

interface ProjectCardProps {
  project: Project;
}

const UserAvatar: React.FC<{ user: User | undefined }> = ({ user }) => {
  if (!user) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Avatar className="border-2 border-white dark:border-gray-800 w-8 h-8">
            <AvatarImage src={user.avatar || DEFAULT_AVATAR} alt={user.name} />
            <AvatarFallback>
              {user.name ? user.name.charAt(0) : <UserCircle />}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{user.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { toast } = useToast();

  const handleClone = () => {
    if (project.githubUrl) {
      navigator.clipboard.writeText(`git clone ${project.githubUrl}`);
      toast({
        title: "Repository URL Copied!",
        description: `The clone URL for ${project.title} has been copied to your clipboard.`,
      });
    } else {
      toast({
        title: "Unable to Clone",
        description: "This project does not have a GitHub URL.",
        variant: "destructive",
      });
    }
  };

  const handleFork = () => {
    if (project.githubUrl) {
      window.open(`${project.githubUrl}/fork`, "_blank");
    } else {
      toast({
        title: "Unable to Fork",
        description: "This project does not have a GitHub URL.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            {project.title}
          </CardTitle>
          <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900 rounded-full px-3 py-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
              {project.stars}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {project.description}
        </p>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div className="flex flex-wrap gap-2">
          {project.tech &&
            project.tech.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tech}
              </Badge>
            ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {(project.collaborators?.length || 0) + 1}{" "}
              {((project.collaborators?.length || 0) +1) === 1
                ? "contributor"
                : "contributors"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {project.progress}%
            </span>
            <Progress value={project.progress} className="w-24" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex -space-x-2 overflow-hidden">
            <UserAvatar user={project.owner} />
            {project.collaborators &&
              project.collaborators.map((collaborator) => (
                <UserAvatar key={collaborator.id} user={collaborator} />
              ))}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClone}
              className="bg-white dark:bg-gray-800"
            >
              <Copy className="w-4 h-4 mr-2" />
              Clone
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFork}
              className="bg-white dark:bg-gray-800"
            >
              <GitFork className="w-4 h-4 mr-2" />
              Fork
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          asChild
        >
          <Link to={`/projects/${project.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
