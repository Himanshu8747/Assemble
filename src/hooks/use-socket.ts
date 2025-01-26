import { useEffect, useRef } from "react"
import io, { type Socket } from "socket.io-client"

export function useSocket(url: string) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = io(url, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server")
    })

    socketRef.current.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [url])

  return socketRef
}

