"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UploadZone from "@/components/UploadZone";
import { CriteriaOutput, uploadCVs } from "@/lib/api";

export default function ScreeningPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [criteria, setCriteria] = useState<CriteriaOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("hireku_criteria");
    if (stored) setCriteria(JSON.parse(stored));
  }, []);

  async function handleStart() {
    if (!criteria || files.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const { job_id } = await uploadCVs(files, criteria);
      router.push(`/screening/${job_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-7 py-10">
      {/* Page header */}
      <div className="pl-4 border-l-2 border-brand mb-8">
        <p className="text-2xs font-medium text-brand uppercase tracking-[0.1em] mb-1.5">Step 02</p>
        <h1 className="text-2xl font-medium text-ink-primary mb-1">Screen CVs</h1>
        {criteria ? (
          <p className="text-sm text-ink-muted">
            Screening for: <span className="text-ink-secondary font-medium">{criteria.role}</span>
          </p>
        ) : (
          <p className="text-sm text-warn">
            No criteria found.{" "}
            <a href="/criteria" className="underline hover:text-ink-secondary transition-colors">Generate criteria first →</a>
          </p>
        )}
      </div>

      <UploadZone files={files} onFilesSelected={setFiles} />

      {error && <p className="text-[11px] text-warn mt-3">{error}</p>}

      {loading && (
        <div className="mt-4 bg-surface-mid border border-surface-borderHigh rounded-md px-4 py-3 flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border border-brand border-t-transparent animate-spin shrink-0" />
          <div>
            <p className="text-base font-medium text-ink-secondary">Uploading CVs...</p>
            <p className="text-2xs text-ink-dim mt-0.5">
              Sending {files.length} file{files.length !== 1 ? "s" : ""} to the screening queue
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={loading || files.length === 0 || !criteria}
        className="mt-4 w-full bg-brand text-brand-light text-base font-medium py-[10px] rounded-md hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Uploading..." : `Screen ${files.length} CV${files.length !== 1 ? "s" : ""}`}
      </button>
    </main>
  );
}
