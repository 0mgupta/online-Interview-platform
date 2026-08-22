"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PricingSection from "./PricingSection";
import { AlertCircle } from "lucide-react";

export default function UpgradeModal({ open, onOpenChange, reason }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-[70vw] max-h-[90vh] overflow-y-auto"
        style={{
          background: "#ffffff",
          border: "1px solid #e8e8e8",
          color: "#202020",
          borderRadius: "8px",
        }}
      >
        <DialogHeader>
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle size={18} className="ml-2 mt-1" style={{ color: "#ff682c" }} />
            <div>
              <DialogTitle
                style={{
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  fontSize: "22px",
                  letterSpacing: "-0.02em",
                }}
              >
                Upgrade your plan
              </DialogTitle>
              {reason && (
                <DialogDescription style={{ color: "#ff682c", marginTop: "4px", fontSize: "12px" }}>
                  {reason}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* PricingSection */}
        <div className="px-2 pb-6">
          <PricingSection />
        </div>
      </DialogContent>
    </Dialog>
  );
}
