"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AI_TAGS, AVATARS, LOGOS, ROLES } from "@/lib/data";
import {
  EmberTitle,
  SectionHeading,
  SectionLabel,
} from "@/components/reusables";
import {
  Bot,
  Wallet,
  Video,
  MessageSquare,
  Shield,
  BarChart3,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import PricingSection from "@/components/PricingSection";
import { AnimateInView } from "@/components/motion/AnimateInView";
import { FloatCard } from "@/components/motion/FloatCard";
import LogoMarquee from "@/components/LogoMarquee";

/* ── Ventriloc-style feature card ── */
function FeatureCard({ icon, title, desc, children, featured = false }) {
  return (
    <div
      className="relative flex flex-col p-9 h-full v-hover-lift animate-all duration-300"
      style={{
        background: "#efefef",
        borderRadius: featured ? "6px 0px 0px 0px" : "8px",
        transition: "transform 0.22s cubic-bezier(0.25,0.1,0.25,1)",
      }}
    >
      <span
        className="w-10 h-10 flex items-center justify-center mb-5 shrink-0"
        style={{
          background: "#ffffff",
          border: "1px solid #e8e8e8",
          borderRadius: "8px",
        }}
      >
        {icon}
      </span>

      <h3
        className="text-lg mb-2"
        style={{
          fontFamily: "var(--font-polysans)",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "#202020",
        }}
      >
        {title}
      </h3>

      <p className="text-sm leading-relaxed" style={{ color: "#4d4d4d" }}>
        {desc}
      </p>

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

/* ── Data widget mock ── */
function CreditWidget() {
  return (
    <div
      className="mt-5 p-5 flex justify-between items-end"
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e8e8e8",
      }}
    >
      <div>
        <p className="text-xs mb-1" style={{ color: "#828282" }}>Your balance</p>
        <p
          className="text-4xl leading-none"
          style={{
            fontFamily: "var(--font-polysans)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#ff682c",
          }}
        >
          28
        </p>
        <p className="text-xs mt-1" style={{ color: "#828282" }}>credits remaining</p>
      </div>
      <Badge variant="brass">+10 this month</Badge>
    </div>
  );
}

/* ── Slot grid mock ── */
function SlotMock() {
  const slots = [
    { label: "10:00 AM", free: true },
    { label: "11:30 AM", free: false },
    { label: "2:00 PM", free: true },
    { label: "3:30 PM", free: true },
    { label: "5:00 PM", free: false },
    { label: "6:30 PM", free: true },
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-5">
      {slots.map((s) => (
        <span
          key={s.label}
          className="text-xs px-3 py-1.5"
          style={{
            borderRadius: "20px",
            border: `1px solid ${s.free ? "#202020" : "#e8e8e8"}`,
            background: s.free ? "#202020" : "#f5f5f5",
            color: s.free ? "#ffffff" : "#828282",
            fontFamily: "var(--font-inter)",
          }}
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}

const STEPS = [
  {
    step: "01",
    title: "Create profile",
    desc: "Set your experience, domains, bio, and hourly rates in credits.",
  },
  {
    step: "02",
    title: "Set schedule",
    desc: "Input availability slots once. Users can select and book with one click.",
  },
  {
    step: "03",
    title: "Conduct call",
    desc: "Join the HD video call, use AI-generated questions, and give feedback.",
  },
  {
    step: "04",
    title: "Get paid",
    desc: "Earn credits for every session. Withdraw your balance any time.",
  },
];

function LandingPageContent() {
  const searchParams = useSearchParams();
  const initialView = searchParams.get("view") === "interviewer" ? "interviewer" : "candidate";
  const [view, setView] = useState(initialView);

  useEffect(() => {
    const param = searchParams.get("view");
    if (param === "interviewer") {
      setTimeout(() => { setView("interviewer"); }, 0);
    } else if (param === "candidate") {
      setTimeout(() => { setView("candidate"); }, 0);
    }
  }, [searchParams]);

  const isCandidate = view === "candidate";

  return (
    <div className="bg-white overflow-x-hidden pt-24 sm:pt-28">

      {/* ── HERO ── */}
      <section className="pt-8 sm:pt-12 pb-20 px-4 sm:px-6" key={view}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: headline + CTAs */}
          <div className="flex flex-col gap-0">
            <AnimateInView variant="scaleIn" delay={0} duration={0.35}>
              <Badge variant="brass" className="w-fit mb-6">
                {isCandidate ? "For Candidates" : "For Interviewers"}
              </Badge>
            </AnimateInView>

            <AnimateInView variant="fadeUp" delay={0.08} duration={0.55}>
              {isCandidate ? (
                <h1
                  style={{
                    fontFamily: "var(--font-polysans)",
                    fontWeight: 400,
                    fontSize: "clamp(2.5rem, 6vw, 4.125rem)",
                    lineHeight: 0.91,
                    letterSpacing: "-1.32px",
                    color: "#202020",
                  }}
                >
                  Ace your next<br />
                  interview with{" "}
                  <EmberTitle>real experts</EmberTitle>
                </h1>
              ) : (
                <h1
                  style={{
                    fontFamily: "var(--font-polysans)",
                    fontWeight: 400,
                    fontSize: "clamp(2.5rem, 6vw, 4.125rem)",
                    lineHeight: 0.91,
                    letterSpacing: "-1.32px",
                    color: "#202020",
                  }}
                >
                  Earn doing what<br />
                  you&apos;re <EmberTitle>great at</EmberTitle>
                </h1>
              )}
            </AnimateInView>

            <AnimateInView variant="fadeUp" delay={0.16} duration={0.5}>
              <p
                className="mt-8 text-base sm:text-lg leading-relaxed max-w-lg"
                style={{ color: "#4d4d4d" }}
              >
                {isCandidate ? (
                  "Book 1:1 mock interviews with senior engineers from top companies. Get AI-powered feedback, role-specific questions, and the confidence to land your dream job."
                ) : (
                  "Share your expertise with aspiring engineers. Set your own schedule, conduct mock interviews with AI-powered tools, and earn meaningful income — all on your terms."
                )}
              </p>
            </AnimateInView>

            <AnimateInView variant="fadeUp" delay={0.28} duration={0.45}>
              {isCandidate ? (
                <div
                  onClick={() => window.location.href = "/sign-up?role=interviewee"}
                  className="relative flex items-center bg-[#efefef] px-6 py-4 cursor-pointer mt-10 border border-[#e8e8e8] w-full max-w-md group hover:bg-[#f5f5f5] transition-all duration-200"
                  style={{ borderRadius: "8px" }}
                >
                  <span className="text-sm text-[#828282] group-hover:text-graphite transition-colors duration-200" style={{ fontFamily: "var(--font-inter)" }}>
                    Search 100+ experts (e.g. React, System Design, DSA...)
                  </span>
                  <span className="ml-auto text-xs text-[#816729] font-medium" style={{ fontFamily: "var(--font-polysans)", letterSpacing: "-0.02em" }}>
                    Browse →
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 mt-10">
                  <span className="px-4 py-2 text-xs bg-[#efefef] text-graphite border border-[#e8e8e8]" style={{ borderRadius: "20px", fontFamily: "var(--font-polysans)" }}>
                    ✦ Earn Credits
                  </span>
                  <span className="px-4 py-2 text-xs bg-[#efefef] text-graphite border border-[#e8e8e8]" style={{ borderRadius: "20px", fontFamily: "var(--font-polysans)" }}>
                    ✦ AI Co-Pilot during Calls
                  </span>
                  <span className="px-4 py-2 text-xs bg-[#efefef] text-[#ff682c] border border-[#e8e8e8] font-medium" style={{ borderRadius: "20px", fontFamily: "var(--font-polysans)" }}>
                    ✦ Flexible Availability
                  </span>
                </div>
              )}
            </AnimateInView>

            {/* Social proof */}
            <AnimateInView variant="fadeUp" delay={0.36} duration={0.45}>
              <div className="flex items-center gap-4 mt-10">
                <div className="flex">
                  {AVATARS.map((av, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white overflow-hidden${i > 0 ? " -ml-2" : ""}`}
                    >
                      <Image
                        src={av.src}
                        alt="user avatar"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm" style={{ color: "#4d4d4d" }}>
                  <strong style={{ color: "#202020", fontWeight: 500 }}>2,400+ engineers</strong>{" "}
                  cracked FAANG interviews via Calibrate
                </p>
              </div>
            </AnimateInView>
          </div>

          {/* Right: floating data dashboard cards */}
          <div className="hidden lg:flex flex-col gap-4">
            <FloatCard amplitude={7} speed={0.5} delay={0}>
              <div
                className="p-8"
                style={{
                  background: "#efefef",
                  borderRadius: "20px",
                }}
              >
                <p className="text-xs mb-1 v-label">Sessions completed</p>
                <p
                  className="text-5xl mt-3"
                  style={{
                    fontFamily: "var(--font-polysans)",
                    fontWeight: 400,
                    letterSpacing: "-1.32px",
                    lineHeight: 0.91,
                    color: "#202020",
                  }}
                >
                  2,847
                </p>
                <div className="flex gap-2 mt-5">
                  <Badge variant="secondary">↑ 18% this month</Badge>
                  <Badge variant="outline">Live matching</Badge>
                </div>
              </div>
            </FloatCard>

            <div className="grid grid-cols-2 gap-4">
              <FloatCard amplitude={5} speed={0.45} delay={0.5}>
                <div
                  className="p-6"
                  style={{ background: "#ffffff", border: "1px solid #e8e8e8", borderRadius: "8px" }}
                >
                  <p className="text-xs v-label">Avg. rating</p>
                  <p
                    className="text-3xl mt-2"
                    style={{
                      fontFamily: "var(--font-polysans)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      color: "#ff682c",
                    }}
                  >
                    4.9
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#828282" }}>out of 5.0</p>
                </div>
              </FloatCard>

              <FloatCard amplitude={6} speed={0.55} delay={1}>
                <div
                  className="p-6"
                  style={{ background: "#ebe6dd", borderRadius: "8px" }}
                >
                  <p className="text-xs v-label">Companies hired from</p>
                  <p
                    className="text-3xl mt-2"
                    style={{
                      fontFamily: "var(--font-polysans)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      color: "#202020",
                    }}
                  >
                    80+
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#816729" }}>FAANG & beyond</p>
                </div>
              </FloatCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS — marquee ── */}
      <section className="py-14 border-y border-mist overflow-hidden" style={{ background: "#efefef" }} key={`logos-${view}`}>
        <div className="max-w-[1200px] mx-auto px-6 mb-6">
          <AnimateInView variant="fade" duration={0.5}>
            <p className="text-center text-xs v-label" style={{ color: "#816729" }}>
              {isCandidate ? "Interviewees landed roles at" : "Calibrate interviewers work at top engineering teams"}
            </p>
          </AnimateInView>
        </div>
        <LogoMarquee logos={LOGOS} />
      </section>

      {/* ── FEATURES — White section ── */}
      <section className="py-24 max-w-[1200px] mx-auto px-6" key={`features-${view}`}>
        <AnimateInView variant="fadeUp" duration={0.5}>
          <div className="text-center mb-16">
            <SectionLabel>Features</SectionLabel>
            <SectionHeading
              main="Everything you need,"
              accent={isCandidate ? "nothing you don't" : "conduct stellar mock calls"}
            />
          </div>
        </AnimateInView>

        <div className="grid grid-cols-12 gap-4">
          {/* Big card — asymmetric radius */}
          <AnimateInView variant="fadeUp" delay={0.05} duration={0.45} className="col-span-12 md:col-span-7">
            <FeatureCard
              featured
              icon={<Bot size={18} style={{ color: "#ff682c" }} />}
              title="AI Question Generator"
              desc="Interviewers get a live AI co-pilot generating role-specific questions on demand — system design, behavioural, DSA — all tailored to the candidate's level."
            >
              <div className="flex flex-wrap gap-2">
                {AI_TAGS.map((t) => (
                  <Badge key={t.label} variant={t.active ? "default" : "outline"}>
                    {t.label}
                  </Badge>
                ))}
              </div>
            </FeatureCard>
          </AnimateInView>

          <AnimateInView variant="fadeUp" delay={0.12} duration={0.45} className="col-span-12 md:col-span-5">
            <FeatureCard
              icon={<Wallet size={16} style={{ color: "#202020" }} />}
              title="Credit System"
              desc={isCandidate
                ? "Subscribe for monthly credits. Book sessions. Interviewers earn and withdraw any time."
                : "Candidates book sessions using credits. Interviewers earn directly from every scheduled booking and can request payouts at any time."
              }
            >
              <CreditWidget />
            </FeatureCard>
          </AnimateInView>

          <AnimateInView variant="fadeUp" delay={0.18} duration={0.45} className="col-span-12 md:col-span-4">
            <FeatureCard
              icon={<Video size={16} style={{ color: "#202020" }} />}
              title="HD Video Calls"
              desc="Powered by Stream. Screen sharing, recording, and instant playback links — all built in."
            />
          </AnimateInView>

          <AnimateInView variant="fadeUp" delay={0.24} duration={0.45} className="col-span-12 md:col-span-4">
            <FeatureCard
              icon={<MessageSquare size={16} style={{ color: "#202020" }} />}
              title="Persistent Chat"
              desc="Message your interviewer before and after the call. Share resources, prep notes, and follow-ups in one thread."
            />
          </AnimateInView>

          <AnimateInView variant="fadeUp" delay={0.30} duration={0.45} className="col-span-12 md:col-span-4">
            <FeatureCard
              icon={<Shield size={16} style={{ color: "#202020" }} />}
              title="Security by Arcjet"
              desc="Bot protection, rate limiting, and abuse prevention baked into every API route."
            />
          </AnimateInView>

          <AnimateInView variant="fadeUp" delay={0.36} duration={0.45} className="col-span-12 md:col-span-6">
            <FeatureCard
              icon={<BarChart3 size={16} style={{ color: "#ff682c" }} />}
              title="AI Feedback Reports"
              desc="Post-interview analysis by Gemini with actionable insights across communication, problem-solving, and clarity."
            />
          </AnimateInView>

          <AnimateInView variant="fadeUp" delay={0.42} duration={0.45} className="col-span-12 md:col-span-6">
            <FeatureCard
              icon={<Calendar size={16} style={{ color: "#202020" }} />}
              title="Slot-based Scheduling"
              desc="Interviewers set availability once. Interviewees pick from open slots and confirm with one click — no back-and-forth needed."
            >
              <SlotMock />
            </FeatureCard>
          </AnimateInView>
        </div>
      </section>

      {/* ── UNIQUE MIDDLE SECTION ── */}
      {isCandidate ? (
        /* ── ROLES — Ash section for Candidates ── */
        <section className="py-24 px-6" style={{ background: "#efefef" }} key="section-roles">
          <div className="max-w-[1200px] mx-auto">
            <AnimateInView variant="fadeUp" duration={0.5}>
              <div className="text-center mb-16">
                <SectionLabel>Who it&apos;s for</SectionLabel>
                <SectionHeading main="Built for both sides" accent="of the table" />
              </div>
            </AnimateInView>

            <div className="grid md:grid-cols-2 gap-4">
              {ROLES.map((role, i) => (
                <AnimateInView
                  key={role.label}
                  variant={i === 0 ? "fadeLeft" : "fadeRight"}
                  delay={i * 0.12}
                  duration={0.5}
                >
                  <div
                    className="relative p-10 sm:p-12 flex flex-col h-full v-hover-lift"
                    style={{
                      background: "#ffffff",
                      borderRadius: i === 0 ? "6px 0px 0px 0px" : "8px",
                    }}
                  >
                    <span
                      className="w-fit text-xs font-medium tracking-[0.08em] uppercase px-3 py-1.5 mb-6"
                      style={{
                        borderRadius: "20px",
                        border: "1px solid #e8e8e8",
                        background: "#f5f5f5",
                        color: "#816729",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {role.label}
                    </span>

                    <h3
                      className="text-2xl mb-4"
                      style={{
                        fontFamily: "var(--font-polysans)",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                        color: "#202020",
                      }}
                    >
                      {role.title}
                    </h3>

                    <p className="text-sm leading-relaxed mb-8" style={{ color: "#4d4d4d" }}>
                      {role.desc}
                    </p>

                    <ul className="space-y-3 mt-auto">
                      {role.perks.map((p) => (
                        <li key={p} className="flex gap-3 text-sm" style={{ color: "#4d4d4d" }}>
                          <span
                            className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center text-xs"
                            style={{
                              border: "1px solid #e8e8e8",
                              borderRadius: "4px",
                              color: "#ff682c",
                            }}
                          >
                            ✓
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateInView>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* ── HOW IT WORKS — Ash section for Interviewers ── */
        <section className="py-24" style={{ background: "#efefef" }} key="section-steps">
          <div className="max-w-[1200px] mx-auto px-6">
            <AnimateInView variant="fadeUp" duration={0.5}>
              <div className="text-center mb-16">
                <SectionLabel>Process</SectionLabel>
                <SectionHeading main="Simple steps to" accent="start earning" />
              </div>
            </AnimateInView>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((s, i) => (
                <AnimateInView key={s.step} variant="fadeUp" delay={i * 0.08} duration={0.45}>
                  <div
                    className="p-8 h-full flex flex-col gap-6"
                    style={{
                      background: "#ffffff",
                      borderRadius: i === 0 ? "6px 0px 0px 0px" : "8px",
                      border: "1px solid #e8e8e8",
                    }}
                  >
                    <span
                      className="shrink-0 w-12 h-12 flex items-center justify-center text-lg font-serif"
                      style={{
                        background: "#efefef",
                        borderRadius: "8px",
                        color: "#ff682c",
                        fontFamily: "var(--font-polysans)",
                        fontWeight: "bold",
                      }}
                    >
                      {s.step}
                    </span>
                    <div>
                      <h3
                        className="text-lg mb-1 font-bold"
                        style={{
                          fontFamily: "var(--font-polysans)",
                          color: "#202020",
                        }}
                      >
                        {s.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#4d4d4d" }}>
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </AnimateInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRICING — White section (Only for Candidates) ── */}
      {isCandidate && (
        <section className="py-24 max-w-[1200px] mx-auto px-6" key="pricing-candidate">
          <AnimateInView variant="fadeUp" duration={0.5}>
            <div className="text-center mb-16">
              <SectionLabel>Pricing</SectionLabel>
              <SectionHeading main="Simple, transparent" accent="credit-based plans" />
              <p className="mt-3 text-sm" style={{ color: "#828282" }}>
                Each credit = one session. Unused credits roll over.
              </p>
            </div>
          </AnimateInView>
          <AnimateInView variant="fadeUp" delay={0.1} duration={0.5}>
            <PricingSection />
          </AnimateInView>
        </section>
      )}

      {/* ── CTA — Ivory section ── */}
      <section className="py-24 px-6" style={{ background: "#ebe6dd" }} key={`cta-${view}`}>
        <div className="max-w-[1200px] mx-auto text-center">
          <AnimateInView variant="fadeUp" duration={0.55}>
            {isCandidate ? (
              <h2
                style={{
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  lineHeight: 0.91,
                  letterSpacing: "-1.32px",
                  color: "#202020",
                }}
              >
                Your next interview<br />
                <EmberTitle>starts here</EmberTitle>
              </h2>
            ) : (
              <h2
                style={{
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  lineHeight: 0.91,
                  letterSpacing: "-1.32px",
                  color: "#202020",
                }}
              >
                Ready to share<br />
                your <EmberTitle>expertise?</EmberTitle>
              </h2>
            )}
          </AnimateInView>

          <AnimateInView variant="fadeUp" delay={0.1} duration={0.45}>
            <p className="mt-6 text-sm" style={{ color: "#4d4d4d" }}>
              {isCandidate
                ? "Join thousands of engineers already levelling up on Calibrate."
                : "Join Calibrate as an interviewer and start earning today."
              }
            </p>
          </AnimateInView>

          <AnimateInView variant="scaleIn" delay={0.2} duration={0.4}>
            <div className="flex justify-center mt-10">
              {isCandidate ? (
                <Link href="/sign-up?role=interviewee">
                  <Button variant="default" size="hero">
                    Practice Now <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-up?role=interviewer">
                  <Button variant="default" size="hero">
                    Create Interviewer Profile <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </AnimateInView>
        </div>
      </section>
    </div>
  );
}

export default function InteractiveLandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white text-graphite">
        <p className="text-sm animate-pulse">Loading Calibrate...</p>
      </div>
    }>
      <LandingPageContent />
    </Suspense>
  );
}
