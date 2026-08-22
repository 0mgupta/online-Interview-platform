"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { EmberTitle, SectionLabel } from "@/components/reusables";
import { completeOnboarding } from "@/actions/onboarding";
import useFetch from "@/hooks/use-fetch";
import { getCurrentUser } from "@/actions/user";
import RoleMismatchWarning from "@/components/RoleMismatchWarning";

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const [dbUser, setDbUser] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [resolvedRole, setResolvedRole] = useState("INTERVIEWEE");
  const [hasUrlRole, setHasUrlRole] = useState(false);

  const { data, loading, fn: onboardingFn } = useFetch(completeOnboarding);

  useEffect(() => {
    async function init() {
      const u = await getCurrentUser();
      setDbUser(u);

      const urlRole = searchParams.get("role");
      const storedRole = typeof window !== "undefined" ? localStorage.getItem("calibrate_signup_role") : null;
      
      const targetRole = urlRole || storedRole;
      
      if (urlRole) {
        setHasUrlRole(true);
      } else if (storedRole) {
        setHasUrlRole(true); // Treat stored role as requested context
      }

      setResolvedRole(targetRole === "interviewer" ? "INTERVIEWER" : "INTERVIEWEE");
      
      if (typeof window !== "undefined" && storedRole) {
        localStorage.removeItem("calibrate_signup_role");
      }

      setCheckingRole(false);
    }
    init();
  }, [searchParams]);

  // Redirect if they already have a role
  useEffect(() => {
    if (!checkingRole && dbUser && dbUser.role !== "UNASSIGNED") {
      // If no role was requested, just redirect to their correct workspace
      if (!hasUrlRole) {
        window.location.href = dbUser.role === "INTERVIEWER" ? "/dashboard" : "/explore";
        return;
      }
      
      // If requested role matches their DB role, redirect
      if (dbUser.role === resolvedRole) {
        window.location.href = dbUser.role === "INTERVIEWER" ? "/dashboard" : "/explore";
      }
    }
  }, [checkingRole, dbUser, hasUrlRole, resolvedRole]);

  // Handle successful onboarding redirect
  useEffect(() => {
    if (data && !loading) {
      window.location.href = resolvedRole === "INTERVIEWER" ? "/dashboard" : "/explore";
    }
  }, [data, loading, resolvedRole]);

  // Auto-submit onboarding on mount (only for new users with UNASSIGNED role)
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  useEffect(() => {
    if (!checkingRole && dbUser && dbUser.role === "UNASSIGNED" && !autoSubmitted && !loading && !data) {
      setTimeout(() => {
        setAutoSubmitted(true);
      }, 0);
      if (resolvedRole === "INTERVIEWER") {
        onboardingFn({
          role: "INTERVIEWER",
          title: "Software Engineer",
          company: "Calibrate Partner",
          yearsExp: 5,
          bio: "Experienced software engineer conducting mock interviews on Calibrate.",
          categories: ["SYSTEM_DESIGN", "DSA", "BEHAVIORAL"],
        });
      } else {
        onboardingFn({ role: "INTERVIEWEE" });
      }
    }
  }, [checkingRole, dbUser, resolvedRole, autoSubmitted, loading, data, onboardingFn]);

  if (checkingRole) {
    return (
      <main className="min-h-screen bg-white text-graphite px-6 py-24 flex flex-col items-center justify-center">
        <div className="text-center">
          <SectionLabel>Checking account status</SectionLabel>
          <h1
            className="mt-2 text-2xl font-light"
            style={{
              fontFamily: "var(--font-polysans)",
              fontWeight: 400,
              color: "#202020",
              letterSpacing: "-0.02em",
            }}
          >
            Checking your credentials...
          </h1>
        </div>
      </main>
    );
  }

  // Render role mismatch if URL role differs from database role
  if (dbUser && dbUser.role !== "UNASSIGNED" && hasUrlRole && dbUser.role !== resolvedRole) {
    return (
      <RoleMismatchWarning
        currentRole={dbUser.role}
        requiredRole={resolvedRole}
      />
    );
  }

  return (
    <main className="min-h-screen bg-white text-graphite px-6 py-24 flex flex-col items-center justify-center">
      <div className="text-center">
        <SectionLabel>Setting up your account</SectionLabel>
        <h1
          className="mt-2 text-2xl font-light"
          style={{
            fontFamily: "var(--font-polysans)",
            fontWeight: 400,
            color: "#202020",
            letterSpacing: "-0.02em",
          }}
        >
          Preparing your <EmberTitle>Calibrate</EmberTitle> space...
        </h1>
        <p className="text-xs mt-3" style={{ color: "#828282" }}>
          Assigning your profile role and redirecting you...
        </p>
      </div>
    </main>
  );
}
