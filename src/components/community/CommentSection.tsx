import { useState } from 'react';
import { Comment, User } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface CommentSectionProps {
  comments: Comment[];
  ideaId: string;
  currentUser: User;
  onAddComment: (ideaId: string, content: string) => void;
  onDeleteComment: (ideaId: string, commentId: string) => void;
}

export function CommentSection({
  comments,
  ideaId,
  currentUser,
  onAddComment,
  onDeleteComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    onAddComment(ideaId, newComment);
    setNewComment('');
  };

  return (
    <div className="mt-4 space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-3 bg-gray-50 p-3 rounded">
          <Avatar>
            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              {comment.author.id === currentUser.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteComment(ideaId, comment.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
            <p className="text-sm mt-1">{comment.content}</p>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button onClick={handleSubmit}>Comment</Button>
      </div>
    </div>
  );
}