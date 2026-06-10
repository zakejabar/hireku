"use client";

import { useState } from "react";
import { generateCriteria, CriteriaOutput } from "@/lib/api";

interface Props {
  onCriteriaGenerated: (criteria: CriteriaOutput) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export default function CriteriaForm({ onCriteriaGenerated, onLoadingChange }: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setLoadingState(val: boolean) {
    setLoading(val);
    onLoadingChange?.(val);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoadingState(true);
    setError("");
    try {
      const criteria = await generateCriteria(jobDescription);
      onCriteriaGenerated(criteria);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingState(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste your job description here..."
        className="w-full h-44 p-3 bg-surface-mid border border-surface-border rounded-md resize-none focus:outline-none focus:border-brand text-base text-ink-secondary placeholder:text-ink-dim transition-colors"
        disabled={loading}
      />
      {error && <p className="text-[11px] text-warn">{error}</p>}
      <button
        type="submit"
        disabled={loading || !jobDescription.trim()}
        className="self-start bg-brand text-brand-light text-base font-medium px-5 py-[10px] rounded-md hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Generating..." : "Generate Criteria"}
      </button>
    </form>
  );
}
