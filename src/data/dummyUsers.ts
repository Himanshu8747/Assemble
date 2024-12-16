export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    isActive: boolean;
  }
  
  export const dummyUsers: User[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Alice',
      isActive: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Bob',
      isActive: false,
    },
    {
      id: '3',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Charlie',
      isActive: true,
    },
    {
      id: '4',
      name: 'Diana Prince',
      email: 'diana@example.com',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Diana',
      isActive: false,
    },
    {
      id: '5',
      name: 'Ethan Hunt',
      email: 'ethan@example.com',
      avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Ethan',
      isActive: true,
    },
  ];
  
  