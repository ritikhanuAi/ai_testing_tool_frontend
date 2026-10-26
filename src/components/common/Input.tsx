import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#594139]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3.5 py-2 rounded-lg bg-white border border-[#E6E6E6] text-sm text-[#212121] placeholder-[#8C8C8C] transition-all duration-150 focus:outline-none focus:border-[#FF6C37] focus:ring-2 focus:ring-[#FFF1EB] disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#FFDAD6]",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[#BA1A1A] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#8C8C8C]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-[#594139]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-3.5 py-2 rounded-lg bg-white border border-[#E6E6E6] text-sm text-[#212121] transition-all duration-150 focus:outline-none focus:border-[#FF6C37] focus:ring-2 focus:ring-[#FFF1EB] disabled:opacity-50",
            error && "border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#FFDAD6]",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-[#212121]">
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-xs text-[#BA1A1A] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#8C8C8C]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = "Select";

export interface SwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ label, description, checked, onChange, disabled }: SwitchProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="space-y-0.5">
        <label className="text-sm font-medium text-[#212121] cursor-pointer select-none">
          {label}
        </label>
        {description && <p className="text-xs text-[#6B6B6B]">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#FF6C37] focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50",
          checked ? "bg-[#FF6C37]" : "bg-[#E4E2E2]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

export default Input;
