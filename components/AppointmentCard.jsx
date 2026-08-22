"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, Sparkles } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";
import { formatDate, formatDuration, formatTime } from "@/lib/helpers";
import { RATING_LABEL, RATING_STYLES, STATUS_STYLES } from "@/lib/data";

export function AppointmentCard({ booking, mode, isPast = false }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { has } = useAuth();

  const {
    startTime,
    endTime,
    status,
    creditsCharged,
    streamCallId,
    recordingUrl,
    feedback,
  } = booking;

  const person =
    mode === "interviewer" ? booking.interviewee : booking.interviewer;

  const creditsLabel =
    mode === "interviewer"
      ? `+${creditsCharged} credits earned`
      : `−${creditsCharged} credits`;

  const creditsVariant = mode === "interviewer" ? "success" : "outline";
  const isUpcoming = status === "SCHEDULED";

  return (
    <>
      <FeedbackModal
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        feedback={feedback}
        intervieweeName={
          mode === "interviewer" ? booking.interviewee?.name : undefined
        }
      />

      <article
        className="flex flex-col gap-6 self-start transition-colors duration-200 hover:bg-fog p-7"
        style={{ background: "#efefef", borderRadius: "8px" }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar
              className="w-14 h-14 shrink-0"
              style={{ borderRadius: "8px", border: "1px solid #e8e8e8" }}
            >
              <AvatarImage
                src={person?.imageUrl}
                alt={person?.name}
                style={{ borderRadius: "8px" }}
              />
              <AvatarFallback
                style={{
                  borderRadius: "8px",
                  background: "#f5f5f5",
                  color: "#202020",
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  fontSize: "18px",
                }}
              >
                {person?.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 min-w-0">
              <p
                className="text-base leading-tight truncate"
                style={{
                  color: "#202020",
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                {person?.name ?? "—"}
              </p>
              {person?.title && person?.company ? (
                <p className="text-xs truncate" style={{ color: "#828282" }}>
                  {person.title}
                  <span className="mx-1.5" style={{ color: "#e8e8e8" }}>·</span>
                  {person.company}
                </p>
              ) : (
                <p className="text-xs truncate" style={{ color: "#828282" }}>
                  {person?.email}
                </p>
              )}
              {mode === "interviewee" && person?.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {person.categories.slice(0, 3).map((cat) => (
                    <Badge key={cat} variant="ghost">
                      {cat.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge variant="outline" className={STATUS_STYLES[status]}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </Badge>
            <Badge variant={creditsVariant}>
              {creditsLabel}
            </Badge>
          </div>
        </div>

        <div className="h-px" style={{ background: "#e8e8e8" }} />

        {/* Time grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { Icon: Calendar, label: "Date", value: formatDate(startTime) },
            {
              Icon: Clock,
              label: "Time",
              value: `${formatTime(startTime)} – ${formatTime(endTime)}`,
            },
            {
              Icon: Video,
              label: "Duration",
              value: formatDuration(startTime, endTime),
            },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5" style={{ color: "#828282" }}>
                <Icon size={11} />
                <span
                  className="text-[10px] font-medium tracking-[0.08em] uppercase"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {label}
                </span>
              </div>
              <p className="text-sm" style={{ color: "#202020" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* AI feedback snippet */}
        {feedback?.summary && (
          <div
            className="px-4 py-3 flex flex-col gap-1.5"
            style={{
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e8e8e8",
            }}
          >
            <p
              className="text-[10px] font-medium tracking-[0.08em] uppercase"
              style={{ color: "#816729", fontFamily: "var(--font-inter)" }}
            >
              AI Feedback
            </p>
            <p
              className="text-xs leading-relaxed line-clamp-2"
              style={{ color: "#4d4d4d" }}
            >
              {feedback.summary}
            </p>
          </div>
        )}

        {(streamCallId || recordingUrl || feedback) && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {!isPast && streamCallId && isUpcoming && (
              <Link
                href={`/call/${streamCallId}`}
                className="inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 text-center py-2 px-4 border text-xs text-white"
                style={{
                  borderRadius: "0px",
                  borderColor: "#202020",
                  background: "#202020",
                  fontFamily: "var(--font-polysans)",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.2",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#333333";
                  e.currentTarget.style.borderColor = "#333333";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#202020";
                  e.currentTarget.style.borderColor = "#202020";
                }}
              >
                <Video size={13} />
                Join call
              </Link>
            )}

            {recordingUrl && has?.({ plan: "pro" }) && (
              <a
                href={recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 text-center py-2 px-4 border text-xs"
                style={{
                  borderRadius: "0px",
                  borderColor: "#202020",
                  color: "#202020",
                  background: "transparent",
                  fontFamily: "var(--font-polysans)",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.2",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#202020";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#202020";
                }}
              >
                📹 Recording
              </a>
            )}

            {feedback &&
              (has?.({ plan: "starter" }) || has?.({ plan: "pro" })) && (
                <>
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 text-center py-2 px-4 border text-xs"
                    style={{
                      borderRadius: "0px",
                      borderColor: "#ff682c",
                      color: "#ff682c",
                      background: "transparent",
                      fontFamily: "var(--font-polysans)",
                      letterSpacing: "-0.02em",
                      lineHeight: "1.2",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 104, 44, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Sparkles size={12} />
                    Full Feedback
                  </button>
                  <Badge variant="brass">
                    ✦ {RATING_LABEL[feedback.overallRating]} performance
                  </Badge>
                </>
              )}
          </div>
        )}
      </article>
    </>
  );
}
