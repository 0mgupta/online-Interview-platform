'use client';

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import CreditButton from "./CreditButton";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * AnimatedHeader — client wrapper that provides:
 *  1. Slide-down entrance on mount
 *  2. Scroll-aware border/shadow upgrade
 *  3. Nav link hover shifts
 */
export default function AnimatedHeader({ user, roleRedirect }) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentView = searchParams.get("view") === "interviewer" ? "interviewer" : "candidate";
  const isExplore = pathname === "/explore";
  const isAppointments = pathname === "/appointments";

  const handleViewChange = (newView) => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      router.push(`/?view=${newView}`);
    } else {
      router.replace(`/?view=${newView}`, { scroll: false });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 inset-x-0 z-50 border-b backdrop-blur-sm"
      style={{
        background: scrolled ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.95)",
        borderColor: scrolled ? "#e8e8e8" : "#e8e8e8",
        boxShadow: scrolled ? "0 1px 0 0 #e8e8e8" : "none",
        transition: "background 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* 3-column layout */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-3 items-center px-4 sm:px-6 py-1.5">

        {/* Column 1: Brand logo */}
        <div className="flex justify-start">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Calibrate"
              width={150}
              height={50}
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </Link>
        </div>

        {roleRedirect}

        {/* Column 2: Centered Navigation Pill */}
        <div className="hidden md:flex justify-center">
          {mounted && (
            !user ? (
              <div
                className="flex items-center gap-1 bg-[#efefef] p-1 border border-[#e8e8e8]"
                style={{ borderRadius: "200px" }}
              >
                <button
                  onClick={() => handleViewChange("candidate")}
                  className={`px-4 py-1.5 text-xs font-light cursor-pointer transition-all duration-200 rounded-[200px] border-none outline-none ${
                    currentView === "candidate"
                      ? "bg-white text-graphite shadow-sm"
                      : "text-[#828282] hover:text-graphite"
                  }`}
                  style={{
                    fontFamily: "var(--font-polysans)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  I want to Practice
                </button>
                <button
                  onClick={() => handleViewChange("interviewer")}
                  className={`px-4 py-1.5 text-xs font-light cursor-pointer transition-all duration-200 rounded-[200px] border-none outline-none ${
                    currentView === "interviewer"
                      ? "bg-white text-graphite shadow-sm"
                      : "text-[#828282] hover:text-graphite"
                  }`}
                  style={{
                    fontFamily: "var(--font-polysans)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  I want to Interview
                </button>
              </div>
            ) : (
              <>

                {user.role === "INTERVIEWEE" && (
                  <div className="flex items-center gap-12">
                    <NavLink href="/explore" active={isExplore}>Explore</NavLink>
                    <NavLink href="/appointments" active={isAppointments}>My Appointments</NavLink>
                  </div>
                )}
              </>
            )
          )}
        </div>

        {/* Column 3: Right-aligned Actions */}
        <div className="flex justify-end items-center gap-3.5">
          {mounted && (
            <>
              {/* Mobile fallback nav */}
              <div className="flex md:hidden items-center gap-3 mr-2">
                {user && user.role === "INTERVIEWEE" && (
                  <NavLink href="/appointments" small>Sessions</NavLink>
                )}
              </div>

              {user && user.role !== "UNASSIGNED" ? (
                <>
                  <CreditButton
                    role={user.role === "INTERVIEWER" ? "INTERVIEWER" : "INTERVIEWEE"}
                    credits={
                      (user.role === "INTERVIEWER"
                        ? user.creditBalance
                        : user.credits) ?? 0
                    }
                  />
                  <UserButton />
                </>
              ) : (
                !user && (
                  <div className="flex items-center gap-3">
                    <Link href={currentView === "interviewer" ? "/sign-in?role=interviewer" : "/sign-in?role=interviewee"}>
                      <Button
                        variant="ghost"
                        className="cursor-pointer text-xs sm:text-sm font-light hover:bg-fog"
                        style={{
                          fontFamily: "var(--font-polysans)",
                          borderRadius: "0px",
                          color: "#202020",
                        }}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href={currentView === "interviewer" ? "/sign-up?role=interviewer" : "/sign-up?role=interviewee"}>
                      <Button
                        variant="default"
                        className="cursor-pointer text-xs sm:text-sm font-light text-white bg-graphite"
                        style={{
                          fontFamily: "var(--font-polysans)",
                          borderRadius: "0px",
                        }}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

/* ── Inline nav link with hover micro-interaction ── */
function NavLink({ href, children, small = false, active = false }) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHovered(false);
    }, 0);
  }, [active]);

  const showUnderline = active || hovered;

  return (
    <Link
      href={href}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-polysans)",
        fontWeight: 400,
        letterSpacing: "-0.02em",
        color: showUnderline ? "#202020" : "#828282",
        fontSize: small ? "0.75rem" : "0.875rem",
        textDecoration: "none",
        transition: "color 0.15s ease",
      }}
    >
      <span className="transition-colors duration-150">
        {children}
      </span>
      {/* Ember underline on hover or when active */}
      <span
        className="absolute -bottom-0.5 left-0 h-px transition-all duration-200"
        style={{
          background: "#ff682c",
          width: showUnderline ? "100%" : "0%",
        }}
      />
    </Link>
  );
}
