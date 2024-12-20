import { Project } from '../../types/index';
import { Star, Users, GitFork, Copy, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClone = () => {
    navigator.clipboard.writeText(`git clone ${project.githubUrl}`);
  };

  const handleFork = () => {
    window.open(`${project.githubUrl}/fork`, '_blank');
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">{project.title}</CardTitle>
          <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900 rounded-full px-3 py-1">
          <Button variant="link" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              View on GitHub
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">{project.stars}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{project.description}</p>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Badge key={tech} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {project.collaborators.length + 1} contributors
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{project.progress}%</span>
            <Progress value={project.progress} className="w-24" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex -space-x-2 overflow-hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="border-2 border-white dark:border-gray-800 w-8 h-8">
                    <AvatarImage src={project.owner.avatar} alt={project.owner.name} />
                    <AvatarFallback>{project.owner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{project.owner.name} (Owner)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {project.collaborators.map((collaborator) => (
              <TooltipProvider key={collaborator.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="border-2 border-white dark:border-gray-800 w-8 h-8">
                      <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                      <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{collaborator.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleClone} className="bg-white dark:bg-gray-800">
              <Copy className="w-4 h-4 mr-2" />
              Clone
            </Button>
            <Button variant="outline" size="sm" onClick={handleFork} className="bg-white dark:bg-gray-800">
              <GitFork className="w-4 h-4 mr-2" />
              Fork
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div>
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Recent Activity</h4>
              <ul className="space-y-2 list-disc list-inside">
                {project.recentActivity.map((activity, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Upcoming Milestones</h4>
              <ul className="space-y-2 list-disc list-inside">
                {project.upcomingMilestones.map((milestone, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    {milestone}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Show More
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

