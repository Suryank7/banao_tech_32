import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20",
    secondary: "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-800/80",
    destructive: "border-transparent bg-red-500/10 text-red-400 hover:bg-red-500/20",
    outline: "text-zinc-300 border-white/10",
    success: "border-transparent bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
