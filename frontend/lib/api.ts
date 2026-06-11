const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const baseHeaders: Record<string, string> = {
  "ngrok-skip-browser-warning": "true",
};

export interface Criterion {
  name: string;
  description: string;
  weight: number;
}

export interface CriteriaOutput {
  role: string;
  must_have: Criterion[];
  nice_to_have: Criterion[];
  deal_breakers: string[];
}

export interface CandidateScore {
  criterion_name: string;
  score: number;
  reasoning: string;
}

export interface CandidateResult {
  filename: string;
  candidate_name: string;
  overall_score: number;
  verdict: "Hire" | "Maybe" | "Pass";
  scores: CandidateScore[];
  summary: string;
}

export interface JobStatus {
  job_id: string;
  total: number;
  processed: number;
  status: "processing" | "done" | "error";
  results: CandidateResult[];
}

export async function generateCriteria(jobDescription: string): Promise<CriteriaOutput> {
  const res = await fetch(`${API_BASE}/criteria/generate`, {
    method: "POST",
    headers: { ...baseHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: jobDescription }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadCVs(files: File[], criteria: CriteriaOutput): Promise<{ job_id: string }> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("criteria", JSON.stringify(criteria));
  const res = await fetch(`${API_BASE}/screen/upload`, { method: "POST", headers: baseHeaders, body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const res = await fetch(`${API_BASE}/screen/status/${jobId}`, { headers: baseHeaders });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getReport(jobId: string): Promise<JobStatus> {
  const res = await fetch(`${API_BASE}/screen/report/${jobId}`, { headers: baseHeaders });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
