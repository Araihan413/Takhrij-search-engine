import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass";
  icon?: React.ReactNode;
}

export const Button = ({
  children,
  className,
  variant = "primary",
  icon,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90",
    secondary: "bg-[var(--foreground)]/5 text-[var(--foreground)] hover:bg-[var(--foreground)]/10 border border-[var(--border)]",
    glass: "bg-[var(--foreground)]/10 text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--foreground)]/20",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all active:scale-95 disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
      {icon && <span className="opacity-60">{icon}</span>}
    </button>
  );
};
