import { FeaturedDevelopers } from './FeaturedDevelopers';
import { IdeaBoard } from './IdeaBoard';
import { ideas } from '../../data/dummyData';

export function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12 max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Developer Community
        </h1>
        
        <FeaturedDevelopers />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className='lg:col-span-3'>
            <IdeaBoard ideas={ideas} />
          </div>
        </div>
      </div>
    </div>
  );
}

