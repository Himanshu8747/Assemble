import React, { useState, useEffect, useRef } from "react";
import { User, Message } from "../../types";
import {
  Send,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Hash,
  Smile,
  Settings,
  Image as ImageIcon
} from "react-feather";
import ProfileSetting from "./ProfileSetting";
import StatusTeam from "./StatusTeam";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatUser extends User {
  isOnline?: boolean;
  lastSeen?: string;
  status?: string;
}

export default function LiveChat({ currentUser }: { currentUser: User }) {
  const [activeUsers, setActiveUsers] = useState<ChatUser[]>([
    {
      id: "1",
      name: "Alice Cooper",
      avatar: "https://i.pravatar.cc/150?u=alice",
      role: "Senior Developer",
      skills: ["React", "Node.js"],
      contributions: 45,
      isOnline: true,
      status: "Working on the new API",
    },
    {
      id: "2",
      name: "Bob Wilson",
      avatar: "https://i.pravatar.cc/150?u=bob",
      role: "UI Designer",
      skills: ["UI/UX", "Figma"],
      contributions: 32,
      isOnline: true,
      status: "In a meeting",
    },
    {
      id: "3",
      name: "Carol Smith",
      avatar: "https://i.pravatar.cc/150?u=carol",
      role: "Developer",
      skills: ["Python", "React"],
      contributions: 28,
      isOnline: false,
      lastSeen: "2 hours ago",
      status: "Out for lunch",
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey team, hows the new feature coming along?",
      user: activeUsers[0],
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      content: "Making good progress! Just fixing some edge cases.",
      user: activeUsers[1],
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "3",
      content: "Great to hear! Let me know if you need any help with testing.",
      user: activeUsers[0],
      timestamp: new Date(Date.now() - 900000).toISOString(),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [isAttaching, setIsAttaching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isStatusTeamDialogOpen, setIsStatusTeamDialogOpen] = useState(false);
  const [currentUserStatus, setCurrentUserStatus] = useState(
    currentUser.status || "online"
  );
  const [currentUserTeam, setCurrentUserTeam] = useState(
    currentUser.team || ""
  );

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const handleStatusChange = (newStatus: string) => {
    setCurrentUserStatus(newStatus);
    // Here you would typically update the user's status on the server
  };

  const handleTeamChange = (newTeam: string) => {
    setCurrentUserTeam(newTeam);
    // Here you would typically update the user's team on the server
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const updatedMessage = newMessage.slice(0, cursorPosition) + emoji + newMessage.slice(cursorPosition);
    setNewMessage(updatedMessage);
    setCursorPosition(cursorPosition + emoji.length);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="h-[600px] flex bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border dark:border-gray-700">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-white"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="mb-4">
              <h3 className="px-3 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                TEAMS
              </h3>
              <button className="w-full text-left px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Hash className="w-4 h-4 inline mr-2" />
                general
              </button>
              <button className="w-full text-left px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Hash className="w-4 h-4 inline mr-2" />
                development
              </button>
            </div>

            <hr className="my-2 border-gray-200 dark:border-gray-700" />

            <div>
              <h3 className="px-3 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                ONLINE — {activeUsers.filter((u) => u.isOnline).length}
              </h3>
              {activeUsers.map((user) => (
                <button
                  key={user.id}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedUser?.id === user.id
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800
                        ${user.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                      />
                    </div>
                    <div className="flex-1 truncate text-left">
                      <div className="text-sm font-medium dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.status} • {user.team || "No team"}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium dark:text-white">
                {/* {currentUser.email?.length ?? 0 > 15
                  ? currentUser.email?.substring(0, 15) + "..."
                  : currentUser.email} */}
                  {currentUser.name}
              </div>
            </div>
            <button
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsProfileSettingsOpen(true)}
            >
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold dark:text-white">
              {selectedUser ? selectedUser.name : "# general"}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedUser ? (
                <>
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      selectedUser.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                  {selectedUser.status}
                </>
              ) : (
                <>
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      currentUserStatus === "online"
                        ? "bg-green-500"
                        : currentUserStatus === "away"
                        ? "bg-yellow-500"
                        : currentUserStatus === "do-not-disturb"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  {currentUserStatus}
                </>
              )}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Video className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsStatusTeamDialogOpen(true)}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const showAvatar =
                index === 0 || messages[index - 1].user.id !== message.user.id;
              const isCurrentUser = message.user.id === currentUser.id;
              return (
                <div
                  key={message.id}
                  className={`flex space-x-3 ${
                    isCurrentUser ? "justify-end" : ""
                  }`}
                >
                  {!isCurrentUser && showAvatar && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.user.avatar} alt={message.user.name} />
                      <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`flex-1 ${isCurrentUser ? "text-right" : ""}`}
                  >
                    {showAvatar && (
                      <div className="flex items-baseline space-x-2 mb-1">
                        <span className="font-medium text-sm dark:text-white">
                          {message.user.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                    <div
                      className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                        isCurrentUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSendMessage}>
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsAttaching(!isAttaching)}
                >
                  <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                <div className="relative">
                  <button
                    type="button"
                    ref={emojiButtonRef}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={toggleEmojiPicker}
                  >
                    <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  {showEmojiPicker && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-full right-0 mb-2"
                    >
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        autoFocusSearch={false}
                        width={300}
                        height={400}
                      />
                    </div>
                  )}
                </div>
              </div>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyUp={(e) => setCursorPosition(e.currentTarget.selectionStart || 0)}
                onClick={(e) => setCursorPosition(e.currentTarget.selectionStart || 0)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newMessage.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
      <ProfileSetting
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
        currentUser={currentUser}
      />
      <StatusTeam
        isOpen={isStatusTeamDialogOpen}
        onClose={() => setIsStatusTeamDialogOpen(false)}
        currentUser={currentUser}
        onStatusChange={handleStatusChange}
        onTeamChange={handleTeamChange}
      />
    </div>
  );
}

