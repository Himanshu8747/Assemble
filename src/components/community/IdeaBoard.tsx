import { useState } from "react";
import { Idea, User } from "../../types";
import { NewIdeaDialog } from "./NewIdeaDialog";
import { IdeaCard } from "./IdeaCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface IdeaBoardProps {
  ideas: Idea[];
}

const currentUser: User = {
  id: "current-user",
  name: "Current User",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  role: "Developer",
  skills: ["React", "TypeScript"],
  contributions: 50,
};

export function IdeaBoard({ ideas: initialIdeas }: IdeaBoardProps) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const user = useSelector((state: RootState) => state.users.currentUser);

  const handleLike = (ideaId: string) => {
    setIdeas(
      ideas.map((idea) => {
        if (idea.id === ideaId) {
          const isLiked = idea.likedBy.includes(currentUser.id);
          return {
            ...idea,
            likes: isLiked ? idea.likes - 1 : idea.likes + 1,
            likedBy: isLiked
              ? idea.likedBy.filter((id) => id !== currentUser.id)
              : [...idea.likedBy, currentUser.id],
          };
        }
        return idea;
      })
    );
  };

  const handleAddComment = (ideaId: string, content: string) => {
    const newComment = {
      id: Date.now().toString(),
      content,
      author: currentUser,
      createdAt: new Date().toISOString(),
    };

    setIdeas(
      ideas.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            comments: [...idea.comments, newComment],
          };
        }
        return idea;
      })
    );
  };

  const handleDeleteComment = (ideaId: string, commentId: string) => {
    setIdeas(
      ideas.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            comments: idea.comments.filter((comment) => comment.id !== commentId),
          };
        }
        return idea;
      })
    );
  };

  const handleNewIdea = (
    newIdea: Omit<Idea, "id" | "likes" | "comments" | "likedBy">
  ) => {
    const idea: Idea = {
      ...newIdea,
      id: Date.now().toString(),
      likes: 0,
      comments: [],
      likedBy: [],
    };
    setIdeas([idea, ...ideas]);
  };

  return (
    <div className="text-2xl font-bold text-gray-900 dark:text-white w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Idea Board</h2>
        <NewIdeaDialog onSubmit={handleNewIdea} currentUser={currentUser} />
      </div>
      <div className={`grid ${user ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
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
    </div>
  );
}

