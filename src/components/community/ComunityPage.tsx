import { FeaturedDevelopers } from './FeaturedDevelopers';
import { CollaborationHub } from './CollaborationHub';
import { IdeaBoard } from './IdeaBoard';
import { LiveChat } from './LiveChat';
import { ideas } from '../../data/dummyData';

export function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-4xl font-bold">Developer Community</h1>
      
      <FeaturedDevelopers />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <CollaborationHub />
          <IdeaBoard ideas={ideas} />
        </div>
        <div>
          <LiveChat />
        </div>
      </div>
    </div>
  );
}

