"use client";

import { useEffect, useCallback, useState } from "react";

// Stream Video
import {
  StreamTheme,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
  CallingState,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

// Stream Chat
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { Badge } from "@/components/ui/badge";
import { MessageSquare, Sparkles, Loader2, AlertTriangle } from "lucide-react";
import AIQuestionsPanel from "./AIQuestions";

// ─── Call UI (inside StreamCall context) ─────────────────────────────────────

export default function CallUI({
  callId,
  isInterviewer,
  booking,
  onLeave,
  apiKey,
  token,
  currentUser,
  mediaError,
}) {
  const { useCallCallingState } = useCallStateHooks();
  const call = useCall();
  const callingState = useCallCallingState();

  const [activeTab, setActiveTab] = useState("chat");

  // Auto-stop recording before leaving
  const handleLeave = useCallback(async () => {
    try {
      if (call) {
        const isRecording = call.state?.recording;
        if (isRecording) {
          await call.stopRecording().catch(() => {});
        }
        await call.leave().catch(() => {});
      }
    } finally {
      onLeave();
    }
  }, [call, onLeave]);

  // ── Chat client — same token works for both Video + Chat SDKs ──
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    const client = StreamChat.getInstance(apiKey);
    let active = true;

    client
      .connectUser(
        {
          id: currentUser.id,
          name: currentUser.name,
          image: currentUser.imageUrl,
        },
        token
      )
      .then(() => {
        if (active) {
          setChatClient(client);
        }
      })
      .catch(console.error);

    return () => {
      active = false;
      // Delay disconnect to let components unmount cleanly
      setTimeout(() => {
        client.disconnectUser().catch(() => {});
      }, 500);
    };
  }, [apiKey, token, currentUser]);

  const [chatChannel, setChatChannel] = useState(null);

  useEffect(() => {
    if (!chatClient) return;

    const channel = chatClient.channel("messaging", callId, {
      name: "Interview Chat",
      members: [
        booking.interviewer.clerkUserId,
        booking.interviewee.clerkUserId,
      ],
    });

    channel
      .watch()
      .then(() => setChatChannel(channel))
      .catch(console.error);

    return () => {
      // Clear state immediately to trigger component unmounting before client disconnect
      setChatChannel(null);
    };
  }, [chatClient, callId, booking]);

  if (callingState === CallingState.LEFT) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-3">
        <p className="text-stone-400 text-sm">Leaving call…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[92vh] bg-[#0a0a0b] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-white/10 text-stone-500 text-xs"
          >
            {booking.interviewer.name}
            <span className="text-stone-700 mx-1.5">×</span>
            {booking.interviewee.name}
          </Badge>
          {isInterviewer && (
            <Badge
              variant="outline"
              className="border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs"
            >
              Interviewer
            </Badge>
          )}
        </div>
      </div>

      {/* Media Error Banners */}
      {mediaError && (mediaError.audio || mediaError.video) ? (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex flex-col gap-1.5 shrink-0">
          {mediaError.audio === "system-denied" && (
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <AlertTriangle size={14} className="shrink-0" />
              <span>
                <strong>Microphone Blocked by System:</strong> Access was denied by your operating system or browser settings. Please enable microphone permissions in your system settings (Windows Privacy settings or macOS System Settings) and browser site settings, then refresh the page.
              </span>
            </div>
          )}
          {mediaError.audio === "denied" && (
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <AlertTriangle size={14} className="shrink-0" />
              <span>
                <strong>Microphone Blocked:</strong> Site permission was denied. Please allow microphone access in your browser settings (click the lock icon in the address bar), then refresh the page.
              </span>
            </div>
          )}
          {mediaError.audio === "missing" && (
            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <AlertTriangle size={14} className="shrink-0 text-stone-500" />
              <span>No microphone device was detected. Please connect a microphone to join with audio.</span>
            </div>
          )}
          {mediaError.video === "system-denied" && (
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <AlertTriangle size={14} className="shrink-0" />
              <span>
                <strong>Camera Blocked by System:</strong> Access was denied by your operating system or browser settings. Please enable camera permissions in your system settings (Windows Privacy settings or macOS System Settings) and browser site settings, then refresh the page.
              </span>
            </div>
          )}
          {mediaError.video === "denied" && (
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <AlertTriangle size={14} className="shrink-0" />
              <span>
                <strong>Camera Blocked:</strong> Site permission was denied. Please allow camera access in your browser settings (click the lock icon in the address bar), then refresh the page.
              </span>
            </div>
          )}
          {mediaError.video === "missing" && (
            <div className="flex items-center gap-2 text-stone-400 text-xs">
              <AlertTriangle size={14} className="shrink-0 text-stone-500" />
              <span>No camera device was detected. Please connect a camera to join with video.</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Body: video + side panel */}
      <div className="flex flex-1 min-h-0">
        {/* ── LEFT: Video ── */}
        <div className="flex flex-col flex-1 min-w-0">
          <StreamTheme>
            <SpeakerLayout participantBarPosition="bottom" />
            <CallControls onLeave={handleLeave} />
          </StreamTheme>
        </div>

        {/* ── RIGHT: Chat / AI panel ── */}
        <div className="w-85 shrink-0 flex flex-col border-l border-white/8 bg-[#0a0a0b]">
          {/* Tab switcher */}
          <div className="flex border-b border-white/8 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
                activeTab === "chat"
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              <MessageSquare size={13} />
              Chat
            </button>

            {/* AI Questions tab — interviewer only */}
            {isInterviewer && (
              <button
                type="button"
                onClick={() => setActiveTab("ai")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
                  activeTab === "ai"
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                <Sparkles size={13} />
                AI Questions
              </button>
            )}
          </div>

          {/* Panel content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTab === "chat" ? (
              chatClient && chatChannel ? (
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={chatChannel} doMarkReadRequest={() => Promise.resolve()}>
                    <Window>
                      <MessageList />
                      <MessageInput focus />
                    </Window>
                  </Channel>
                </Chat>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={18} className="text-stone-600 animate-spin" />
                </div>
              )
            ) : (
              <div className="p-4 h-full overflow-y-scroll max-h-screen">
                <AIQuestionsPanel categories={booking.categories} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
