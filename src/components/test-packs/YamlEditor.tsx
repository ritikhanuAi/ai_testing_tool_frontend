"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import Monaco Editor with SSR disabled
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#0d1322] text-slate-400 gap-2">
      <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
      <span className="text-xs">Loading Monaco YAML Studio...</span>
    </div>
  ),
});

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export function YamlEditor({ value, onChange, height = "540px" }: YamlEditorProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0d1322] shadow-inner">
      <MonacoEditor
        height={height}
        language="yaml"
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          renderWhitespace: "selection",
          smoothScrolling: true,
          fontFamily: "var(--font-geist-mono), 'Fira Code', monospace",
        }}
      />
    </div>
  );
}
