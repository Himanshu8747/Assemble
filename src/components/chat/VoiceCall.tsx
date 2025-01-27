import React, { useEffect, useRef, useState, useCallback } from "react";
import { Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatUser, WebRTCSignal } from "@/types/index";
import Peer from "simple-peer";
import { Socket } from "socket.io-client";

interface VoiceCallProps {
  partner: ChatUser;
  onEndCall: () => void;
  socket: Socket | null;
}

const VoiceCall: React.FC<VoiceCallProps> = ({ partner, onEndCall, socket }) => {
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const createPeer = useCallback(
    (stream: MediaStream) => {
      const newPeer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      newPeer.on("signal", (data) => {
        socket?.emit("webrtc_signal", {
          type: "offer",
          sender: partner.id,
          recipient: partner.id,
          payload: data,
        });
      });

      newPeer.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
        }
      });

      return newPeer;
    },
    [partner.id, socket]
  );

  useEffect(() => {
    const setupVoiceCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
        }

        const newPeer = createPeer(stream);
        setPeer(newPeer);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    setupVoiceCall();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
    };
  }, [createPeer, localStream]); // Added localStream to dependencies

  useEffect(() => {
    if (socket) {
      const handleWebRTCSignal = (signal: WebRTCSignal) => {
        if (signal.sender === partner.id && peer) {
          peer.signal(signal.payload);
        }
      };

      socket.on("webrtc_signal", handleWebRTCSignal);

      return () => {
        socket.off("webrtc_signal", handleWebRTCSignal);
      };
    }
  }, [socket, partner.id, peer]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={partner.avatar} alt={partner.name} />
            <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">{partner.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Voice call in progress...</p>
        </div>
        <div className="flex justify-center">
          <Button variant="destructive" size="icon" className="rounded-full w-12 h-12" onClick={onEndCall}>
            <Phone className="w-6 h-6 transform rotate-135" />
          </Button>
        </div>
        <audio ref={localAudioRef} autoPlay muted style={{ display: "none" }} />
        <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default VoiceCall;
