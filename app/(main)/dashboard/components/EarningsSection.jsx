/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { requestWithdrawal } from "@/actions/dashboard";
import useFetch from "@/hooks/use-fetch";
import { CircleCheck, TrendingUp, Wallet } from "lucide-react";
import { formatDate } from "@/lib/helpers";

const PAYMENT_METHODS = [
  { value: "PAYPAL", label: "PayPal", placeholder: "your@paypal.com" },
  {
    value: "BANK",
    label: "Bank Transfer",
    placeholder: "Account / routing info",
  },
  { value: "UPI", label: "UPI", placeholder: "your@upi" },
];

const PLATFORM_FEE = 0.2;

export default function EarningsSection({ stats, history }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [method, setMethod] = useState("PAYPAL");
  const [detail, setDetail] = useState("");

  const { data, loading, error, fn: withdrawFn } = useFetch(requestWithdrawal);

  const balance = (stats?.creditBalance ?? 0) * 5;
  const totalEarnedDollars = (stats?.totalEarned ?? 0) * 5;
  const feeAmount = (balance * PLATFORM_FEE).toFixed(2);
  const netAmount = (balance * (1 - PLATFORM_FEE)).toFixed(2);
  const selectedMethod = PAYMENT_METHODS.find((m) => m.value === method);
  const isValid = detail.trim().length > 0;

  useEffect(() => {
    if (data?.success) {
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setDone(false);
          setDetail("");
          setMethod("PAYPAL");
        }, 300);
      }, 2000);
    }
  }, [data]);

  const handleOpenChange = (val) => {
    if (!val && !loading) {
      setOpen(false);
      if (!done) {
        setDetail("");
        setMethod("PAYPAL");
      }
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Credit balance",
            value: stats?.creditBalance ?? 0,
            unit: "credits",
            highlight: true,
            icon: <Wallet size={14} className="text-graphite" />,
            dollarValue: balance,
          },
          {
            label: "Total earned",
            value: stats?.totalEarned ?? 0,
            unit: "credits",
            highlight: false,
            icon: <TrendingUp size={14} className="text-steel" />,
            dollarValue: totalEarnedDollars,
          },
          {
            label: "Sessions done",
            value: stats?.completedSessions ?? 0,
            unit: "completed",
            highlight: false,
            icon: <CircleCheck size={14} className="text-steel" />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 p-6"
            style={{
              background: "#efefef",
              borderRadius: "8px",
            }}
          >
            <span
              className="w-8 h-8 flex items-center justify-center"
              style={{
                background: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: "6px",
              }}
            >
              {stat.icon}
            </span>
            <p
              style={{
                fontFamily: "var(--font-polysans)",
                fontWeight: 400,
                fontSize: "36px",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: stat.highlight ? "#ff682c" : "#202020",
              }}
            >
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: "#828282" }}>{stat.unit}</p>

            <p className="text-xs mt-1" style={{ color: "#4d4d4d" }}>
              {stat.label}{" "}
              {stat.dollarValue !== undefined
                ? `($${stat?.dollarValue?.toFixed(2)})`
                : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Withdrawal trigger card */}
      <div
        className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{
          background: "#efefef",
          borderRadius: "6px 0px 6px 6px",
        }}
      >
        <div>
          <h2
            className="text-lg"
            style={{
              fontFamily: "var(--font-polysans)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#202020",
            }}
          >
            Withdraw earnings
          </h2>
          <p className="text-xs mt-1" style={{ color: "#4d4d4d" }}>
            20% platform fee applies. Processed within 2–3 business days.
          </p>
        </div>
        <Button
          variant="default"
          disabled={balance <= 0}
          onClick={() => setOpen(true)}
          className="shrink-0 w-full sm:w-auto"
        >
          Request withdrawal
        </Button>
      </div>

      {/* Withdrawal history */}
      {history?.length > 0 && (
        <div
          className="p-8 flex flex-col gap-5"
          style={{
            background: "#efefef",
            borderRadius: "8px",
          }}
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#816729", fontFamily: "var(--font-inter)" }}
          >
            Withdrawal history
          </p>
          <div className="flex flex-col gap-3">
            {history.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                }}
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm" style={{ color: "#202020" }}>
                    {p.credits} credits → ${p.netAmount.toFixed(2)}
                  </p>
                  <p className="text-xs" style={{ color: "#828282" }}>
                    {p.paymentMethod} · {formatDate(p.createdAt)}
                  </p>
                </div>
                <Badge
                  variant={p.status === "PROCESSED" ? "success" : "warning"}
                >
                  {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-md"
          style={{
            background: "#ffffff",
            border: "1px solid #e8e8e8",
            borderRadius: "8px",
            color: "#202020",
          }}
        >
          {done ? (
            <div className="py-8 text-center flex flex-col items-center gap-4">
              <span
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: "#f5f5f5",
                  border: "1px solid #e8e8e8",
                  color: "#ff682c",
                }}
              >
                ✓
              </span>
              <p
                className="text-xl"
                style={{
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                Request submitted
              </p>
              <p className="text-xs" style={{ color: "#828282" }}>
                We&apos;ll process your withdrawal within 2–3 business days.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle
                  style={{
                    fontFamily: "var(--font-polysans)",
                    fontWeight: 400,
                    fontSize: "20px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Request withdrawal
                </DialogTitle>
                <DialogDescription style={{ color: "#828282", fontSize: "12px" }}>
                  Your full balance of{" "}
                  <span style={{ color: "#ff682c", fontWeight: 500 }}>
                    {stats?.creditBalance} credits
                  </span>{" "}
                  will be withdrawn.
                </DialogDescription>
              </DialogHeader>

              <Separator style={{ background: "#e8e8e8" }} />

              <div className="flex flex-col gap-5 py-2">
                {/* Fee breakdown */}
                <div
                  className="p-4 flex flex-col gap-2"
                  style={{
                    background: "#f5f5f5",
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                  }}
                >
                  <div className="flex justify-between text-xs" style={{ color: "#4d4d4d" }}>
                    <span>Balance (1 Cr = $5)</span>
                    <span className="font-medium" style={{ color: "#202020" }}>${balance}</span>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: "#4d4d4d" }}>
                    <span>Platform fee (20%)</span>
                    <span className="font-medium" style={{ color: "#ff682c" }}>− ${feeAmount}</span>
                  </div>
                  <Separator style={{ background: "#e8e8e8", margin: "4px 0" }} />
                  <div className="flex justify-between text-sm font-medium">
                    <span style={{ color: "#202020" }}>You receive</span>
                    <span style={{ color: "#ff682c" }}>${netAmount}</span>
                  </div>
                </div>

                {/* Payment method — Tabs */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs" style={{ color: "#4d4d4d" }}>
                    Payment method
                  </Label>
                  <Tabs
                    value={method}
                    onValueChange={(val) => {
                      setMethod(val);
                      setDetail("");
                    }}
                  >
                    <TabsList
                      className="w-full"
                      style={{
                        background: "#efefef",
                        borderRadius: "6px",
                      }}
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <TabsTrigger
                          key={m.value}
                          value={m.value}
                          className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-graphite data-[state=active]:shadow-none"
                          style={{
                            fontFamily: "var(--font-polysans)",
                            letterSpacing: "-0.02em",
                            borderRadius: "4px",
                          }}
                        >
                          {m.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Payment detail */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs" style={{ color: "#4d4d4d" }}>
                    {selectedMethod?.label} details
                  </Label>
                  <Input
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder={selectedMethod?.placeholder}
                    className="text-graphite border-[#e8e8e8] bg-white rounded-none"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500">
                    {error?.message || error}
                  </p>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  disabled={!isValid || loading}
                  onClick={() =>
                    withdrawFn({
                      credits: stats?.creditBalance,
                      paymentMethod: method,
                      paymentDetail: detail,
                    })
                  }
                >
                  {loading ? "Submitting…" : "Confirm withdrawal"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
