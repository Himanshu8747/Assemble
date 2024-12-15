import { useState } from 'react';
import { useLiveChat } from '../../hooks/useLiveChat';
import { formatDate } from '../../utils/dateFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { users } from '../../data/dummyData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function LiveChat() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { messages, sendMessage } = useLiveChat();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage, '1');
      setNewMessage('');
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Live Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto mb-4">
        {messages.map((message) => {
          const user = users.find((u) => u.id === message.userId);
          return (
            <div key={message.id} className="flex items-start space-x-2 mb-4">
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{user?.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
      <div className="p-4 border-t flex">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow mr-2"
          disabled={!user}
        />
        <Button onClick={handleSendMessage} disabled={!user}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

