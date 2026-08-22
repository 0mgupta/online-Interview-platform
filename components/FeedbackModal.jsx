"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  MessageSquare,
  Brain,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { RATING_CONFIG } from "@/lib/data";

export function FeedbackModal({
  open,
  onOpenChange,
  feedback,
  intervieweeName,
}) {
  if (!feedback) return null;

  const rating = RATING_CONFIG[feedback.overallRating];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] overflow-y-auto"
        style={{
          background: "#ffffff",
          border: "1px solid #e8e8e8",
          color: "#202020",
          borderRadius: "8px",
        }}
      >
        <DialogHeader className="relative">
          <DialogTitle
            style={{
              fontFamily: "var(--font-polysans)",
              fontWeight: 400,
              fontSize: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            AI Feedback Report
          </DialogTitle>

          {intervieweeName && (
            <p className="text-xs mt-1" style={{ color: "#828282" }}>
              Performance analysis for {intervieweeName}
            </p>
          )}
        </DialogHeader>

        <div className="relative flex flex-col gap-5 mt-2">
          {/* Rating banner */}
          <div
            className="p-6 flex items-center justify-between"
            style={{
              background: "#efefef",
              borderRadius: "8px",
            }}
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "#816729", fontFamily: "var(--font-inter)" }}
              >
                Overall rating
              </p>
              <p
                className="text-2xl mt-1"
                style={{
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#ff682c",
                }}
              >
                {rating.label}
              </p>
            </div>

            <span className="text-3xl">{rating.emoji}</span>
          </div>

          {/* Summary */}
          <div
            className="p-5"
            style={{
              background: "#ffffff",
              border: "1px solid #e8e8e8",
              borderRadius: "8px",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} className="text-graphite" />
              <p
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "#828282", fontFamily: "var(--font-inter)" }}
              >
                Summary
              </p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#4d4d4d" }}>
              {feedback.summary}
            </p>
          </div>

          {/* Recommendation */}
          <div
            className="p-5"
            style={{
              background: "#ffffff",
              border: "1px solid #e8e8e8",
              borderRadius: "8px",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-widest mb-2"
              style={{ color: "#828282", fontFamily: "var(--font-inter)" }}
            >
              Recommendation
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#4d4d4d" }}>
              {feedback.recommendation}
            </p>
          </div>

          {/* Sections */}
          <div className="grid gap-3">
            {[
              {
                icon: <Brain size={13} className="text-graphite" />,
                label: "Technical",
                value: feedback.technical,
              },
              {
                icon: <MessageSquare size={13} className="text-graphite" />,
                label: "Communication",
                value: feedback.communication,
              },
              {
                icon: <TrendingUp size={13} className="text-graphite" />,
                label: "Problem Solving",
                value: feedback.problemSolving,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-5"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {item.icon}
                  <p
                    className="text-[10px] uppercase tracking-widest"
                    style={{ color: "#828282", fontFamily: "var(--font-inter)" }}
                  >
                    {item.label}
                  </p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#4d4d4d" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className="p-5"
              style={{
                background: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={13} className="text-green-600" />
                <p
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "#828282", fontFamily: "var(--font-inter)" }}
                >
                  Strengths
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {feedback.strengths?.map((s, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="justify-start whitespace-normal border-[#e8e8e8]"
                  >
                    ✓ {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div
              className="p-5"
              style={{
                background: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={13} className="text-[#ff682c]" />
                <p
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "#828282", fontFamily: "var(--font-inter)" }}
                >
                  To improve
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {feedback.improvements?.map((imp, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="justify-start whitespace-normal border-[#e8e8e8]"
                  >
                    ✓ {imp}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
