"use client";

import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/common/Input";

interface AuthenticationDrawerProps {
  authEnabled: boolean;
  setAuthEnabled: (val: boolean) => void;
  authMethod: "form" | "basic_auth" | "storage_state";
  setAuthMethod: (val: "form" | "basic_auth" | "storage_state") => void;
  loginUrl: string;
  setLoginUrl: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  successIndicator: string;
  setSuccessIndicator: (val: string) => void;
}

export function AuthenticationDrawer({
  authEnabled,
  setAuthEnabled,
  authMethod,
  setAuthMethod,
  loginUrl,
  setLoginUrl,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  successIndicator,
  setSuccessIndicator,
}: AuthenticationDrawerProps) {
  return (
    <div className="pt-3 border-t border-[#E6E6E6]">
      <div className="bg-[#FBF9F8] border border-[#E6E6E6] rounded-xl p-3.5 sm:p-4 transition-all">
        <Switch
          label="This site requires authentication"
          description="Provide credentials so the background agent can authenticate before executing test scenarios."
          checked={authEnabled}
          onChange={setAuthEnabled}
        />

        {/* Expandable Credentials Drawer */}
        {authEnabled && (
          <div className="mt-3 pt-3 border-t border-[#E6E6E6] space-y-3.5 animate-in fade-in duration-200">
            {/* Auth Method Selector */}
            <div>
              <label className="block text-xs font-medium text-[#594139] mb-1">
                Authentication Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod("form")}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    authMethod === "form"
                      ? "bg-white border-[#FF6C37] text-[#FF6C37] shadow-2xs font-semibold"
                      : "bg-white/60 border-[#E6E6E6] text-[#6B6B6B] hover:border-[#D0D0D0]"
                  }`}
                >
                  Form-based Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod("basic_auth")}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    authMethod === "basic_auth"
                      ? "bg-white border-[#FF6C37] text-[#FF6C37] shadow-2xs font-semibold"
                      : "bg-white/60 border-[#E6E6E6] text-[#6B6B6B] hover:border-[#D0D0D0]"
                  }`}
                >
                  HTTP Basic Auth
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod("storage_state")}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    authMethod === "storage_state"
                      ? "bg-white border-[#FF6C37] text-[#FF6C37] shadow-2xs font-semibold"
                      : "bg-white/60 border-[#E6E6E6] text-[#6B6B6B] hover:border-[#D0D0D0]"
                  }`}
                >
                  Session Cookie / Token
                </button>
              </div>
            </div>

            {/* Login Page URL */}
            <div>
              <label className="block text-xs font-medium text-[#594139] mb-1">
                Login Page URL <span className="text-[#8C8C8C] font-normal">(optional if different from entry URL)</span>
              </label>
              <input
                type="text"
                value={loginUrl}
                onChange={(e) => setLoginUrl(e.target.value)}
                placeholder="e.g. /login or https://example.com/signin (Auto-detected if empty)"
                className="w-full h-9 px-3 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37] focus:ring-2 focus:ring-[#FFF1EB]"
              />
            </div>

            {/* Credentials Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#594139] mb-1">
                  {authMethod === "storage_state" ? "Cookie / Header Name" : "Username / Test Email"}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={authMethod === "storage_state" ? "e.g. session_token" : "qa-tester@example.com"}
                  className="w-full h-9 px-3 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37] focus:ring-2 focus:ring-[#FFF1EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#594139] mb-1">
                  {authMethod === "storage_state" ? "Secret Value / Bearer Token" : "Password / Secure Secret"}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-9 pl-3 pr-8 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37] focus:ring-2 focus:ring-[#FFF1EB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 p-1 text-[#8C8C8C] hover:text-[#212121] transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Success Indicator */}
            <div>
              <label className="block text-xs font-medium text-[#594139] mb-1">
                Login Success Indicator <span className="text-[#8C8C8C] font-normal">(optional DOM selector or URL regex)</span>
              </label>
              <input
                type="text"
                value={successIndicator}
                onChange={(e) => setSuccessIndicator(e.target.value)}
                placeholder="e.g. #dashboard, [data-testid='user-avatar'], or /home"
                className="w-full h-9 px-3 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37] focus:ring-2 focus:ring-[#FFF1EB]"
              />
            </div>

            {/* Security Badge */}
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#8C8C8C]">
              <Lock className="w-3.5 h-3.5 text-[#12B76A] shrink-0" />
              <span>Credentials are encrypted via AES-256 GCM upon receipt and used only within this isolated run.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
