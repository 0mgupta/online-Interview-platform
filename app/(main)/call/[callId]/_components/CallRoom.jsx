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
        let isAudioGranted = false;
        let isVideoGranted = false;

        if (typeof window !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          hasAudio = devices.some((d) => d.kind === "audioinput");
          hasVideo = devices.some((d) => d.kind === "videoinput");
        }

        if (typeof window !== "undefined" && navigator.permissions && navigator.permissions.query) {
          try {
            const audioPermission = await navigator.permissions.query({ name: "microphone" });
            isAudioGranted = audioPermission.state === "granted";
          } catch (e) {
            console.warn("Could not query microphone permission:", e);
          }
          try {
            const videoPermission = await navigator.permissions.query({ name: "camera" });
            isVideoGranted = videoPermission.state === "granted";
          } catch (e) {
            console.warn("Could not query camera permission:", e);
          }
        }

        // Set media device states before joining based on permissions/availability
        if (hasAudio && isAudioGranted) {
          await callInstance.microphone.enable().catch(console.error);
        } else {
          console.warn("CallRoom: Audio disabled (missing or permission not granted).");
          await callInstance.microphone.disable().catch(console.error);
        }
        if (hasVideo && isVideoGranted) {
          await callInstance.camera.enable().catch(console.error);
        } else {
          console.warn("CallRoom: Video disabled (missing or permission not granted).");
          await callInstance.camera.disable().catch(console.error);
        }

        await callInstance.join({ create: false });
        clientRef.current = client;
        setVideoClient(client);
        setCall(callInstance);
      } catch (err) {
        console.warn("Failed to join call, disabling media devices and retrying...", err);
        try {
          // Disable both devices to bypass media capture failures
          await callInstance.microphone.disable().catch(() => {});
          await callInstance.camera.disable().catch(() => {});
          
          await callInstance.join({ create: false });
          clientRef.current = client;
          setVideoClient(client);
          setCall(callInstance);
        } catch (joinErr) {
          console.error("Critical: Fallback join failed even with media disabled:", joinErr);
        }
      }
    };

    checkDevicesAndJoin();

    return () => {
      callInstance.leave().catch(() => {});
      client.disconnectUser().catch(() => {});
      clientRef.current = null;
      joinedRef.current = false; // reset so hot reload works
    };
  }, [
    apiKey,
    callId,
    currentUser.id,
    currentUser.imageUrl,
    currentUser.name,
    token,
  ]);

  const handleLeave = useCallback(() => {
    router.push(isInterviewer ? "/dashboard" : "/appointments");
  }, [isInterviewer, router]);

  if (!videoClient || !call) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="text-amber-400 animate-spin" />
        <p className="text-stone-500 text-sm font-light">Connecting to call…</p>
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
        />
      </StreamCall>
    </StreamVideo>
  );
}
