export interface User {
  id: string;
  email?: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  contributions?: number;
  team?: string;
  status?: string; 
  github?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  stars: number;
  progress: number;
  githubUrl: string;
  collaborators: string[];
  recentActivity: string[];
  upcomingMilestones: string[];
}

export interface ProjectsState {
  projects: Project[];
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
export interface FileAttachment {
  name: string;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  content: string;
  user: User;
  timestamp: string;
  files?: FileAttachment[];
}

export interface ChatUser extends User {
  isOnline?: boolean;
  lastSeen?: string;
  isConnected?: boolean;
}

export interface EnhancedMessage extends Message {
  recipientId?: string;
  isPrivate?: boolean;
  reactions?: { [key: string]: string[] };
}

