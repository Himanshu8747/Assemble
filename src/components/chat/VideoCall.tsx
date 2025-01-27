import React, { useEffect, useRef, useState, useCallback } from "react";
import { Phone, Mic, MicOff, VideoIcon, VideoOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { VideoCallProps, WebRTCSignal } from "@/types";
import Peer from "simple-peer";

const VideoCall: React.FC<VideoCallProps> = ({ partner, onEndCall, socket }) => {
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

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
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      return newPeer;
    },
    [partner.id, socket]
  );

  useEffect(() => {
    const setupVideoCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const newPeer = createPeer(stream);
        setPeer(newPeer);
      } catch (error) {
        console.error("Error accessing camera and microphone:", error);
      }
    };

    setupVideoCall();

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

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full h-full max-w-4xl max-h-[80vh] relative">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg" />
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <Button variant="secondary" size="icon" className="rounded-full w-12 h-12" onClick={toggleMute}>
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full w-12 h-12" onClick={toggleVideo}>
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
          </Button>
          <Button variant="destructive" size="icon" className="rounded-full w-12 h-12" onClick={handleEndCall}>
            <Phone className="w-6 h-6 transform rotate-135" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;

