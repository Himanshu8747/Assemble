import { useState, useEffect } from 'react';
import { User, Message } from '../../types';
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreHorizontal,  
  Paperclip,
  Hash,
  Settings
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ChatUser extends User {
  isOnline?: boolean;
  lastSeen?: string;
  status?: string;
}

export default function EnhancedLiveChat({ currentUser }: { currentUser: User }) {
  const [activeUsers, setActiveUsers] = useState<ChatUser[]>([
    {
      id: '1',
      name: 'Alice Cooper',
      avatar: '/api/placeholder/32/32',
      role: 'Senior Developer',
      skills: ['React', 'Node.js'],
      contributions: 45,
      isOnline: true,
      status: 'Working on the new API'
    },
    {
      id: '2',
      name: 'Bob Wilson',
      avatar: '/api/placeholder/32/32',
      role: 'UI Designer',
      skills: ['UI/UX', 'Figma'],
      contributions: 32,
      isOnline: true,
      status: 'In a meeting'
    },
    {
      id: '3',
      name: 'Carol Smith',
      avatar: '/api/placeholder/32/32',
      role: 'Developer',
      skills: ['Python', 'React'],
      contributions: 28,
      isOnline: false,
      lastSeen: '2 hours ago',
      status: 'Out for lunch'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hey team, hows the new feature coming along?',
      user: activeUsers[0],
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '2',
      content: 'Making good progress! Just fixing some edge cases.',
      user: activeUsers[1],
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: '3',
      content: 'Great to hear! Let me know if you need any help with testing.',
      user: activeUsers[0],
      timestamp: new Date(Date.now() - 900000).toISOString()
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="h-[600px] flex bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r flex flex-col">
        <div className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-9 bg-white"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="mb-4">
              <h3 className="px-3 mb-2 text-sm font-semibold text-gray-500">CHANNELS</h3>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm font-medium"
              >
                <Hash className="w-4 h-4 mr-2" />
                general
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm font-medium"
              >
                <Hash className="w-4 h-4 mr-2" />
                development
              </Button>
            </div>

            <Separator className="my-2" />

            <div>
              <h3 className="px-3 mb-2 text-sm font-semibold text-gray-500">ONLINE — {activeUsers.filter(u => u.isOnline).length}</h3>
              {activeUsers.map((user) => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className={`w-full justify-start mb-1 ${selectedUser?.id === user.id ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span 
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                          ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                      />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.status}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium">{currentUser.name}</div>
              <div className="text-xs text-gray-500">{currentUser.role}</div>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">
              {selectedUser ? selectedUser.name : '# general'}
            </h2>
            <span className="text-sm text-gray-500">
              {selectedUser ? selectedUser.status : '3 members'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const showAvatar = index === 0 || messages[index - 1].user.id !== message.user.id;
              return (
                <div key={message.id} className="flex space-x-3">
                  {showAvatar ? (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.user.avatar} alt={message.user.name} />
                      <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8" />
                  )}
                  <div className="flex-1">
                    {showAvatar && (
                      <div className="flex items-baseline space-x-2">
                        <span className="font-medium">{message.user.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    )}
                    <p className="text-gray-900">{message.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
            <div className="flex-1 bg-gray-50 rounded-lg p-2">
              <div className="flex items-center space-x-2 mb-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <Button type="submit" size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}