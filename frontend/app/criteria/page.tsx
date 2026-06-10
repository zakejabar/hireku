"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CriteriaForm from "@/components/CriteriaForm";
import { CriteriaOutput, Criterion } from "@/lib/api";

const weightLabel: Record<number, { label: string; style: string }> = {
  3: { label: "Must Have",    style: "bg-brand-dim text-brand" },
  2: { label: "Important",   style: "bg-surface-high text-ink-muted" },
  1: { label: "Nice to Have",style: "bg-surface-high text-ink-dim" },
};

function CriterionItem({ criterion }: { criterion: Criterion }) {
  const wl = weightLabel[criterion.weight] ?? weightLabel[1];
  return (
    <li className="flex flex-col gap-1.5 py-3 border-b border-surface-borderHigh last:border-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-base font-medium text-ink-secondary">{criterion.name}</span>
        <span className={`shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-sm ${wl.style}`}>
          {wl.label}
        </span>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed">{criterion.description}</p>
    </li>
  );
}

export default function CriteriaPage() {
  const [criteria, setCriteria] = useState<CriteriaOutput | null>(null);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  function handleCriteriaGenerated(c: CriteriaOutput) {
    setCriteria(c);
    localStorage.setItem("hireku_criteria", JSON.stringify(c));
  }

  return (
    <main className="max-w-4xl mx-auto px-7 py-10">
      {/* Page header with teal left accent */}
      <div className="pl-4 border-l-2 border-brand mb-8">
        <p className="text-2xs font-medium text-brand uppercase tracking-[0.1em] mb-1.5">Step 01</p>
        <h1 className="text-2xl font-medium text-ink-primary mb-1">Build Hiring Criteria</h1>
        <p className="text-sm text-ink-muted">Paste a job description — AI structures it into scoreable criteria.</p>
      </div>

      <CriteriaForm onCriteriaGenerated={handleCriteriaGenerated} onLoadingChange={setGenerating} />

      {generating && (
        <div className="mt-5 bg-surface-mid border border-surface-borderHigh rounded-md px-4 py-3 flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border border-brand border-t-transparent animate-spin shrink-0" />
          <div>
            <p className="text-base font-medium text-ink-secondary">Analyzing job description...</p>
            <p className="text-2xs text-ink-dim mt-0.5">AI is extracting criteria — takes a few seconds</p>
          </div>
        </div>
      )}

      {criteria && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xs font-medium text-ink-muted uppercase tracking-[0.1em] mb-1">Role</p>
              <h2 className="text-xl font-medium text-ink-primary">{criteria.role}</h2>
            </div>
            <button
              onClick={() => router.push("/screening")}
              className="text-base font-medium text-brand border border-brand px-3 py-[5px] rounded-md hover:bg-brand-dim transition-colors"
            >
              Proceed to Screening →
            </button>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface-mid border border-surface-borderHigh rounded-md p-4">
              <p className="text-2xs font-medium text-ink-muted uppercase tracking-[0.1em] mb-2">Must-Have</p>
              <ul>
                {criteria.must_have.map((c, i) => <CriterionItem key={i} criterion={c} />)}
              </ul>
            </div>
            <div className="bg-surface-mid border border-surface-borderHigh rounded-md p-4">
              <p className="text-2xs font-medium text-ink-muted uppercase tracking-[0.1em] mb-2">Nice-to-Have</p>
              <ul>
                {criteria.nice_to_have.map((c, i) => <CriterionItem key={i} criterion={c} />)}
              </ul>
            </div>
          </div>

          {/* Deal-breakers */}
          <div className="bg-surface-mid border border-surface-borderHigh rounded-md p-4">
            <p className="text-2xs font-medium text-ink-muted uppercase tracking-[0.1em] mb-3">Deal-Breakers</p>
            <div className="flex flex-wrap gap-2">
              {criteria.deal_breakers.map((d, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-warn bg-warn-dim text-[9px] font-medium px-2 py-1 rounded-sm">
                  <span className="w-1 h-1 rounded-full bg-warn shrink-0" />
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
