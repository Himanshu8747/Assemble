import { useParams } from 'react-router-dom';
import { projects } from '../../data/dummyData';
import { Star, Users, GitFork, Copy, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "./../ui/avatar";
import { Button } from "./../ui/button";
import { Progress } from "./../ui/progress";
import { Badge } from "./../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./../ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return <div className="text-center py-10">Project not found</div>;
  }

  const handleClone = () => {
    navigator.clipboard.writeText(`git clone ${project.githubUrl}`);
    toast({
      title: "Repository URL Copied!",
      description: `The clone URL for ${project.title} has been copied to your clipboard.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden border-none">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">{project.title}</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900 rounded-full px-3 py-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">{project.stars}</span>
              </div>
              <Button variant="outline" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  View on GitHub
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">{project.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                  {project.collaborators.length + 1} contributors
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-base font-medium text-gray-600 dark:text-gray-300">Progress: {project.progress}%</span>
                <Progress value={project.progress} className="w-48" />
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Team</h3>
                <div className="flex flex-wrap gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center space-y-1">
                          <Avatar className="w-12 h-12 border-2 border-primary">
                            <AvatarImage src={project.owner.avatar} alt={project.owner.name} />
                            <AvatarFallback>{project.owner.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Owner</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{project.owner.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {project.collaborators.map((collaborator) => (
                    <TooltipProvider key={collaborator.id}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex flex-col items-center space-y-1">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                              <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Collaborator</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{collaborator.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={handleClone} className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Clone Repository
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`${project.githubUrl}/fork`} target="_blank" rel="noopener noreferrer">
                    <GitFork className="w-4 h-4 mr-2" />
                    Fork Repository
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Recent Activity</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {project.recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                      <span className="text-gray-600 dark:text-gray-300">{activity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Upcoming Milestones</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {project.upcomingMilestones.map((milestone, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">{milestone}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

