import { Idea } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare } from 'lucide-react';

interface IdeaBoardProps {
  ideas: Idea[];
}

export function IdeaBoard({ ideas }: IdeaBoardProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Idea Board</h2>
      {ideas.map((idea) => (
        <Card key={idea.id}>
          <CardHeader>
            <CardTitle>{idea.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-2">{idea.description}</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={idea.author.avatar} alt={idea.author.name} />
                  <AvatarFallback>{idea.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{idea.author.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  <span>{idea.likes}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span>{idea.comments}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

