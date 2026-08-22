"use client";

import { useState } from "react";
import { updateInterviewerProfile } from "@/actions/dashboard";
import { CATEGORY_LABEL } from "@/lib/data";

export default function ProfileSection({ dbUser }) {
  const [title, setTitle] = useState(dbUser.title || "");
  const [company, setCompany] = useState(dbUser.company || "");
  const [yearsExp, setYearsExp] = useState(dbUser.yearsExp || 0);
  const [bio, setBio] = useState(dbUser.bio || "");
  const [creditRate, setCreditRate] = useState(dbUser.creditRate || 1);
  const [categories, setCategories] = useState(dbUser.categories || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCategoryToggle = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await updateInterviewerProfile({
        title,
        company,
        yearsExp,
        bio,
        creditRate,
        categories,
      });

      if (res?.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to update profile." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="p-8 max-w-2xl mx-auto"
      style={{
        background: "#efefef",
        borderRadius: "8px",
        border: "1px solid #e8e8e8",
      }}
    >
      <div className="mb-6">
        <h2
          className="text-lg text-graphite font-semibold"
          style={{ fontFamily: "var(--font-polysans)", letterSpacing: "-0.02em" }}
        >
          Edit Profile
        </h2>
        <p className="text-xs mt-1" style={{ color: "#828282" }}>
          Update your professional info, hourly rates, and matching domains.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {message && (
          <div
            className={`p-3 text-xs border ${
              message.type === "success"
                ? "bg-[rgba(255,104,44,0.06)] border-[#ff682c] text-[#ff682c]"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
            style={{ borderRadius: "0px" }}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-graphite">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-[#e8e8e8] text-sm text-graphite placeholder:text-slate focus:outline-none focus:border-[#202020] transition-colors"
              style={{ borderRadius: "0px" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-graphite">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Netflix"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-[#e8e8e8] text-sm text-graphite placeholder:text-slate focus:outline-none focus:border-[#202020] transition-colors"
              style={{ borderRadius: "0px" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-graphite">Years of Experience</label>
            <input
              type="number"
              value={yearsExp}
              onChange={(e) => setYearsExp(parseInt(e.target.value, 10) || 0)}
              min="0"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-[#e8e8e8] text-sm text-graphite placeholder:text-slate focus:outline-none focus:border-[#202020] transition-colors"
              style={{ borderRadius: "0px" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-graphite">Hourly Rate (Credits)</label>
            <input
              type="number"
              value={creditRate}
              onChange={(e) => setCreditRate(parseInt(e.target.value, 10) || 1)}
              min="1"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-[#e8e8e8] text-sm text-graphite placeholder:text-slate focus:outline-none focus:border-[#202020] transition-colors"
              style={{ borderRadius: "0px" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-graphite">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell candidates about your background, expertise, and what you focus on during mock interviews..."
            rows={4}
            required
            className="w-full px-3.5 py-2.5 bg-white border border-[#e8e8e8] text-sm text-graphite placeholder:text-slate focus:outline-none focus:border-[#202020] transition-colors resize-none"
            style={{ borderRadius: "0px" }}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold text-graphite">Interview Categories</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_LABEL).map(([value, label]) => {
              const active = categories.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleCategoryToggle(value)}
                  className="cursor-pointer text-xs px-3.5 py-2 transition-all duration-150"
                  style={{
                    borderRadius: "0px",
                    border: `1px solid ${active ? "#ff682c" : "#e8e8e8"}`,
                    background: active ? "#ff682c" : "#ffffff",
                    color: active ? "#ffffff" : "#828282",
                    fontFamily: "var(--font-polysans)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer transition-all duration-200 text-center py-2.5 px-4 text-sm text-white font-medium bg-graphite"
          style={{
            borderRadius: "0px",
            borderColor: "#202020",
            fontFamily: "var(--font-polysans)",
            letterSpacing: "-0.02em",
            lineHeight: "1.2",
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.background = "#333333";
            }
          }}
          onMouseLeave={(e) => {
            if (!saving) {
              e.currentTarget.style.background = "#202020";
            }
          }}
        >
          {saving ? "Saving Changes..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
