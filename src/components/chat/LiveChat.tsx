import React, { useState, useEffect, useRef } from "react";
import { User, Message, FileAttachment,ChatUser, Channel} from "../../types";
import { Send, Search, Phone, Video, MoreHorizontal,Hash, Smile, Settings,} from 'lucide-react';
import ProfileSetting from "./ProfileSetting";
import StatusTeam from "./StatusTeam";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FilePreview } from "./FilePreview";
import { MessageAttachment } from "./MessageAttachment";
import { Toaster } from "@/components/ui/toaster"
import { FileInput } from "./FileInput"
import { useToast } from "@/hooks/use-toast"
import { AddChannelDialog } from "./AddChannelDialog"
import { ChannelActions } from "./ChannelActions"

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

  const documentInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [channels, setChannels] = useState<Channel[]>([
    { id: "1", name: "general", ownerId: "system" },
    { id: "2", name: "development", ownerId: "system" }
  ]);
  const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[0]);

  const { toast } = useToast()

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    const fileAttachments: FileAttachment[] = await Promise.all(
      selectedFiles.map(async (file) => {
        // In a real application, you would upload the file to a server here
        // and get back a URL. For this example, we'll use a fake URL.
        const fakeUrl = URL.createObjectURL(file);
        return {
          name: file.name,
          type: file.type,
          url: fakeUrl
        };
      })
    );

    const message: Message = {
      id: Date.now().toString(),
      user: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
      files: fileAttachments
    };

    setMessages([...messages, message]);
    setNewMessage("");
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };


  const handleDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedDocument(file);
    }
  };

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setSelectedMedia(file);
    } else {
      alert('Please select an image or video file.');
    }
  };

  const handleAddChannel = (channelName: string) => {
    const newChannel: Channel = {
      id: Date.now().toString(),
      name: channelName,
      ownerId: currentUser.id
    };
    setChannels([...channels, newChannel]);
    toast({
      title: "Channel created",
      description: `You've successfully created the #${channelName} channel.`
    });
  };

  const handleDeleteChannel = (channelId: string) => {
  const channelToDelete = channels.find(channel => channel.id === channelId);
  if (channelToDelete && channelToDelete.ownerId === currentUser.id) {
    const updatedChannels = channels.filter(channel => channel.id !== channelId);
    setChannels(updatedChannels);
    if (selectedChannel.id === channelId) {
      setSelectedChannel(updatedChannels[0] || null);
    }
    toast({
      title: "Channel deleted",
      description: `You've successfully deleted the #${channelToDelete.name} channel.`
    });
  } else {
    toast({
      title: "Error",
      description: "You don't have permission to delete this channel.",
      variant: "destructive"
    });
  }
};

const handleLeaveChannel = (channelId: string) => {
  const channelToLeave = channels.find(channel => channel.id === channelId);
  if (channelToLeave) {
    // In a real application, you would update the server here
    const updatedChannels = channels.filter(channel => channel.id !== channelId);
    setChannels(updatedChannels);
    if (selectedChannel.id === channelId) {
      setSelectedChannel(updatedChannels[0] || null);
    }
    toast({
      title: "Channel left",
      description: `You've successfully left the #${channelToLeave.name} channel.`
    });
  }
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
                CHANNELS
              </h3>
              {channels.map(channel => (
                <div key={channel.id} className="flex items-center justify-between px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <button
                    className="flex-grow text-left flex items-center"
                    onClick={() => setSelectedChannel(channel)}
                  >
                    <Hash className="w-4 h-4 inline mr-2" />
                    <span className="truncate">{channel.name}</span>
                  </button>
                  <ChannelActions
                    isOwner={channel.ownerId === currentUser.id}
                    onDelete={() => handleDeleteChannel(channel.id)}
                    onLeave={() => handleLeaveChannel(channel.id)}
                  />
                </div>
              ))}
              <AddChannelDialog onAddChannel={handleAddChannel} />
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
                {currentUser.email?.length ?? 0 > 15
                  ? currentUser.email?.substring(0, 15) + "..."
                  : currentUser.email}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser.role}
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
        {selectedChannel ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold dark:text-white">
                  # {selectedChannel.name}
                </h2>
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
                      <div className={`flex-1 ${isCurrentUser ? "text-right" : ""}`}>
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
                          className={`inline-block rounded-lg px-4 py-2 ${
                            isCurrentUser
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                          }`}
                        >
                          {message.content && <p>{message.content}</p>}
                          {message.files?.map((file, index) => (
                            <MessageAttachment key={index} file={file} />
                          ))}
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
                <FilePreview files={selectedFiles} onRemove={removeFile} />
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                  <div className="flex items-center space-x-1">
                    <FileInput
                      type="document"
                      inputRef={documentInputRef}
                      onFileSelect={(files) => {
                        if (files) {
                          setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(files)])
                          toast({
                            title: "Files added",
                            description: `${files.length} document(s) added to your message`
                          })
                        }
                      }}
                    />
                    <FileInput
                      type="media"
                      inputRef={mediaInputRef}
                      onFileSelect={(files) => {
                        if (files) {
                          setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(files)])
                          toast({
                            title: "Files added",
                            description: `${files.length} media file(s) added to your message`
                          })
                        }
                      }}
                    />
                    <div className="relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        ref={emojiButtonRef}
                        className="hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={toggleEmojiPicker}
                      >
                        <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </Button>
                      {showEmojiPicker && (
                        <div
                          ref={emojiPickerRef}
                          className="absolute bottom-full right-0 mb-2 z-50"
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
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() && selectedFiles.length === 0}
                    className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome to the chat!</h2>
              <p className="text-gray-600 dark:text-gray-400">Select a channel to start messaging</p>
            </div>
          </div>
        )}
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
      <Toaster />
    </div>
  );
}

