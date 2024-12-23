import { User,Idea,Project,Message, Comment } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    role: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'TypeScript'],
    contributions: 247
  },
  {
    id: '2',
    name: 'Ajay Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    role: 'Frontend Architect',
    skills: ['React', 'Vue.js', 'TailwindCSS'],
    contributions: 183
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    role: 'Backend Developer',
    skills: ['Python', 'Django', 'PostgreSQL'],
    contributions: 159
  }
];

const sampleComments: Comment[] = [
  {
    id: '1',
    content: 'This is a brilliant idea! Id love to contribute.',
    author: users[1],
    createdAt: '2024-03-15T08:30:00Z'
  },
  {
    id: '2',
    content: 'We could also integrate this with existing CI/CD pipelines.',
    author: users[2],
    createdAt: '2024-03-15T09:15:00Z'
  }
];

export const ideas: Idea[] = [
  {
    id: '1',
    title: 'Blockchain-based Code Collaboration',
    description: 'A decentralized platform for code sharing and version control',
    author: users[0],
    likes: 42,
    comments: sampleComments,
    tags: ['blockchain', 'collaboration', 'git'],
    likedBy: ['2', '3']
  },
  {
    id: '2',
    title: 'AI Code Review Assistant',
    description: 'Automated code review tool powered by machine learning',
    author: users[1],
    likes: 38,
    comments: [],
    tags: ['ai', 'code-review', 'automation'],
    likedBy: ['1']
  },
  {
    id: '3',
    title: 'AI Code Review Assistant',
    description: 'Automated code review tool powered by machine learning',
    author: users[1],
    likes: 38,
    comments: [],
    tags: ['ai', 'code-review', 'automation'],
    likedBy: ['1']
  }
];

export const messages: Message[] = [
  {
    id: '1',
    user: users[0],
    content: 'Anyone interested in collaborating on a React Native project?',
    timestamp: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    user: users[1],
    content: 'Id love to help! I have experience with mobile development.',
    timestamp: '2024-03-15T10:32:00Z'
  }
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'EcoTrack Analytics',
    description: 'Real-time environmental data monitoring and analytics platform',
    tech: ['React', 'Node.js', 'MongoDB', 'D3.js'],
    owner: users[0],
    collaborators: [users[1], users[2]],
    stars: 156,
    progress: 75,
    githubUrl: 'https://github.com/ecotrack/analytics',
    recentActivity: [
      'Implemented new data visualization components',
      'Optimized MongoDB queries for faster data retrieval',
      'Added support for real-time air quality monitoring'
    ],
    upcomingMilestones: [
      'Launch beta version for early adopters',
      'Integrate machine learning models for predictive analytics',
      'Develop mobile app for on-the-go monitoring'
    ]
  },
  {
    id: '2',
    title: 'DevMentor AI',
    description: 'AI-powered code review and mentoring platform for developers',
    tech: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
    owner: users[1],
    collaborators: [users[2]],
    stars: 234,
    progress: 60,
    githubUrl: 'https://github.com/devmentor/ai-platform',
    recentActivity: [
      'Improved code suggestion algorithm',
      'Added support for TypeScript projects',
      'Implemented user feedback system for AI recommendations'
    ],
    upcomingMilestones: [
      'Integrate with popular IDEs (VSCode, IntelliJ)',
      'Develop personalized learning paths for users',
      'Launch premium features for enterprise clients'
    ]
  },
  {
    id: '3',
    title: 'CloudSync Pro',
    description: 'Multi-cloud data synchronization and backup solution',
    tech: ['Go', 'React', 'AWS', 'Docker'],
    owner: users[2],
    collaborators: [users[0]],
    stars: 189,
    progress: 90,
    githubUrl: 'https://github.com/cloudsync/pro',
    recentActivity: [
      'Added support for Google Cloud Platform',
      'Implemented end-to-end encryption for data transfer',
      'Optimized sync algorithm for large datasets'
    ],
    upcomingMilestones: [
      'Launch mobile apps for iOS and Android',
      'Implement AI-driven data deduplication',
      'Integrate with popular productivity tools (Slack, Trello)'
    ]
  },
  {
    id: '4',
    title: 'SecureAuth Hub',
    description: 'Advanced authentication and authorization platform',
    tech: ['TypeScript', 'Node.js', 'GraphQL', 'Redis'],
    owner: users[0],
    collaborators: [users[1]],
    stars: 142,
    progress: 45,
    githubUrl: 'https://github.com/secureauth/hub',
    recentActivity: [
      'Implemented multi-factor authentication support',
      'Added OAuth2 and OpenID Connect protocols',
      'Developed admin dashboard for user management'
    ],
    upcomingMilestones: [
      'Integrate biometric authentication methods',
      'Implement risk-based authentication system',
      'Develop SDKs for easy integration with various platforms'
    ]
  }
];