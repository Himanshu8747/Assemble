import { User, ProjectsComp as ProjectsComponent, Project, ChatMessage, Idea } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Alice',
    role: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'TypeScript'],
    github: 'https://github.com/alicejohnson',
    email: "abc@alicejohnson.com"
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Bob',
    role: 'UX Designer',
    skills: ['Figma', 'Sketch', 'User Research'],
    github: 'https://github.com/bobsmith',
    email: "def@bobsmith.com"
  },
  {
    id: '3',
    name: 'Charlie Brown',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Charlie',
    role: 'DevOps Engineer',
    skills: ['Docker', 'Kubernetes', 'CI/CD'],
    github: 'https://github.com/charliebrown',
    email: "ghi@charliebrown.com"
  },
];

export const project: Project[] = [
  {
    id: '1',
    name: 'Real-time Code Collaboration Tool',
    description: 'A web-based IDE that allows multiple developers to code together in real-time.',
    tags: ['React', 'WebSockets', 'Monaco Editor'],
    collaborators: [users[0], users[2]],
    stars: 128,
  },
  {
    id: '2',
    name: 'AI-powered Code Review Assistant',
    description: 'An AI tool that helps developers improve their code quality through automated reviews.',
    tags: ['Python', 'Machine Learning', 'Natural Language Processing'],
    collaborators: [users[1], users[2]],
    stars: 89,
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    content: 'Hey everyone! I just pushed a new update to our project. Can someone review it?',
    timestamp: new Date('2023-05-10T10:30:00'),
  },
  {
    id: '2',
    userId: '2',
    content: 'Sure, I can take a look. Which branch should I check?',
    timestamp: new Date('2023-05-10T10:32:00'),
  },
  {
    id: '3',
    userId: '3',
    content: 'Im working on optimizing our Docker containers. Any suggestions for reducing image size?',
    timestamp: new Date('2023-05-10T10:35:00'),
  },
];

export const projects: ProjectsComponent[] = [
  {
    id: '1',
    name: 'Real-time Code Collaboration Tool',
    description: 'A web-based IDE that allows multiple developers to code together in real-time.',
    tags: ['React', 'WebSockets', 'Monaco Editor'],
    collaborators: [users[0], users[2]],
    stars: 128,
    forks: 34,
    githubUrl: 'https://github.com/example/real-time-code-collab',
    cloneUrl: 'https://github.com/example/real-time-code-collab.git',
    lastUpdated: new Date('2023-12-10T14:30:00'),
  },
  {
    id: '2',
    name: 'AI-powered Code Review Assistant',
    description: 'An AI tool that helps developers improve their code quality through automated reviews.',
    tags: ['Python', 'Machine Learning', 'Natural Language Processing'],
    collaborators: [users[1], users[2]],
    stars: 89,
    forks: 12,
    githubUrl: 'https://github.com/example/ai-code-review',
    cloneUrl: 'https://github.com/example/ai-code-review.git',
    lastUpdated: new Date('2023-12-12T09:15:00'),
  },
  {
    id: '3',
    name: 'Blockchain-based Version Control',
    description: 'A decentralized version control system built on blockchain technology.',
    tags: ['Blockchain', 'Go', 'Distributed Systems'],
    collaborators: [users[0], users[1], users[2]],
    stars: 256,
    forks: 67,
    githubUrl: 'https://github.com/example/blockchain-vcs',
    cloneUrl: 'https://github.com/example/blockchain-vcs.git',
    lastUpdated: new Date('2023-12-14T16:45:00'),
  },
  {
    id: '4',
    name: 'Serverless Microservices Framework',
    description: 'A framework for building and deploying serverless microservices with ease.',
    tags: ['Node.js', 'AWS Lambda', 'Microservices'],
    collaborators: [users[2]],
    stars: 178,
    forks: 23,
    githubUrl: 'https://github.com/example/serverless-micro',
    cloneUrl: 'https://github.com/example/serverless-micro.git',
    lastUpdated: new Date('2023-12-13T11:20:00'),
  },
];

export const ideas: Idea[] = [
  {
    id: '1',
    title: 'AI-powered Code Generation',
    description: 'Develop a tool that uses GPT-3 to generate boilerplate code based on natural language descriptions.',
    author: users[0],
    likes: 42,
    comments: 15,
  },
  {
    id: '2',
    title: 'Blockchain-based Code Ownership',
    description: 'Create a system to track and verify code ownership using blockchain technology.',
    author: users[1],
    likes: 38,
    comments: 22,
  },
];

