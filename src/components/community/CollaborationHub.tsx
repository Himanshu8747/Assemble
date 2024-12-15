import { ProjectCard } from './ProjectCard';
import { project as projects} from '../../data/dummyData';

export function CollaborationHub() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Collaboration Hub</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

