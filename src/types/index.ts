import { User as FirebaseUser } from 'firebase/auth';

export interface User extends Partial<FirebaseUser> {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
  skills?: string[];
  github?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  email: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

export interface NewIdeaFormData {
  title: string;
  description: string;
}

export interface IdeaBoardProps {
  initialIdeas: Idea[];
  currentUser: User;
}

