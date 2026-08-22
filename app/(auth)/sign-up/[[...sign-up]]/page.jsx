"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role"); // "interviewer" or "interviewee"

  useEffect(() => {
    if (role && typeof window !== "undefined") {
      localStorage.setItem("calibrate_signup_role", role);
    }
  }, [role]);

  // After sign-up, redirect to onboarding with the role pre-selected
  const redirectUrl = role
    ? `/onboarding?role=${role}`
    : "/onboarding";

  return <SignUp forceRedirectUrl={redirectUrl} />;
}
