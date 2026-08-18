"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const INTERVIEWER_ONLY = ["/dashboard"];
const INTERVIEWEE_ONLY = ["/explore", "/appointments"];

export default function RoleRedirect({ role }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (role === "UNASSIGNED" && pathname !== "/onboarding") {
      console.log("RoleRedirect: UNASSIGNED -> /onboarding");
      router.replace("/onboarding");
    }
    
    if (
      role === "INTERVIEWER" &&
      INTERVIEWEE_ONLY.some((p) => pathname.startsWith(p))
    ) {
      console.log("RoleRedirect: INTERVIEWER -> /dashboard");
      router.replace("/dashboard");
    }
    
    if (
      role === "INTERVIEWEE" &&
      INTERVIEWER_ONLY.some((p) => pathname.startsWith(p))
    ) {
      console.log("RoleRedirect: INTERVIEWEE -> /explore");
      router.replace("/explore");
    }
  }, [role, pathname, router]);

  return null;
}
