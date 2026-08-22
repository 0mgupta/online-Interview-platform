"use client";

import { useClerk } from "@clerk/nextjs";

export default function RoleMismatchWarning({ currentRole, requiredRole }) {
  const { signOut } = useClerk();

  const handleContinue = () => {
    if (currentRole === "INTERVIEWER") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/explore";
    }
  };

  const handleSignOut = () => {
    signOut(() => {
      window.location.href = "/";
    });
  };

  const roleText = currentRole === "INTERVIEWER" ? "Interviewer" : "Interviewee";
  const targetText = requiredRole === "INTERVIEWER" ? "Interviewer" : "Interviewee";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center mt-20">
      <div
        className="p-8 max-w-md w-full flex flex-col gap-6"
        style={{
          background: "#efefef",
          borderRadius: "8px",
          border: "1px solid #e8e8e8",
        }}
      >
        <span className="text-3xl">⚠️</span>
        <h1
          className="text-lg text-graphite font-semibold"
          style={{ fontFamily: "var(--font-polysans)", letterSpacing: "-0.02em" }}
        >
          Role Mismatch
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#4d4d4d" }}>
          You are currently logged in as an <strong className="text-graphite">{roleText}</strong>. To view this page as an <strong className="text-graphite">{targetText}</strong>, please sign out first.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleSignOut}
            className="flex-1 cursor-pointer transition-all duration-200 text-center py-2.5 px-4 border text-xs"
            style={{
              borderRadius: "0px",
              borderColor: "#202020",
              color: "#202020",
              background: "transparent",
              fontFamily: "var(--font-polysans)",
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
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
            Logout
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 cursor-pointer transition-all duration-200 text-center py-2.5 px-4 border text-xs text-white"
            style={{
              borderRadius: "0px",
              borderColor: "#202020",
              background: "#202020",
              fontFamily: "var(--font-polysans)",
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#333333";
              e.currentTarget.style.borderColor = "#333333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#202020";
              e.currentTarget.style.borderColor = "#202020";
            }}
          >
            Login as {roleText}
          </button>
        </div>
      </div>
    </div>
  );
}
