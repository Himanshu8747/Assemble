import { useState } from 'react';
import { Idea, User,} from '../../types/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { CommentSection } from './CommentSection';
import { cn } from '@/lib/utils';

interface IdeaCardProps {
  idea: Idea;
  currentUser: User;
  onLike: (ideaId: string) => void;
  onAddComment: (ideaId: string, content: string) => void;
  onDeleteComment: (ideaId: string, commentId: string) => void;
}

export function IdeaCard({
  idea,
  currentUser,
  onLike,
  onAddComment,
  onDeleteComment,
}: IdeaCardProps) {
  const [showComments, setShowComments] = useState(false);
  const isLiked = idea.likedBy.includes(currentUser.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{idea.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">{idea.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={idea.author.avatar} alt={idea.author.name} />
              <AvatarFallback>{idea.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{idea.author.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(idea.id)}
              className={cn(
                "transition-colors duration-200",
                isLiked && "text-black"
              )}
            >
              <ThumbsUp 
                className={cn(
                  "w-4 h-4 mr-1 transition-colors duration-200",
                  isLiked ? "fill-blue-500" : "stroke-current"
                )}
              />
              <span>{idea.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>{idea.comments.length}</span>
            </Button>
          </div>
        </div>

        {showComments && (
          <CommentSection
            comments={idea.comments}
            ideaId={idea.id}
            currentUser={currentUser}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment}
          />
        )}
      </CardContent>
    </Card>
  );
}