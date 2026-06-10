import Link from "next/link";

const stats = [
  { value: "3",   suffix: " steps",  label: "to a ranked shortlist" },
  { value: "PDF", suffix: "",         label: "CVs, no special format" },
  { value: "AI",  suffix: "",         label: "scoring with reasoning" },
];

const features = [
  {
    number: "01",
    title: "Define Criteria",
    description: "Paste a job description. AI extracts must-haves, nice-to-haves, and deal-breakers.",
  },
  {
    number: "02",
    title: "Upload CVs",
    description: "Drop a batch of PDF CVs. The agent reads and scores each one against your criteria.",
  },
  {
    number: "03",
    title: "Get Shortlist",
    description: "A ranked list with scores, verdict, and reasoning for every candidate.",
  },
];

export default function Home() {
  return (
    <main className="h-[calc(100vh-52px)] flex flex-col bg-surface-low overflow-hidden">
      {/* Hero */}
      <section className="relative dot-grid flex-shrink-0">
        <div className="max-w-4xl mx-auto px-7 pt-10 pb-8">
          <p className="text-xs font-medium text-brand uppercase tracking-[0.12em] mb-3">
            AI-Powered Recruiting
          </p>
          <h1 className="text-[42px] leading-[1.05] font-medium text-ink-primary tracking-[-2px] mb-4">
            Screen CVs in <span className="text-brand">minutes</span>,<br />not hours
          </h1>
          <p className="text-base font-normal text-ink-muted max-w-[420px] leading-relaxed mb-6">
            Built for Indonesian SMBs. Describe a role, upload CVs, and get a ranked shortlist with reasoning — no manual review needed.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/criteria"
              className="bg-brand text-brand-light text-base font-medium px-5 py-2.5 rounded-md hover:bg-brand-hover transition-colors"
            >
              Get Started
            </Link>
            <Link href="/screening" className="text-base text-ink-muted hover:text-ink-secondary transition-colors">
              Upload CVs →
            </Link>
          </div>
        </div>
        <div className="h-8 bg-gradient-to-b from-transparent to-surface-low" />
      </section>

      {/* Stat row */}
      <section className="max-w-4xl mx-auto px-7 w-full flex-shrink-0">
        <div className="border-t border-surface-borderHigh grid grid-cols-3">
          {stats.map((s, i) => (
            <div key={i} className={`py-4 pr-7 ${i > 0 ? "pl-7 border-l border-surface-borderHigh" : ""}`}>
              <p className="text-2xl font-medium text-brand tracking-[-1px]">
                {s.value}<span className="text-ink-dim">{s.suffix}</span>
              </p>
              <p className="text-xs font-normal text-ink-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <section className="max-w-4xl mx-auto px-7 w-full flex-shrink-0">
        <div className="border-t border-b border-surface-borderHigh flex items-center gap-4 py-2">
          <span className="text-2xs font-medium text-ink-dim uppercase tracking-[0.1em]">How it works</span>
          <div className="flex-1 h-px bg-surface-borderHigh" />
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-4xl mx-auto px-7 w-full flex-1">
        <div className="grid grid-cols-3 h-full border-b border-surface-borderHigh">
          {features.map((f, i) => (
            <div key={i} className={`py-5 pr-7 ${i > 0 ? "pl-7 border-l border-surface-borderHigh" : ""}`}>
              <p className="text-2xs font-medium text-ink-dim uppercase tracking-[0.1em] mb-3">{f.number}</p>
              <h3 className="text-lg font-medium text-ink-primary mb-2">{f.title}</h3>
              <p className="text-sm font-normal text-ink-muted leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
