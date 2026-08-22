"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { CATEGORY_LABEL } from "@/lib/data";
import { generateInterviewQuestions } from "@/actions/aiQuestions";
import useFetch from "@/hooks/use-fetch";

export default function AIQuestionsPanel({ categories }) {
  const [selectedCategory, setSelectedCategory] = useState(
    categories?.[0] ?? null
  );

  const {
    data,
    loading,
    error,
    fn: generateFn,
  } = useFetch(generateInterviewQuestions);

  const questions = data?.questions ?? [];

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden text-graphite bg-white">
      {/* Category selector */}
      <div className="flex flex-wrap gap-1.5">
        {categories?.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className="cursor-pointer text-xs px-3 py-1.5 transition-colors duration-150"
            style={{
              borderRadius: "20px",
              border: `1px solid ${selectedCategory === cat ? "#ff682c" : "#e8e8e8"}`,
              background: selectedCategory === cat ? "#ff682c/5" : "transparent",
              color: selectedCategory === cat ? "#ff682c" : "#828282",
              fontFamily: "var(--font-inter)",
            }}
          >
            {CATEGORY_LABEL[cat] ?? cat}
          </button>
        ))}
      </div>

      <Button
        variant="default"
        disabled={loading || !selectedCategory}
        onClick={() => generateFn({ category: selectedCategory })}
        className="self-start gap-2 shrink-0"
      >
        {loading ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles size={13} />
            Generate questions
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-red-500">{error?.message || error}</p>
      )}

      {/* Questions list */}
      {questions.length > 0 ? (
        <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
          {questions.map((q, i) => (
            <div
              key={i}
              className="p-4 flex flex-col gap-2"
              style={{
                background: "#efefef",
                border: "none",
                borderRadius: "8px",
              }}
            >
              <p
                className="text-sm font-medium leading-snug"
                style={{ color: "#202020", fontFamily: "var(--font-inter)" }}
              >
                {i + 1}. {q.question}
              </p>
              <div className="h-px" style={{ background: "#e8e8e8" }} />
              <p className="text-xs leading-relaxed" style={{ color: "#4d4d4d" }}>
                <span className="font-semibold" style={{ color: "#ff682c" }}>Answer: </span>
                {q.answer}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-10">
          <span
            className="w-10 h-10 flex items-center justify-center"
            style={{
              background: "#efefef",
              border: "1px solid #e8e8e8",
              borderRadius: "8px",
            }}
          >
            <Sparkles size={16} className="text-graphite" />
          </span>
          <p className="text-xs" style={{ color: "#828282" }}>
            Select a category and generate role-specific questions for this
            session.
          </p>
        </div>
      )}
    </div>
  );
}
