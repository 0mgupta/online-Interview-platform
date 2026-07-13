// "use client";

// import { useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";

// const INTERVIEWER_ONLY = ["/appointments"];
// const INTERVIEWEE_ONLY = ["/dashboard"];

// export default function RoleRedirect({ role }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   useEffect(() => {
//     if (role === "UNASSIGNED" && pathname !== "/onboarding")
//       router.replace("/onboarding");
//     // Already onboarded users shouldn't be on /onboarding
//     if (role === "INTERVIEWER" && pathname.startsWith("/onboarding"))
//       router.replace("/dashboard");
//     if (role === "INTERVIEWEE" && pathname.startsWith("/onboarding"))
//       router.replace("/explore");
//     if (
//       role === "INTERVIEWER" &&
//       INTERVIEWER_ONLY.some((p) => pathname.startsWith(p))
//     )
//       router.replace("/dashboard");
//     if (
//       role === "INTERVIEWEE" &&
//       INTERVIEWEE_ONLY.some((p) => pathname.startsWith(p))
//     )
//       router.replace("/appointments");
//   }, [role, pathname, router]);

//   return null;
// }
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const INTERVIEWER_ONLY = ["/dashboard"];
const INTERVIEWEE_ONLY = ["/explore", "/appointments"];

export default function RoleRedirect({ role }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (role === "UNASSIGNED" && pathname !== "/onboarding")
      router.replace("/onboarding");
    
    if (
      role === "INTERVIEWER" &&
      INTERVIEWEE_ONLY.some((p) => pathname.startsWith(p))
    )
      router.replace("/dashboard");
    
    if (
      role === "INTERVIEWEE" &&
      INTERVIEWER_ONLY.some((p) => pathname.startsWith(p))
    )
      router.replace("/explore");
  }, [role, pathname, router]);

  return null;
}
