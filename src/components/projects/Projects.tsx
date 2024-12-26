import { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { projects } from '../../data/dummyData';
import { Input } from "./../ui/input";
import { Label } from "./../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select";

export function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [techFilter, setTechFilter] = useState('all');

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (techFilter === 'all' || project.tech.includes(techFilter))
  );

  const allTechnologies = Array.from(new Set(projects.flatMap(project => project.tech)));

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Projects</h2>
        <p className="text-gray-600 dark:text-gray-300">Explore and collaborate on innovative projects from our community.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Search Projects</Label>
          <Input
            id="search"
            placeholder="Search by project name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-64">
          <Label htmlFor="tech-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Filter by Technology</Label>
          <Select value={techFilter} onValueChange={setTechFilter}>
            <SelectTrigger id="tech-filter">
              <SelectValue placeholder="All Technologies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technologies</SelectItem>
              {allTechnologies.map(tech => (
                <SelectItem key={tech} value={tech}>{tech}</SelectItem>
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

