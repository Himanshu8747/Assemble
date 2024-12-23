import { FeaturedDevelopers } from './FeaturedDevelopers';
import { IdeaBoard } from './IdeaBoard';
import { LiveChat } from './LiveChat';
import { ideas } from '../../data/dummyData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function CommunityPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12 max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Developer Community
        </h1>
        
        <FeaturedDevelopers />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`${user ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <IdeaBoard ideas={ideas} />
          </div>
          {user && (
            <div className="w-full">
              <LiveChat />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

