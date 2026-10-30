"use client";

import React from "react";
import { Globe, Lock, Unlock } from "lucide-react";

export type TargetEnvType = "production" | "staging" | "test" | "local";

export interface EnvConfig {
  label: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  dotColor: string;
}

interface UrlProtocolInputProps {
  protocol: "https://" | "http://";
  setProtocol: (val: "https://" | "http://") => void;
  domainPath: string;
  onDomainChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullTargetUrl: string;
  manualEnv: TargetEnvType | "auto";
  setManualEnv: (env: TargetEnvType | "auto") => void;
  envConfig: EnvConfig;
  urlError: string;
}

export function UrlProtocolInput({
  protocol,
  setProtocol,
  domainPath,
  onDomainChange,
  fullTargetUrl,
  manualEnv,
  setManualEnv,
  envConfig,
  urlError,
}: UrlProtocolInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor="domain-path-input" className="text-xs font-semibold text-[#212121]">
          Target Website URL *
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#6B6B6B]">Environment:</span>
          <select
            value={manualEnv}
            onChange={(e) => setManualEnv(e.target.value as TargetEnvType | "auto")}
            className="text-[11px] font-medium bg-[#F5F3F3] border border-[#E6E6E6] rounded px-2 py-0.5 text-[#212121] focus:outline-none focus:border-[#FF6C37]"
            aria-label="Target Environment"
          >
            <option value="auto">Auto ({envConfig.label})</option>
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="test">QA / Test</option>
            <option value="local">Local / Dev</option>
          </select>
        </div>
      </div>

      {/* Unified Protocol + Domain Input Group */}
      <div className="relative flex items-center shadow-2xs rounded-lg overflow-hidden border transition-all duration-150 focus-within:ring-2 focus-within:ring-[#FFF1EB] focus-within:border-[#FF6C37] border-[#E6E6E6]">
        {/* Protocol Selector Dropdown */}
        <div className="relative shrink-0 border-r border-[#E6E6E6] bg-[#F9F8F8]">
          <div className="flex items-center pl-3 pr-2 py-2 gap-1.5 text-xs font-semibold text-[#594139]">
            {protocol === "https://" ? (
              <Lock className="w-3.5 h-3.5 text-[#12B76A]" />
            ) : (
              <Unlock className="w-3.5 h-3.5 text-[#F79009]" />
            )}
            <select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value as "https://" | "http://")}
              className="bg-transparent text-xs font-mono font-medium text-[#212121] focus:outline-none cursor-pointer pr-1"
              aria-label="Target Protocol"
            >
              <option value="https://">https://</option>
              <option value="http://">http://</option>
            </select>
          </div>
        </div>

        {/* Domain & Path Input */}
        <div className="relative flex-1 flex items-center">
          <Globe className="w-4 h-4 absolute left-3 text-[#8C8C8C] pointer-events-none" />
          <input
            id="domain-path-input"
            type="text"
            required
            value={domainPath}
            onChange={onDomainChange}
            placeholder="example.com"
            className="w-full h-10 pl-9 pr-3 bg-white text-sm text-[#212121] placeholder-[#8C8C8C] focus:outline-none"
          />
        </div>
      </div>

      {/* Subtext and Dynamic Full URL Preview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-1.5">
        {urlError ? (
          <p className="text-xs text-[#BA1A1A] font-medium">{urlError}</p>
        ) : (
          <p className="text-xs text-[#6B6B6B]">
            Protocol is selectable; paste any URL and it will auto-format.
          </p>
        )}

        {fullTargetUrl && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#594139] bg-[#F5F3F3] px-2.5 py-0.5 rounded border border-[#E6E6E6] self-start sm:self-auto">
            <span className="text-[10px] uppercase font-semibold text-[#8C8C8C]">Target:</span>
            <span className="font-semibold text-[#212121] truncate max-w-[260px] sm:max-w-[340px]">
              {fullTargetUrl}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
