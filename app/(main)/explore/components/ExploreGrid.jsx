"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import InterviewerCard from "./InterviewerCard";

export default function ExploreGrid({ interviewers }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return interviewers.filter((i) => {
      const matchesCategory =
        activeCategory === null || i.categories?.includes(activeCategory);

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        i.name?.toLowerCase().includes(q) ||
        i.title?.toLowerCase().includes(q) ||
        i.company?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [interviewers, activeCategory, search]);

  return (
    <div className="flex flex-col gap-8">
      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col gap-4"
      >
        {/* Search */}
        <div className="relative max-w-sm">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, title or company…"
            className="pl-9 bg-white border-[#e8e8e8] text-graphite placeholder:text-slate text-sm rounded-none focus-visible:outline-none"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.value;
            return (
              <button
                key={String(cat.value)}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className="cursor-pointer text-xs px-4 py-2 transition-all duration-150"
                suppressHydrationWarning
                style={{
                  borderRadius: "0px",
                  border: `1px solid ${active ? "#202020" : "#e8e8e8"}`,
                  background: active ? "#202020" : "transparent",
                  color: active ? "#ffffff" : "#828282",
                  fontFamily: "var(--font-polysans)",
                  letterSpacing: "-0.02em",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Result count */}
      <motion.p
        key={filtered.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-slate"
      >
        {filtered.length === 0
          ? "No interviewers found"
          : `${filtered.length} interviewer${filtered.length === 1 ? "" : "s"} found`}
      </motion.p>

      {/* Grid with AnimatePresence for filter transitions */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="py-20 text-center"
            style={{ background: "#efefef", borderRadius: "8px" }}
          >
            <p className="text-sm" style={{ color: "#4d4d4d" }}>
              No interviewers match your filters.
            </p>
            <button
              type="button"
              onClick={() => { setActiveCategory(null); setSearch(""); }}
              className="text-xs mt-2 underline"
              style={{ color: "#ff682c", textDecorationColor: "#ff682c" }}
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((interviewer, i) => (
              <InterviewerCard key={interviewer.id} interviewer={interviewer} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
