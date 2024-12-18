import { useState } from 'react';
import { Idea, User } from '../../types';
import { NewIdeaDialog } from './NewIdeaDialog';
import { IdeaCard } from './IdeaCard';

interface IdeaBoardProps {
  ideas: Idea[];
}

// Simulating current user - In a real app, this would come from auth context
const currentUser: User = {
  id: 'current-user',
  name: 'Current User',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  role: 'Developer',
  skills: ['React', 'TypeScript'],
  contributions: 50
};

export function IdeaBoard({ ideas: initialIdeas }: IdeaBoardProps) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);

  const handleLike = (ideaId: string) => {
    setIdeas(ideas.map(idea => {
      if (idea.id === ideaId) {
        const isLiked = idea.likedBy.includes(currentUser.id);
        return {
          ...idea,
          likes: isLiked ? idea.likes - 1 : idea.likes + 1,
          likedBy: isLiked
            ? idea.likedBy.filter(id => id !== currentUser.id)
            : [...idea.likedBy, currentUser.id]
        };
      }
      return idea;
    }));
  };

  const handleAddComment = (ideaId: string, content: string) => {
    const newComment = {
      id: Date.now().toString(),
      content,
      author: currentUser,
      createdAt: new Date().toISOString()
    };

    setIdeas(ideas.map(idea => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          comments: [...idea.comments, newComment]
        };
      }
      return idea;
    }));
  };

  const handleDeleteComment = (ideaId: string, commentId: string) => {
    setIdeas(ideas.map(idea => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          comments: idea.comments.filter(comment => comment.id !== commentId)
        };
      }
      return idea;
    }));
  };

  const handleNewIdea = (newIdea: Omit<Idea, 'id' | 'likes' | 'comments' | 'likedBy'>) => {
    const idea: Idea = {
      ...newIdea,
      id: Date.now().toString(),
      likes: 0,
      comments: [],
      likedBy: []
    };
    setIdeas([idea, ...ideas]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Idea Board</h2>
        <NewIdeaDialog onSubmit={handleNewIdea} currentUser={currentUser} />
      </div>
      
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          currentUser={currentUser}
          onLike={handleLike}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      ))}
    </div>
  );
}