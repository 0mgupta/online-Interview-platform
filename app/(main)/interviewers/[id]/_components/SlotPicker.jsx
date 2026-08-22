"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { bookSlot } from "@/actions/booking";
import useFetch from "@/hooks/use-fetch";
import UpgradeModal from "@/components/UpgradeModal";
import {
  formatDateFull,
  formatTime,
  formatDateTab,
  generateDates,
  generateSlots,
} from "@/lib/helpers";

const SLOT_DURATION_MINUTES = 45;
const DAYS_AHEAD = 7;

export default function SlotPicker({
  interviewer,
  interviewerCredits,
  userCredits,
}) {
  const router = useRouter();
  const dates = useMemo(() => generateDates(DAYS_AHEAD), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const summaryRef = useRef(null);

  useEffect(() => {
    if (selectedSlot && summaryRef.current) {
      summaryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSlot]);

  const { data, loading, error, fn: bookFn } = useFetch(bookSlot);

  const availability = interviewer.availabilities?.[0];
  const canAfford = userCredits >= interviewerCredits;

  const slots = useMemo(() => {
    if (!availability) return [];
    return generateSlots(
      selectedDate,
      availability.startTime,
      availability.endTime,
      interviewer.bookingsAsInterviewer ?? [],
      SLOT_DURATION_MINUTES
    );
  }, [selectedDate, availability, interviewer.bookingsAsInterviewer]);

  useEffect(() => {
    if (data?.success && data.streamCallId) {
      router.push(`/appointments`);
    }
  }, [data, router]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot) => {
    if (!slot.available) return;
    if (!canAfford) {
      setUpgradeOpen(true);
      return;
    }
    setSelectedSlot((prev) =>
      prev?.startTime.getTime() === slot.startTime.getTime() ? null : slot
    );
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;
    bookFn({
      interviewerId: interviewer.id,
      startTime: selectedSlot.startTime.toISOString(),
      endTime: selectedSlot.endTime.toISOString(),
    });
  };

  if (!availability) {
    return (
      <div
        className="p-8 text-center flex flex-col items-center gap-2"
        style={{
          background: "#efefef",
          borderRadius: "8px",
        }}
      >
        <span className="text-xl">🕐</span>
        <p className="text-sm font-medium" style={{ color: "#202020" }}>No availability set yet.</p>
        <p className="text-xs" style={{ color: "#828282" }}>Check back later.</p>
      </div>
    );
  }

  return (
    <>
      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        reason={`You need ${interviewerCredits} credits to book this session. Your current balance is ${userCredits}.`}
      />

      <div className="flex flex-col gap-4">
        {/* Main picker card */}
        <div
          className="p-7 flex flex-col gap-6"
          style={{
            background: "#efefef",
            borderRadius: "6px 0px 6px 6px",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
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
                Book a session
              </h2>
              <p className="text-xs mt-1" style={{ color: "#828282" }}>
                Select a date and available time slot.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs" style={{ color: "#828282" }}>Cost</p>
              <p
                className="text-2xl leading-none mt-0.5"
                style={{
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#ff682c",
                }}
              >
                {interviewerCredits}
                <span className="text-xs font-sans ml-1" style={{ color: "#828282" }}>
                  cr
                </span>
              </p>
            </div>
          </div>

          {/* Date tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {dates.map((date) => {
              const label = formatDateTab(date);
              const active =
                date.toDateString() === selectedDate.toDateString();
              return (
                <button
                  key={date.toDateString()}
                  type="button"
                  onClick={() => handleDateChange(date)}
                  className="shrink-0 flex flex-col items-center px-3.5 py-2.5 transition-all duration-150 cursor-pointer"
                  style={{
                    borderRadius: "8px",
                    border: `1px solid ${active ? "#ff682c" : "#e8e8e8"}`,
                    background: active ? "#ffffff" : "transparent",
                    color: active ? "#ff682c" : "#828282",
                    fontSize: "12px",
                  }}
                >
                  <span className="font-medium">{label.top}</span>
                  <span
                    className="mt-0.5"
                    style={{
                      color: active ? "#ff682c" : "#b2b2b2",
                      fontSize: "10px",
                    }}
                  >
                    {label.bottom}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-px" style={{ background: "#e8e8e8" }} />

          {/* Time grid */}
          {slots.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: "#828282" }}>
              No slots in the availability window for this date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const isSelected =
                  selectedSlot?.startTime.getTime() ===
                  slot.startTime.getTime();

                return (
                  <button
                    key={slot.startTime.toISOString()}
                    type="button"
                    disabled={slot.isBooked}
                    onClick={() => handleSlotClick(slot)}
                    className="relative text-xs px-2 py-2.5 transition-colors duration-150"
                    style={{
                      borderRadius: "8px",
                      border: `1px solid ${isSelected ? "#ff682c" : slot.isBooked ? "transparent" : "#e8e8e8"}`,
                      background: isSelected ? "#ff682c/10" : slot.isBooked ? "#f5f5f5" : "#ffffff",
                      color: isSelected ? "#ff682c" : slot.isBooked ? "#b2b2b2" : "#202020",
                      cursor: slot.isBooked ? "not-allowed" : "pointer",
                    }}
                  >
                    {formatTime(slot.startTime)}
                    {slot.isBooked && (
                      <span
                        className="absolute inset-x-0 bottom-0.5 text-center leading-none"
                        style={{ fontSize: "8px", color: "#b2b2b2" }}
                      >
                        booked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Inline confirm card */}
        {selectedSlot && (
          <div
            ref={summaryRef}
            className="p-6 flex flex-col gap-4"
            style={{
              background: "#efefef",
              border: "1px solid #ff682c/30",
              borderRadius: "8px",
            }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#816729", fontFamily: "var(--font-inter)" }}
            >
              Your booking
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span style={{ color: "#828282" }}>Date</span>
                <span style={{ color: "#202020", fontWeight: 500 }}>
                  {formatDateFull(selectedSlot.startTime)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#828282" }}>Time</span>
                <span style={{ color: "#202020", fontWeight: 500 }}>
                  {formatTime(selectedSlot.startTime)} –{" "}
                  {formatTime(selectedSlot.endTime)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#828282" }}>Duration</span>
                <span style={{ color: "#202020", fontWeight: 500 }}>
                  {SLOT_DURATION_MINUTES} minutes
                </span>
              </div>
            </div>

            <Separator style={{ background: "#e8e8e8" }} />

            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "#828282" }}>Credits charged</span>
              <span
                className="text-lg leading-none"
                style={{
                  fontFamily: "var(--font-polysans)",
                  fontWeight: 400,
                  color: "#ff682c",
                }}
              >
                −{interviewerCredits}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: "#828282" }}>Balance after</span>
              <span style={{ color: "#4d4d4d" }}>
                {userCredits - interviewerCredits} credits
              </span>
            </div>

            <div
              className="flex items-start gap-2.5 px-3.5 py-3"
              style={{
                background: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
              }}
            >
              <span className="text-sm shrink-0">🎥</span>
              <p className="text-xs leading-relaxed" style={{ color: "#828282" }}>
                A video call room will be created and you&apos;ll be redirected
                immediately after confirming.
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-500">{error?.message || error}</p>
            )}

            <div className="flex gap-3 mt-2">
              <button
                disabled={loading}
                onClick={() => setSelectedSlot(null)}
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
                Change slot
              </button>
              <button
                disabled={loading}
                onClick={handleConfirm}
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
                {loading ? "Creating call…" : "Confirm →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
