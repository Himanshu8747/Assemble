export interface User {
    id: string;
    name: string;
    avatar: string;
    role: string;
    skills: string[];
    github: string;
  }
  
  export interface ProjectsComp {
    id: string;
    name: string;
    description: string;
    tags: string[];
    collaborators: User[];
    stars: number;
    forks: number;
    githubUrl: string;
    cloneUrl: string;
    lastUpdated: Date;
  }
  
  export interface Project {
    id: string;
    name: string;
    description: string;
    tags: string[];
    collaborators: User[];
    stars: number;
  }
  
  export interface ChatMessage {
    id: string;
    userId: string;
    content: string;
    timestamp: Date;
  }
  
  export interface Idea {
    id: string;
    title: string;
    description: string;
    author: User;
    likes: number;
    comments: number;
  }
  
  