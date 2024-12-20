export interface User {
  id: string;
  email?: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  contributions: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  owner: User;
  collaborators: User[];
  stars: number;
  progress: number;
  githubUrl: string;
  recentActivity: string[];
  upcomingMilestones: string[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  author: User;
  likes: number;
  comments: Comment[];
  tags: string[];
  likedBy: string[];
}

export interface Message {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}