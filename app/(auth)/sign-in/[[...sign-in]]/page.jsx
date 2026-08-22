"use client";

import { SignIn } from "@clerk/nextjs";
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

  // After sign-in, redirect based on role if provided
  const redirectUrl = role
    ? `/onboarding?role=${role}`
    : "/";

  return <SignIn forceRedirectUrl={redirectUrl} />;
}
