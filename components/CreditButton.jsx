"use client";

import { useState } from "react";
import { Coins } from "lucide-react";
import UpgradeModal from "./UpgradeModal";

export default function CreditButton({ role, credits }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (role === "INTERVIEWER") {
      window.location.href = "/dashboard";
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-3.5 py-1.5 text-xs cursor-pointer transition-all duration-150 hover:bg-[#efefef] active:scale-95"
        style={{
          background: "#ebe6dd", // Premium Ivory wash
          color: "#202020",      // Graphite text
          borderRadius: "200px", // Fully round nav-pill
          border: "1px solid #ebe6dd",
          fontFamily: "var(--font-polysans)",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          boxShadow: "none",
        }}
      >
        <Coins size={13} className="text-[#ff682c] shrink-0" />
        <span>
          {credits} {role === "INTERVIEWER" ? "Earned" : "Credits"}
        </span>
      </button>

      <UpgradeModal open={open} onOpenChange={setOpen} />
    </>
  );
}
