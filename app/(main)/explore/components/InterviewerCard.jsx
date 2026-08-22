'use client';

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABEL } from "@/lib/data";
import { formatTime } from "@/lib/helpers";
import { motion } from "motion/react";

export default function InterviewerCard({ interviewer, index = 0 }) {
  const {
    id,
    name,
    imageUrl,
    title,
    company,
    yearsExp,
    bio,
    categories,
    creditRate,
    availabilities,
  } = interviewer;
  const availability = availabilities?.[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -3 }}
      className="relative flex flex-col gap-5 p-7"
      style={{
        background: "#efefef",
        borderRadius: "8px",
        border: "none",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#efefef")}
    >
      {/* Top row — avatar + name + years */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            className="w-11 h-11 shrink-0"
            style={{ borderRadius: "8px", border: "1px solid #e8e8e8" }}
          >
            <AvatarImage src={imageUrl} alt={name} style={{ borderRadius: "8px" }} />
            <AvatarFallback
              style={{
                borderRadius: "8px",
                background: "#ffffff",
                color: "#202020",
                fontFamily: "var(--font-polysans)",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              {name?.[0] ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p
              className="text-sm leading-tight"
              style={{
                color: "#202020",
                fontFamily: "var(--font-polysans)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              {name}
            </p>
            {title && company && (
              <p className="text-xs mt-0.5" style={{ color: "#828282" }}>
                {title} · {company}
              </p>
            )}
          </div>
        </div>

        {yearsExp && (
          <Badge variant="outline">{yearsExp}+ yrs</Badge>
        )}
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#4d4d4d" }}>
          {bio}
        </p>
      )}

      {/* Categories */}
      {categories?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.slice(0, 4).map((cat) => (
            <span
              key={cat}
              className="text-xs px-2.5 py-1"
              style={{
                background: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: "20px",
                color: "#4d4d4d",
                fontFamily: "var(--font-inter)",
              }}
            >
              {CATEGORY_LABEL[cat] ?? cat}
            </span>
          ))}
          {categories.length > 4 && (
            <span
              className="text-xs px-2.5 py-1"
              style={{
                background: "transparent",
                border: "1px solid #e8e8e8",
                borderRadius: "20px",
                color: "#828282",
                fontFamily: "var(--font-inter)",
              }}
            >
              +{categories.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="h-px" style={{ background: "#e8e8e8" }} />

      {/* Bottom row — credit rate + availability + CTA */}
      <div className="flex items-center justify-between gap-3 mt-auto">
        <div className="flex flex-col gap-1">
          <p
            className="text-lg leading-none"
            style={{
              fontFamily: "var(--font-polysans)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#ff682c",
            }}
          >
            {creditRate ?? 10}
            <span className="text-xs font-sans ml-1" style={{ color: "#828282" }}>
              credits / session
            </span>
          </p>
          {availability ? (
            <p className="text-xs" style={{ color: "#828282" }}>
              🟢 {formatTime(availability.startTime)} –{" "}
              {formatTime(availability.endTime)}
            </p>
          ) : (
            <p className="text-xs" style={{ color: "#828282" }}>No availability set</p>
          )}
        </div>

        <Link
          href={`/interviewers/${id}`}
          className="px-4 py-2 border text-xs transition-all duration-200 cursor-pointer text-center"
          style={{
            borderColor: "#202020",
            color: "#202020",
            background: "transparent",
            borderRadius: "0px",
            fontFamily: "var(--font-polysans)",
            letterSpacing: "-0.02em",
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
          View profile →
        </Link>
      </div>
    </motion.article>
  );
}
