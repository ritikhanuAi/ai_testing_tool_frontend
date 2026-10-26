import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFF1EB] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer rounded-lg";

    const variantClasses = {
      primary:
        "bg-[#FF6C37] hover:bg-[#E8590C] active:bg-[#D9480F] text-white shadow-xs focus:ring-[#FF6C37]",
      secondary:
        "bg-white hover:bg-[#F5F3F3] text-[#212121] border border-[#E6E6E6] hover:border-[#D4D4D4] shadow-xs focus:ring-[#FF6C37]",
      danger:
        "bg-[#BA1A1A] hover:bg-[#93000A] text-white shadow-xs focus:ring-[#BA1A1A]",
      outline:
        "bg-transparent hover:bg-[#F9F9F9] text-[#212121] border border-[#E6E6E6] hover:border-[#D4D4D4] focus:ring-[#FF6C37]",
      ghost:
        "bg-transparent hover:bg-[#F5F3F3] text-[#6B6B6B] hover:text-[#212121] border-none focus:ring-[#FF6C37]",
    };

    const sizeClasses = {
      sm: "h-8 text-xs px-3 gap-1.5",
      md: "h-9 text-sm px-4 gap-2",
      lg: "h-11 text-base px-5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
