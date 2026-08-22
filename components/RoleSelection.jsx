"use client";

import * as React from "react";
import Link from "next/link";
import { EmberTitle, SectionLabel } from "./reusables";
import { ArrowRight, Bot, GraduationCap, Coins, Calendar, CheckSquare, Sparkles } from "lucide-react";
import { AnimateInView } from "./motion/AnimateInView";
import { LOGOS } from "@/lib/data";
import LogoMarquee from "./LogoMarquee";

/* ── Mock UI widgets for Interviewee card ── */
function MockFeedbackWidget() {
  return (
    <div
      className="mt-6 p-4 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e8e8e8",
      }}
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#828282]">Gemini Feedback</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">9.2 / 10</span>
      </div>
      <p className="text-xs font-semibold text-[#202020]">System Design: Microservices</p>
      <p className="text-[11px] text-[#4d4d4d] leading-relaxed">
        &ldquo;Excellent explanation of database partitioning, but could detail the failover strategy more.&rdquo;
      </p>
      <div className="flex gap-1.5 mt-1">
        <span className="text-[9px] px-2 py-0.5 bg-[#f5f5f5] text-[#828282] rounded">Communication: Excellent</span>
        <span className="text-[9px] px-2 py-0.5 bg-[#f5f5f5] text-[#828282] rounded">DSA: Strong</span>
      </div>
    </div>
  );
}

/* ── Mock UI widgets for Interviewer card ── */
function MockEarningsWidget() {
  return (
    <div
      className="mt-6 p-4 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e8e8e8",
      }}
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#828282]">Earnings Dashboard</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff682c]/10 text-[#ff682c] font-bold">Payout Ready</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="p-2 bg-[#f5f5f5] rounded">
          <p className="text-[9px] text-[#828282]">Total Earned</p>
          <p className="text-sm font-bold text-[#202020] flex items-center gap-1 mt-0.5">
            <Coins size={12} className="text-[#ff682c]" /> 180 Cr
          </p>
        </div>
        <div className="p-2 bg-[#f5f5f5] rounded">
          <p className="text-[9px] text-[#828282]">Slots Booked</p>
          <p className="text-sm font-bold text-[#202020] flex items-center gap-1 mt-0.5">
            <Calendar size={12} className="text-[#816729]" /> 12 Sessions
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] mt-1 text-[#4d4d4d]">
        <span>Platform fee: 20%</span>
        <span className="text-[#ff682c] font-medium">Withdraw balance →</span>
      </div>
    </div>
  );
}

export default function RoleSelection() {
  return (
    <main className="min-h-[90vh] flex flex-col items-center justify-center bg-white text-graphite px-6 py-20">
      <div className="w-full max-w-4xl text-center">
        {/* Label */}
        <AnimateInView variant="scaleIn" duration={0.4}>
          <SectionLabel>Welcome to Calibrate</SectionLabel>
        </AnimateInView>

        {/* Title */}
        <AnimateInView variant="fadeUp" delay={0.08} duration={0.5}>
          <h1
            className="mt-2 mb-4"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontWeight: "bold",
              fontSize: "clamp(2.2rem, 5.5vw, 3.25rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#202020",
            }}
          >
            How would you like to use <EmberTitle>Calibrate?</EmberTitle>
          </h1>
        </AnimateInView>

        {/* Subtext */}
        <AnimateInView variant="fadeUp" delay={0.16} duration={0.45}>
          <p className="text-sm max-w-md mx-auto mb-16" style={{ color: "#828282" }}>
            Select your role to continue. Once chosen, your role is locked to your account email and cannot be changed later.
          </p>
        </AnimateInView>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
          {/* Card 1: Interviewee */}
          <AnimateInView variant="fadeLeft" delay={0.24} duration={0.5}>
            <div
              className="relative p-8 h-full flex flex-col border border-[#e8e8e8] transition-all duration-300 hover:border-[#ff682c] group"
              style={{
                background: "#efefef",
                borderRadius: "6px 0px 6px 6px", // Signature asymmetric radius
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center mb-6"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                  color: "#ff682c",
                }}
              >
                <GraduationCap size={22} />
              </div>
              <h3
                className="text-xl mb-2"
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontWeight: "bold",
                  letterSpacing: "-0.02em",
                  color: "#202020",
                }}
              >
                I want to Practice
              </h3>
              <p className="text-xs leading-relaxed text-[#4d4d4d]">
                Book 1:1 mock interviews with senior engineers, get real feedback, generated questions, and land your dream job.
              </p>

              {/* Rich Preview UI Widget */}
              <MockFeedbackWidget />

              <div className="flex flex-col gap-3 mt-8 pt-4 border-t border-[#e8e8e8]">
                <Link href="/sign-up?role=interviewee">
                  <button className="v-btn-primary w-full flex items-center justify-center gap-2">
                    Practice Now <ArrowRight size={15} />
                  </button>
                </Link>
                <Link href="/sign-in?role=interviewee" className="text-xs text-center hover:underline" style={{ color: "#828282" }}>
                  Already registered? Sign in
                </Link>
              </div>
            </div>
          </AnimateInView>

          {/* Card 2: Interviewer */}
          <AnimateInView variant="fadeRight" delay={0.24} duration={0.5}>
            <div
              className="relative p-8 h-full flex flex-col border border-[#e8e8e8] transition-all duration-300 hover:border-[#816729] group"
              style={{
                background: "#efefef",
                borderRadius: "8px", // Standard radius
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center mb-6"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                  color: "#816729",
                }}
              >
                <Bot size={22} />
              </div>
              <h3
                className="text-xl mb-2"
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontWeight: "bold",
                  letterSpacing: "-0.02em",
                  color: "#202020",
                }}
              >
                I want to Interview
              </h3>
              <p className="text-xs leading-relaxed text-[#4d4d4d]">
                Share your engineering expertise, set your own rates and availability, conduct mock sessions, and earn credits.
              </p>

              {/* Rich Preview UI Widget */}
              <MockEarningsWidget />

              <div className="flex flex-col gap-3 mt-8 pt-4 border-t border-[#e8e8e8]">
                <Link href="/sign-up?role=interviewer">
                  <button
                    className="v-btn-ghost w-full flex items-center justify-center gap-2 hover:bg-[#816729] hover:border-[#816729]"
                    style={{ border: "1px solid #202020" }}
                  >
                    Start Interviewing <ArrowRight size={15} />
                  </button>
                </Link>
                <Link href="/sign-in?role=interviewer" className="text-xs text-center hover:underline" style={{ color: "#828282" }}>
                  Already registered? Sign in
                </Link>
                <Link href="/?view=interviewer" className="text-xs text-center hover:underline mt-1 font-semibold" style={{ color: "#816729" }}>
                  Learn more about interviewing →
                </Link>
              </div>
            </div>
          </AnimateInView>
        </div>

        {/* Logo Marquee banner */}
        <div className="w-full mt-16 pt-10 border-t border-[#e8e8e8] overflow-hidden">
          <p
            className="text-center text-xs tracking-wider uppercase font-semibold mb-6"
            style={{ color: "#816729", fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            Calibrate interviewers work at top engineering teams
          </p>
          <LogoMarquee logos={LOGOS} />
        </div>
      </div>
    </main>
  );
}
