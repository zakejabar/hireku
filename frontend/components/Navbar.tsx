import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[52px] bg-surface-mid border-b border-surface-border flex items-center px-7">
      <div className="w-full flex items-center justify-between">
        <Link href="/">
          <span className="text-xl font-medium tracking-tight">
            <span className="text-ink-primary">Hire</span>
            <span className="text-brand">Ku</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/criteria"
            className="text-base text-ink-muted font-normal hover:text-ink-secondary hover:bg-surface-high px-3 py-1.5 rounded-md transition-colors"
          >
            Criteria
          </Link>
          <Link
            href="/screening"
            className="text-base text-ink-muted font-normal hover:text-ink-secondary hover:bg-surface-high px-3 py-1.5 rounded-md transition-colors"
          >
            Screen CVs
          </Link>
          <Link
            href="/criteria"
            className="ml-3 text-base font-medium text-brand border border-brand px-4 py-2 rounded-md hover:bg-brand-dim transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
