"use client";

import { AppointmentCard } from "@/components/AppointmentCard";
import { ClipboardList } from "lucide-react";

export default function AppointmentsSection({ appointments }) {
  const now = new Date();
  const scheduled = appointments.filter(
    (a) => a.status === "SCHEDULED" && new Date(a.startTime) > now
  );
  const past = appointments.filter(
    (a) => a.status !== "SCHEDULED" || new Date(a.endTime) <= now
  );

  return (
    <section className="flex flex-col gap-6">
      <div
        className="p-8"
        style={{
          background: "#efefef",
          borderRadius: "6px 0px 6px 6px",
        }}
      >
        <span
          className="w-10 h-10 flex items-center justify-center mb-4"
          style={{
            background: "#ffffff",
            border: "1px solid #e8e8e8",
            borderRadius: "8px",
          }}
        >
          <ClipboardList size={16} className="text-graphite" />
        </span>
        <h2
          className="text-lg"
          style={{
            fontFamily: "var(--font-polysans)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#202020",
          }}
        >
          Appointments
        </h2>
        <p className="text-xs mt-1" style={{ color: "#4d4d4d" }}>
          All your scheduled and past sessions.
        </p>
      </div>

      {appointments.length === 0 ? (
        <div
          className="py-20 text-center"
          style={{
            background: "#efefef",
            borderRadius: "8px",
          }}
        >
          <p className="text-sm font-medium" style={{ color: "#4d4d4d" }}>
            No appointments yet.
          </p>
          <p className="text-xs mt-1" style={{ color: "#828282" }}>
            Once interviewees book your slots, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {scheduled.length > 0 && (
            <div className="flex flex-col gap-4">
              <p
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#816729", fontFamily: "var(--font-inter)" }}
              >
                Upcoming ({scheduled.length})
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {scheduled.map((b) => (
                  <AppointmentCard key={b.id} booking={b} mode="interviewer" />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="flex flex-col gap-4">
              <p
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#816729", fontFamily: "var(--font-inter)" }}
              >
                Past ({past.length})
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {past.map((b) => (
                  <AppointmentCard
                    key={b.id}
                    booking={b}
                    mode="interviewer"
                    isPast
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
