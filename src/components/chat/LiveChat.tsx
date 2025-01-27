import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import type { User, Message, FileAttachment, ChatUser, Channel, Chat, WebRTCSignal, CallData } from "@/types"
import {
  Send,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Hash,
  Smile,
  Settings,
  X,
  UserPlus,
  MessageSquare,
} from "lucide-react"
import ProfileSetting from "./ProfileSetting"
import StatusTeam from "./StatusTeam"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components//ui/button"
import { FilePreview } from "./FilePreview"
import { MessageAttachment } from "./MessageAttachment"
import { Toaster } from "@/components//ui/toaster"
import { FileInput } from "./FileInput"
import { useToast } from "@/hooks/use-toast"
import { AddChannelDialog } from "./AddChannelDialog"
import { ChannelActions } from "./ChannelActions"
import { useSocket } from "@/hooks/use-socket"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components//ui/dialog"
import VoiceCall from "./VoiceCall"
import VideoCall from "./VideoCall"

export default function LiveChat({ currentUser }: { currentUser: User }) {
  const [activeUsers, setActiveUsers] = useState<ChatUser[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [isAttaching, setIsAttaching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false)
  const [isStatusTeamDialogOpen, setIsStatusTeamDialogOpen] = useState(false)
  const [currentUserStatus, setCurrentUserStatus] = useState(currentUser.status || "online")
  const [currentUserTeam, setCurrentUserTeam] = useState(currentUser.team || "")

  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const emojiButtonRef = useRef<HTMLButtonElement>(null)

  const documentInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [channels, setChannels] = useState<Channel[]>([
    { id: "1", name: "general", ownerId: "system" },
    { id: "2", name: "development", ownerId: "system" },
  ])
  const [chats, setChats] = useState<Chat[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [suggestedUsers, setSuggestedUsers] = useState<ChatUser[]>([])
  const [showSuggestedUsers, setShowSuggestedUsers] = useState(false)

  const { toast } = useToast()

  const socket = useSocket("http://localhost:3001")

  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false)
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [callPartner, setCallPartner] = useState<ChatUser | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    if (socket.current) {
      socket.current.on("chat message", (msg: Message) => {
        console.log("Received message:", msg)
        setMessages((prevMessages) => [...prevMessages, msg])
        updateLastMessage(msg)
      })

      socket.current.on("load messages", (loadedMessages: Message[]) => {
        console.log("Loaded messages:", loadedMessages)
        setMessages(loadedMessages)
      })

      socket.current.on("active users", (users: ChatUser[]) => {
        console.log("Received active users:", users)
        setActiveUsers(users)
      })

      socket.current.on("suggested users", (users: ChatUser[]) => {
        console.log("Received suggested users:", users)
        setSuggestedUsers(users)
      })

      socket.current.on("update chats", (updatedChats: Chat[]) => {
        console.log("Received updated chats:", updatedChats)
        setChats(updatedChats)
      })

      socket.current.on("incoming_call", (callData: CallData) => {
        handleIncomingCall(callData.type, callData.callerId)
      })

      socket.current.on("call_ended", handleCallEnd)

      socket.current.on("webrtc_signal", (signal: WebRTCSignal) => {
        handleWebRTCSignal(signal)
      })

      socket.current.emit("get active users")
      socket.current.emit("get suggested users", currentUser.id)
      socket.current.emit("get chats", currentUser.id)

      return () => {
        socket.current?.off("chat message")
        socket.current?.off("load messages")
        socket.current?.off("active users")
        socket.current?.off("suggested users")
        socket.current?.off("update chats")
        socket.current?.off("incoming_call")
        socket.current?.off("call_ended")
        socket.current?.off("webrtc_signal")
      }
    }
  }, [socket, currentUser.id])

  useEffect(() => {
    if (socket.current && selectedChat) {
      console.log("Joining chat:", selectedChat.id)
      socket.current.emit("join chat", { chatId: selectedChat.id, userId: currentUser.id })

      return () => {
        console.log("Leaving chat:", selectedChat.id)
        socket.current?.emit("leave chat", { chatId: selectedChat.id, userId: currentUser.id })
      }
    }
  }, [selectedChat, currentUser.id, socket])

  const updateLastMessage = (message: Message) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (
          (chat.type === "channel" && chat.id === message.channelId) ||
          (chat.type === "direct" && chat.id === message.recipientId)
        ) {
          return { ...chat, lastMessage: message }
        }
        return chat
      })
    })
  }

  const handleStatusChange = (newStatus: string) => {
    setCurrentUserStatus(newStatus)
    if (socket.current) {
      socket.current.emit("update user status", { userId: currentUser.id, status: newStatus })
    }
  }

  const handleTeamChange = (newTeam: string) => {
    setCurrentUserTeam(newTeam)
    if (socket.current) {
      socket.current.emit("update user team", { userId: currentUser.id, team: newTeam })
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messagesEndRef])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMessages(
        messages.filter(
          (message) =>
            (selectedChat?.type === "channel" && message.channelId === selectedChat.id) ||
            (selectedChat?.type === "direct" && message.recipientId === selectedChat.id),
        ),
      )
    } else {
      const lowercasedQuery = searchQuery.toLowerCase()
      const filtered = messages.filter(
        (message) =>
          ((selectedChat?.type === "channel" && message.channelId === selectedChat.id) ||
            (selectedChat?.type === "direct" && message.recipientId === selectedChat.id)) &&
          (message.content.toLowerCase().includes(lowercasedQuery) ||
            message.user.name.toLowerCase().includes(lowercasedQuery)),
      )
      setFilteredMessages(filtered)
    }
  }, [searchQuery, messages, selectedChat])

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() && selectedFiles.length === 0) return

      const fileAttachments: FileAttachment[] = await Promise.all(
        selectedFiles.map(async (file) => {
          const fakeUrl = URL.createObjectURL(file)
          return {
            name: file.name,
            type: file.type,
            url: fakeUrl,
          }
        }),
      )

      const message: Message = {
        id: Date.now().toString(),
        user: currentUser as ChatUser,
        content: newMessage,
        timestamp: new Date().toISOString(),
        files: fileAttachments,
        ...(selectedChat?.type === "channel" ? { channelId: selectedChat.id } : { recipientId: selectedChat?.id }),
      }

      console.log("Sending message:", message)
      if (socket.current) {
        socket.current.emit("chat message", message, (error: any) => {
          if (error) {
            console.error("Error sending message:", error)
            toast({
              title: "Error",
              description: "Failed to send message. Please try again.",
              variant: "destructive",
            })
          } else {
            console.log("Message sent successfully")
            setNewMessage("")
            setSelectedFiles([])
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          }
        })
      } else {
        console.error("Socket not connected")
        toast({
          title: "Error",
          description: "Not connected to the server. Please try again later.",
          variant: "destructive",
        })
      }
    },
    [newMessage, selectedFiles, currentUser, selectedChat, socket, toast],
  )

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji
    const updatedMessage = newMessage.slice(0, cursorPosition) + emoji + newMessage.slice(cursorPosition)
    setNewMessage(updatedMessage)
    setCursorPosition(cursorPosition + emoji.length)
    setShowEmojiPicker(false)
  }

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleAddChannel = (channelName: string) => {
    if (socket.current) {
      socket.current.emit(
        "add channel",
        { name: channelName, ownerId: currentUser.id },
        (error: any, newChannel: Channel) => {
          if (error) {
            console.error("Error adding channel:", error)
            toast({
              title: "Error",
              description: "Failed to add channel. Please try again.",
              variant: "destructive",
            })
          } else {
            setChannels((prevChannels) => [...prevChannels, newChannel])
            toast({
              title: "Channel created",
              description: `You've successfully created the #${channelName} channel.`,
            })
          }
        },
      )
    }
  }

  const handleDeleteChannel = (channelId: string) => {
    if (socket.current) {
      socket.current.emit("delete channel", { channelId, userId: currentUser.id }, (error: any) => {
        if (error) {
          console.error("Error deleting channel:", error)
          toast({
            title: "Error",
            description: "Failed to delete channel. Please try again.",
            variant: "destructive",
          })
        } else {
          setChannels((prevChannels) => prevChannels.filter((channel) => channel.id !== channelId))
          if (selectedChat?.id === channelId) {
            setSelectedChat(null)
          }
          toast({
            title: "Channel deleted",
            description: `You've successfully deleted the channel.`,
          })
        }
      })
    }
  }

  const handleLeaveChannel = (channelId: string) => {
    if (socket.current) {
      socket.current.emit("leave channel", { channelId, userId: currentUser.id }, (error: any) => {
        if (error) {
          console.error("Error leaving channel:", error)
          toast({
            title: "Error",
            description: "Failed to leave channel. Please try again.",
            variant: "destructive",
          })
        } else {
          setChannels((prevChannels) => prevChannels.filter((channel) => channel.id !== channelId))
          if (selectedChat?.id === channelId) {
            setSelectedChat(null)
          }
          toast({
            title: "Channel left",
            description: `You've successfully left the channel.`,
          })
        }
      })
    }
  }

  const handleAddUser = (user: ChatUser) => {
    if (socket.current) {
      socket.current.emit("add user", user.id, (error: any, updatedUsers: ChatUser[]) => {
        if (error) {
          console.error("Error adding user:", error)
          toast({
            title: "Error",
            description: "Failed to add user. Please try again.",
            variant: "destructive",
          })
        } else {
          setActiveUsers(updatedUsers)
          setSuggestedUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id))
          toast({
            title: "User added",
            description: `${user.name} has been added to your contacts.`,
          })
          const newChat: Chat = {
            id: user.id,
            type: "direct",
            name: user.name,
          }
          setChats((prevChats) => [...prevChats, newChat])
        }
      })
    }
  }

  const handleVoiceCallStart = useCallback(() => {
    if (selectedChat?.type === "direct") {
      setIsVoiceCallActive(true)
      setCallPartner(activeUsers.find((user) => user.id === selectedChat.id) || null)
      socket.current?.emit("initiate_call", { type: "voice", recipientId: selectedChat.id })
    } else {
      toast({
        title: "Cannot start voice call",
        description: "Voice calls are only available for direct chats.",
        variant: "destructive",
      })
    }
  }, [selectedChat, activeUsers, socket, toast])

  const handleVideoCallStart = useCallback(() => {
    if (selectedChat?.type === "direct") {
      setIsVideoCallActive(true)
      setCallPartner(activeUsers.find((user) => user.id === selectedChat.id) || null)
      socket.current?.emit("initiate_call", { type: "video", recipientId: selectedChat.id })
    } else {
      toast({
        title: "Cannot start video call",
        description: "Video calls are only available for direct chats.",
        variant: "destructive",
      })
    }
  }, [selectedChat, activeUsers, socket, toast])

  const handleCallEnd = useCallback(() => {
    setIsVoiceCallActive(false)
    setIsVideoCallActive(false)
    setCallPartner(null)
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
    }
    socket.current?.emit("end_call", { recipientId: callPartner?.id })
  }, [])

  const handleIncomingCall = useCallback(
    (type: "voice" | "video", callerId: string) => {
      const caller = activeUsers.find((user) => user.id === callerId)
      if (caller) {
        setCallPartner(caller)
        if (type === "voice") {
          setIsVoiceCallActive(true)
        } else if (type === "video") {
          setIsVideoCallActive(true)
        }
      }
    },
    [activeUsers],
  )

  const handleWebRTCSignal = useCallback(
    (signal: WebRTCSignal) => {
      if (isVoiceCallActive || isVideoCallActive) {
        // Pass the signal to the appropriate call component
        if (isVoiceCallActive) {
          // Handle voice call signaling
        } else if (isVideoCallActive) {
          // Handle video call signaling
        }
      }
    },
    [isVoiceCallActive, isVideoCallActive],
  )

  const renderChatList = () => {
    return (
      <div>
        <h3 className="px-3 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">CHATS</h3>
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedChat?.id === chat.id ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="flex items-center space-x-2">
              {chat.type === "channel" ? (
                <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
              <span className={`truncate ${selectedChat?.id === chat.id ? "font-semibold" : ""}`}>{chat.name}</span>
            </div>
            {chat.lastMessage && (
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{chat.lastMessage.content}</div>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="h-[600px] flex bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border dark:border-gray-700">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:text-white"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {renderChatList()}
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <div className="mb-4">
              <h3 className="px-3 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">CHANNELS</h3>
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`flex items-center justify-between px-3 py-1 rounded-md ${
                    selectedChat?.type === "channel" && selectedChat?.id === channel.id
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  } transition-colors`}
                >
                  <button
                    className="flex-grow text-left flex items-center"
                    onClick={() => setSelectedChat({ id: channel.id, type: "channel", name: channel.name })}
                  >
                    <Hash className="w-4 h-4 inline mr-2" />
                    <span className={`truncate ${selectedChat?.id === channel.id ? "font-semibold" : ""}`}>
                      {channel.name}
                    </span>
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
                CONTACTS — {activeUsers.filter((u) => u.isOnline).length}
              </h3>
              {activeUsers.map((user) => (
                <button
                  key={user.id}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedChat?.type === "direct" && selectedChat?.id === user.id
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedChat({ id: user.id, type: "direct", name: user.name })}
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
                      <div className={`text-sm font-medium dark:text-white ${selectedChat?.id === user.id ? "font-semibold" : ""}`}>
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.status} • {user.projects.join(", ")}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              <button
                className="w-full text-left px-3 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowSuggestedUsers(true)}
              >
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium dark:text-white">Add new contact</span>
                </div>
              </button>
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
                {(currentUser.email?.length ?? 0) > 15
                  ? currentUser.email?.substring(0, 15) + "..."
                  : currentUser.email}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</div>
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
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold dark:text-white">
                  {selectedChat.type === "channel" ? "#" : ""} {selectedChat.name}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:cursor-not-allowed"
                  onClick={handleVoiceCallStart}
                  disabled={isVoiceCallActive || isVideoCallActive || selectedChat.type === "channel"}
                >
                  <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:cursor-not-allowed"
                  onClick={handleVideoCallStart}
                  disabled={isVoiceCallActive || isVideoCallActive  || selectedChat.type === "channel"} 
                >
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
              {filteredMessages.length > 0 ? (
                <div className="space-y-4">
                  {filteredMessages.map((message, index) => {
                    const showAvatar = index === 0 || filteredMessages[index - 1].user.id !== message.user.id;
                    const isCurrentUser = message.user.id === currentUser.id;

                    return (
                      <div key={message.id} className={`flex space-x-3 ${isCurrentUser ? "justify-end" : ""}`}>
                        {!isCurrentUser && showAvatar && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.user.avatar} alt={message.user.name} />
                            <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`flex-1 ${isCurrentUser ? "text-right" : ""}`}>
                          {showAvatar && (
                            <div className="flex items-baseline space-x-2 mb-1">
                              <span className="font-medium text-sm dark:text-white">{message.user.name}</span>
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? "No messages found matching your search."
                      : "No messages in this chat yet. Be the first to say hello!"}
                  </p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage}>
                <FilePreview files={selectedFiles} onRemove={removeFile} />
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                  <div className="flex items-center space-x-1">
                    <FileInput type="document" inputRef={documentInputRef} onFileSelect={handleFileSelect} />
                    <FileInput type="media" inputRef={mediaInputRef} onFileSelect={handleFileSelect} />
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
                        <div ref={emojiPickerRef} className="absolute bottom-full right-0 mb-2 z-50">
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
              <p className="text-gray-600 dark:text-gray-400">Select a channel or contact to start messaging</p>
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
      <Dialog open={showSuggestedUsers} onOpenChange={setShowSuggestedUsers}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suggested Contacts</DialogTitle>
            <DialogDescription>
              These users are working on similar projects. Add them to your contacts to start chatting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.projects.join(", ")}</div>
                  </div>
                </div>
                <Button onClick={() => handleAddUser(user)}>Add</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {isVoiceCallActive && callPartner && (
        <VoiceCall partner={callPartner} onEndCall={handleCallEnd} socket={socket.current} />
      )}

      {isVideoCallActive && callPartner && (
        <VideoCall partner={callPartner} onEndCall={handleCallEnd} socket={socket.current} />
      )}
      <Toaster />
    </div>
  );
}

