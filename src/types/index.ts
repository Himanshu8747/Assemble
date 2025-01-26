/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from "socket.io-client";

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
export interface User {
  id: string
  email?: string
  name: string
  avatar: string
  role: string
  skills: string[]
  contributions?: number
  team?: string
  status?: string
  github?: string
}

export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  stars: number
  progress: number
  githubUrl: string
  collaborators: string[]
  recentActivity: string[]
  upcomingMilestones: string[]
}

export interface ProjectsState {
  projects: Project[]
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
}

export interface Idea {
  id: string
  title: string
  description: string
  author: User
  likes: number
  comments: Comment[]
  tags: string[]
  likedBy: string[]
}

export interface FileAttachment {
  name: string
  type: string
  url: string
}

export interface ChatUser extends User {
  skills: string[]
  contributions: number
  isOnline: boolean
  lastSeen?: string
  status: string
  projects: string[]
}

export interface EnhancedMessage extends Message {
  recipientId?: string
  isPrivate?: boolean
  reactions?: { [key: string]: string[] }
}

export interface Channel {
  id: string
  name: string
  ownerId: string
}

export interface Chat {
  id: string
  type: "channel" | "direct"
  name: string
  lastMessage?: Message
}


export interface Message {
  id: string
  content: string
  user: ChatUser
  timestamp: string
  files?: FileAttachment[]
  channelId?: string
  recipientId?: string
}

export interface ChatUser extends User {
  skills: string[]
  contributions: number
  isOnline: boolean
  lastSeen?: string
  status: string
  projects: string[] // Add this line
}

export interface EnhancedMessage extends Message {
  recipientId?: string;
  isPrivate?: boolean;
  reactions?: { [key: string]: string[] };
}

export interface Channel {
  id: string
  name: string
  ownerId: string
}

export interface FileAttachment {
  name: string
  type: string
  url: string
}

export interface Chat {
  id: string
  type: "channel" | "direct"
  name: string
  lastMessage?: Message
}

export interface WebRTCSignal {
  type: "offer" | "answer" | "ice-candidate"
  sender: string
  recipient: string
  payload: any
}

export interface CallData {
  type: "voice" | "video"
  callerId: string
}

export interface VideoCallProps {
  partner: ChatUser;
  onEndCall: () => void;
  socket: Socket | null;
}