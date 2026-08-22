"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// Stream Video
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

import { Loader2 } from "lucide-react";
import CallUI from "./CallUI";
import { startCallRecording } from "@/actions/call";

export default function CallRoom({
  callId,
  token,
  apiKey,
  currentUser,
  booking,
  isInterviewer,
}) {
  const router = useRouter();
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [mediaError, setMediaError] = useState({ audio: null, video: null });
  const clientRef = useRef(null);
  const joinedRef = useRef(false);

  useEffect(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;

    console.log("CallRoom client initialization details:", {
      apiKey,
      userId: currentUser.id,
      token: token ? (token.substring(0, 15) + "...") : "missing",
      callId
    });

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        image: currentUser.imageUrl,
      },
      token,
      options: {
        logOptions: {
          default: {
            level: "error",
          },
        },
      },
    });

    const callInstance = client.call("default", callId);

    const checkDevicesAndJoin = async () => {
      try {
        let hasAudio = false;
        let hasVideo = false;
        let isAudioGranted = true; // Default to true so we attempt to prompt if state is "prompt"
        let isVideoGranted = true;

        if (typeof window !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          hasAudio = devices.some((d) => d.kind === "audioinput");
          hasVideo = devices.some((d) => d.kind === "videoinput");
        }

        if (typeof window !== "undefined" && navigator.permissions && navigator.permissions.query) {
          try {
            const audioPermission = await navigator.permissions.query({ name: "microphone" });
            // Only block if explicitly denied. If "prompt" or "granted", we should attempt to enable.
            isAudioGranted = audioPermission.state !== "denied";
          } catch (e) {
            console.warn("Could not query microphone permission:", e);
          }
          try {
            const videoPermission = await navigator.permissions.query({ name: "camera" });
            // Only block if explicitly denied. If "prompt" or "granted", we should attempt to enable.
            isVideoGranted = videoPermission.state !== "denied";
          } catch (e) {
            console.warn("Could not query camera permission:", e);
          }
        }

        // Set media device states before joining based on permissions/availability
        if (hasAudio && isAudioGranted) {
          await callInstance.microphone.enable().catch((err) => {
            console.warn("CallRoom: Failed to get audio stream, disabling microphone. Error:", err);
            const isSystemDenied = err.name === "NotAllowedError" || err.message?.includes("Permission denied") || err.message?.includes("Permission dismissed");
            setMediaError((prev) => ({ ...prev, audio: isSystemDenied ? "system-denied" : "failed" }));
            return callInstance.microphone.disable().catch(() => {});
          });
        } else {
          setMediaError((prev) => ({ ...prev, audio: hasAudio ? "denied" : "missing" }));
          await callInstance.microphone.disable().catch(() => {});
        }

        if (hasVideo && isVideoGranted) {
          await callInstance.camera.enable().catch((err) => {
            console.warn("CallRoom: Failed to get video stream, disabling camera. Error:", err);
            const isSystemDenied = err.name === "NotAllowedError" || err.message?.includes("Permission denied") || err.message?.includes("Permission dismissed");
            setMediaError((prev) => ({ ...prev, video: isSystemDenied ? "system-denied" : "failed" }));
            return callInstance.camera.disable().catch(() => {});
          });
        } else {
          setMediaError((prev) => ({ ...prev, video: hasVideo ? "denied" : "missing" }));
          await callInstance.camera.disable().catch(() => {});
        }

        // Retrieve call details from the server (already created during booking)
        await callInstance.get();

        // Join call
        await callInstance.join();
        setCall(callInstance);
        setVideoClient(client);
        clientRef.current = client;

        // Auto-start recording for Interviewers to capture session logs
        if (isInterviewer) {
          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("recording start timeout")), 3000)
          );
          await Promise.race([startCallRecording(callId), timeout]).catch((err) => {
            console.warn("Failed to auto-start call recording via server:", err);
          });
        }
      } catch (err) {
        console.error("Failed to join call room:", err);
        // Force state setting to unblock UI even if joining fails partly
        setCall(callInstance);
        setVideoClient(client);
        clientRef.current = client;
      }
    };

    checkDevicesAndJoin();

    return () => {
      // Disconnect handled in CallUI.jsx handleLeave method
    };
  }, [callId, token, apiKey, currentUser, isInterviewer]);

  const handleLeave = useCallback(() => {
    router.replace(isInterviewer ? "/dashboard" : "/appointments");
  }, [router, isInterviewer]);

  if (!videoClient || !call) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <Loader2 size={24} className="text-graphite animate-spin" />
        <p className="text-slate text-sm font-light">Connecting to call room…</p>
      </div>
    );
  }

  return (
    <StreamVideo client={videoClient}>
      <StreamCall call={call}>
        <CallUI
          callId={callId}
          isInterviewer={isInterviewer}
          booking={booking}
          onLeave={handleLeave}
          apiKey={apiKey}
          token={token}
          currentUser={currentUser}
          mediaError={mediaError}
        />
      </StreamCall>
    </StreamVideo>
  );
}
