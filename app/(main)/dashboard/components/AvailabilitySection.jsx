/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { setAvailability } from "@/actions/dashboard";
import useFetch from "@/hooks/use-fetch";
import { Clock } from "lucide-react";

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
const PERIODS = ["AM", "PM"];

// Convert 24-hour HH:MM string to { hour: 1-12, minute: 00-59, period: AM/PM }
const parse24To12 = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string" || !timeStr.includes(":")) {
    return { hour: "09", minute: "00", period: "AM" };
  }
  const parts = timeStr.split(":");
  const hStr = parts[0];
  const mStr = parts[1] || "00";
  const h = parseInt(hStr, 10);
  if (isNaN(h)) {
    return { hour: "09", minute: "00", period: "AM" };
  }
  const period = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  const hourPad = hour12.toString().padStart(2, "0");
  const minPad = (parseInt(mStr, 10) || 0).toString().padStart(2, "0");
  return { hour: hourPad, minute: minPad, period };
};

// Convert { hour: 1-12, minute: 00-59, period: AM/PM } to 24-hour HH:MM string
const format12To24 = (hour, minute, period) => {
  let h = parseInt(hour, 10);
  if (isNaN(h)) h = 9;
  let m = parseInt(minute, 10);
  if (isNaN(m)) m = 0;
  if (period === "PM" && h < 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  const hPad = h.toString().padStart(2, "0");
  const mPad = m.toString().padStart(2, "0");
  return `${hPad}:${mPad}`;
};

function TimeSelectPicker({ value, onChange }) {
  const { hour, minute, period } = parse24To12(value);

  const handleHourChange = (newHour) => {
    onChange(format12To24(newHour, minute, period));
  };

  const handleMinuteChange = (newMinute) => {
    onChange(format12To24(hour, newMinute, period));
  };

  const handlePeriodChange = (newPeriod) => {
    onChange(format12To24(hour, minute, newPeriod));
  };

  return (
    <div className="flex items-center gap-1.5 bg-white border border-[#e8e8e8] px-3 py-2 w-full justify-between">
      <div className="flex items-center gap-1">
        {/* Hour select */}
        <select
          value={hour}
          onChange={(e) => handleHourChange(e.target.value)}
          className="bg-transparent border-none text-graphite outline-none text-sm cursor-pointer font-medium"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <span className="text-graphite/40 text-xs font-semibold px-0.5">:</span>

        {/* Minute select */}
        <select
          value={minute}
          onChange={(e) => handleMinuteChange(e.target.value)}
          className="bg-transparent border-none text-graphite outline-none text-sm cursor-pointer font-medium"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {MINUTES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* AM/PM select */}
      <select
        value={period}
        onChange={(e) => handlePeriodChange(e.target.value)}
        className="bg-transparent border-none text-[#ff682c] outline-none text-sm font-medium cursor-pointer"
        style={{ fontFamily: "var(--font-polysans)", letterSpacing: "-0.02em" }}
      >
        {PERIODS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
}

export default function AvailabilitySection({ initial }) {
  const [startTime, setStartTime] = useState(
    initial?.startTime
      ? new Date(initial.startTime).toTimeString().slice(0, 5)
      : "09:00"
  );
  const [endTime, setEndTime] = useState(
    initial?.endTime ? new Date(initial.endTime).toTimeString().slice(0, 5) : "17:00"
  );
  const [saved, setSaved] = useState(false);

  const { data, loading, error, fn: saveFn } = useFetch(setAvailability);

  useEffect(() => {
    if (data?.success) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [data]);

  const toISO = (time) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  const handleSave = () => {
    if (!startTime || !endTime) return;
    saveFn({ startTime: toISO(startTime), endTime: toISO(endTime) });
  };

  const hasWindow = startTime && endTime;
  const duration = hasWindow
    ? (() => {
        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);
        const diff = eh * 60 + em - (sh * 60 + sm);
        if (diff <= 0) return null;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
      })()
    : null;

  return (
    <section
      className="p-8 flex flex-col gap-7"
      style={{
        background: "#efefef",
        borderRadius: "6px 0px 6px 6px",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className="w-10 h-10 flex items-center justify-center mb-4"
            style={{
              background: "#ffffff",
              border: "1px solid #e8e8e8",
              borderRadius: "8px",
            }}
          >
            <Clock size={16} className="text-graphite" />
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
            Daily availability window
          </h2>
          <p className="text-xs mt-1" style={{ color: "#4d4d4d" }}>
            Interviewees can book within this window every day.
          </p>
        </div>

        {initial && (
          <Badge variant="success" className="shrink-0">
            Active
          </Badge>
        )}
      </div>

      <div className="h-px" style={{ background: "#e8e8e8" }} />

      {/* Time inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-xs" style={{ color: "#4d4d4d" }}>Start time</Label>
          <TimeSelectPicker value={startTime} onChange={setStartTime} />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs" style={{ color: "#4d4d4d" }}>End time</Label>
          <TimeSelectPicker value={endTime} onChange={setEndTime} />
        </div>
      </div>

      {/* Duration pill */}
      {duration && (
        <div className="flex items-center gap-3">
          <Badge variant="ember">
            {duration} window
          </Badge>
          <span className="text-xs" style={{ color: "#828282" }}>
            Interviewees see this as your open booking range
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500">{error?.message || error}</p>
      )}

      {/* Save */}
      <Button
        variant="default"
        disabled={!hasWindow || loading}
        onClick={handleSave}
        className="self-start"
      >
        {loading
          ? "Saving…"
          : saved
          ? "✓ Saved"
          : initial
          ? "Update window"
          : "Set availability"}
      </Button>
    </section>
  );
}
