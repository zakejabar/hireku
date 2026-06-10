"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getJobStatus, JobStatus, CandidateResult } from "@/lib/api";
import ProgressBar from "@/components/ProgressBar";
import CandidateCard from "@/components/CandidateCard";
import SkeletonCard from "@/components/SkeletonCard";

function SummaryBar({ results }: { results: CandidateResult[] }) {
  const hire  = results.filter((r) => r.verdict === "Hire").length;
  const maybe = results.filter((r) => r.verdict === "Maybe").length;
  const pass  = results.filter((r) => r.verdict === "Pass").length;

  return (
    <div className="flex items-center gap-5 bg-surface-mid border border-surface-border rounded-md px-4 py-2.5">
      <p className="text-2xs font-medium text-ink-dim uppercase tracking-[0.1em]">Results</p>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-success" />
        <span className="text-xs font-medium text-success">{hire} Hire</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-warn" />
        <span className="text-xs font-medium text-warn">{maybe} Maybe</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-ink-ghost" />
        <span className="text-xs font-medium text-ink-muted">{pass} Pass</span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [job, setJob] = useState<JobStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    async function poll() {
      try {
        const data = await getJobStatus(jobId);
        setJob(data);
        if (data.status === "done" || data.status === "error") clearInterval(interval);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch status");
        clearInterval(interval);
      }
    }

    poll();
    interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [jobId]);

  const sorted: CandidateResult[] = job
    ? [...job.results].sort((a, b) => b.overall_score - a.overall_score)
    : [];

  const isProcessing = !job || job.status === "processing";
  const skeletonsNeeded = job ? job.total - job.processed : 3;

  return (
    <main className="max-w-3xl mx-auto px-7 py-10">
      <div className="pl-4 border-l-2 border-brand mb-6">
        <p className="text-2xs font-medium text-brand uppercase tracking-[0.1em] mb-1.5">Step 03</p>
        <h1 className="text-2xl font-medium text-ink-primary mb-1">Screening Results</h1>
        {isProcessing && (
          <p className="text-sm text-ink-muted">Results appear as each CV is processed.</p>
        )}
      </div>

      {error && <p className="text-[11px] text-warn mb-5">{error}</p>}

      {job && job.status === "processing" && (
        <div className="mb-5">
          <ProgressBar processed={job.processed} total={job.total} />
        </div>
      )}

      {job && job.status === "done" && sorted.length > 0 && (
        <div className="mb-4">
          <SummaryBar results={sorted} />
        </div>
      )}

      <div className="space-y-2">
        {sorted.map((c, i) => (
          <CandidateCard key={c.filename} candidate={c} rank={i + 1} />
        ))}
        {isProcessing &&
          Array.from({ length: Math.max(0, skeletonsNeeded) }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
      </div>

      {job && job.status === "done" && sorted.length === 0 && (
        <p className="text-sm text-ink-muted">No results found.</p>
      )}
    </main>
  );
}
