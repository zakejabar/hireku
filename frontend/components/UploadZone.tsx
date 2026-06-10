"use client";

import { useRef, useState } from "react";

interface Props {
  files: File[];
  onFilesSelected: (files: File[]) => void;
}

export default function UploadZone({ files, onFilesSelected }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function merge(incoming: File[]) {
    const existingNames = new Set(files.map((f) => f.name));
    const fresh = incoming.filter((f) => !existingNames.has(f.name));
    onFilesSelected([...files, ...fresh]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf"
    );
    if (dropped.length) merge(dropped);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (selected.length) merge(selected);
    e.target.value = "";
  }

  function removeFile(name: string) {
    onFilesSelected(files.filter((f) => f.name !== name));
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border rounded-md p-8 text-center cursor-pointer transition-colors
          ${dragging ? "border-brand bg-brand-dim" : "border-surface-border bg-surface-mid hover:border-surface-borderFocus"}`}
      >
        <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={handleChange} />
        <p className="text-base text-ink-muted">
          {files.length === 0 ? "Drop PDF CVs here or click to browse" : "Drop more or click to add"}
        </p>
        <p className="text-2xs text-ink-dim mt-1">PDF files only</p>
      </div>

      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((f) => (
            <li key={f.name} className="flex items-center justify-between bg-surface-mid border border-surface-border rounded-md px-3 py-2">
              <span className="text-base text-ink-secondary truncate">{f.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(f.name); }}
                className="ml-3 text-ink-dim hover:text-ink-muted transition-colors shrink-0 text-xs"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
