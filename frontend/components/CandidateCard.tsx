import { CandidateResult } from "@/lib/api";

interface Props {
  candidate: CandidateResult;
  rank: number;
}

function verdictBadge(verdict: string) {
  if (verdict === "Hire")  return { bg: "bg-success-dim",  text: "text-success",   label: "Hire" };
  if (verdict === "Maybe") return { bg: "bg-warn-dim",     text: "text-warn",      label: "Maybe" };
  return                          { bg: "bg-surface-high", text: "text-ink-dim",   label: "Pass" };
}

function ringColor(verdict: string) {
  if (verdict === "Hire")  return "#10b981";
  if (verdict === "Maybe") return "#d97706";
  return "#cbd5e1";
}

function barColor(score: number) {
  if (score >= 7) return "#10b981";
  if (score >= 4) return "#d97706";
  return "#cbd5e1";
}

function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const size = 44;
  const stroke = 3;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const fill = ringColor(verdict);
  const numColor = verdict === "Pass" ? "#94a3b8" : "#0f172a";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={22} cy={22} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={22} cy={22} r={r} fill="none"
          stroke={fill} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontSize: 11, fontWeight: 500, color: numColor, lineHeight: 1 }}>
          {Math.round(score)}
        </span>
      </div>
    </div>
  );
}

export default function CandidateCard({ candidate, rank }: Props) {
  const badge = verdictBadge(candidate.verdict);
  const nameColor = candidate.verdict === "Pass" ? "text-ink-muted" : "text-ink-secondary";

  return (
    <div className="bg-surface-mid border border-surface-border rounded-md px-[14px] py-3 flex gap-3 hover:border-surface-borderFocus transition-colors">
      <ScoreRing score={candidate.overall_score} verdict={candidate.verdict} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-base font-medium truncate ${nameColor}`}>
              {candidate.candidate_name}
            </span>
            <span className={`shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-sm ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          </div>
          <span className="text-2xs text-ink-dim shrink-0">#{rank}</span>
        </div>

        <p className="text-2xs text-ink-dim mb-2 truncate">{candidate.filename}</p>
        <p className="text-sm text-ink-muted leading-relaxed mb-3">{candidate.summary}</p>

        {candidate.scores.length > 0 && (
          <details className="group">
            <summary className="text-2xs text-ink-muted hover:text-ink-secondary cursor-pointer list-none flex items-center gap-1 mb-2">
              <svg className="w-2.5 h-2.5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Criteria breakdown
            </summary>
            <ul className="space-y-[6px]">
              {candidate.scores.map((s, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span
                    className="shrink-0 text-ink-dim"
                    style={{ fontSize: 9, width: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {s.criterion_name}
                  </span>
                  <div className="flex-1 relative rounded-sm" style={{ height: 2, backgroundColor: "#e2e8f0" }}>
                    <div
                      className="absolute inset-y-0 left-0 rounded-sm transition-[width] duration-300"
                      style={{ width: `${s.score * 10}%`, backgroundColor: barColor(s.score) }}
                    />
                  </div>
                  <span className="shrink-0 text-ink-dim text-right" style={{ fontSize: 9, width: 16 }}>
                    {s.score}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
