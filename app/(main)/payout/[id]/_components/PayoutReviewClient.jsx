/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { approvePayout } from "@/actions/payout";
import useFetch from "@/hooks/use-fetch";

export default function PayoutReviewClient({ payout }) {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(payout.status === "PROCESSED");

  const { data, loading, error, fn: approveFn } = useFetch(approvePayout);

  useEffect(() => {
    if (data?.success) setDone(true);
  }, [data]);

  if (done) {
    return (
      <div
        className="p-10 flex flex-col items-center gap-3 text-center"
        style={{
          background: "#efefef",
          borderRadius: "8px",
        }}
      >
        <span className="text-3xl">✅</span>
        <p
          className="text-xl"
          style={{
            fontFamily: "var(--font-polysans)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#202020",
          }}
        >
          Withdrawal approved
        </p>
        <p className="text-xs" style={{ color: "#828282" }}>
          {payout.interviewerName} · ${payout.netAmount.toFixed(2)} via{" "}
          {payout.paymentMethod}
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-8 flex flex-col gap-5"
      style={{
        background: "#efefef",
        borderRadius: "6px 0px 6px 6px",
      }}
    >
      {/* Payout summary */}
      <div
        className="p-4 flex flex-col gap-2"
        style={{
          background: "#ffffff",
          border: "1px solid #e8e8e8",
          borderRadius: "8px",
        }}
      >
        <div className="flex justify-between text-xs">
          <span style={{ color: "#828282" }}>Interviewer</span>
          <span style={{ color: "#202020", fontWeight: 500 }}>{payout.interviewerName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "#828282" }}>Email</span>
          <span style={{ color: "#202020", fontWeight: 500 }}>{payout.interviewerEmail}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "#828282" }}>Credits</span>
          <span style={{ color: "#202020", fontWeight: 500 }}>{payout.credits}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "#828282" }}>Platform fee (20%)</span>
          <span style={{ color: "#ff682c", fontWeight: 500 }}>
            − ${payout.platformFee.toFixed(2)}
          </span>
        </div>
        <Separator style={{ background: "#e8e8e8", margin: "4px 0" }} />
        <div className="flex justify-between text-sm font-medium">
          <span style={{ color: "#4d4d4d" }}>Pay out</span>
          <span
            style={{
              fontFamily: "var(--font-polysans)",
              fontWeight: 400,
              color: "#ff682c",
            }}
          >
            ${payout.netAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs pt-1">
          <span style={{ color: "#828282" }}>Send to</span>
          <span style={{ color: "#4d4d4d" }}>
            {payout.paymentMethod} · {payout.paymentDetail}
          </span>
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-xs" style={{ color: "#4d4d4d" }}>Admin password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            password.trim() &&
            approveFn({ payoutId: payout.id, adminPassword: password })
          }
          placeholder="Enter password…"
          className="bg-white border-[#e8e8e8] text-graphite rounded-none focus-visible:outline-none"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500">{error?.message || error}</p>
      )}

      <Button
        variant="default"
        disabled={!password.trim() || loading}
        onClick={() =>
          approveFn({ payoutId: payout.id, adminPassword: password })
        }
        className="w-full"
      >
        {loading ? "Approving…" : `Approve $${payout.netAmount.toFixed(2)} →`}
      </Button>
    </div>
  );
}
