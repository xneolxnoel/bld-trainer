import { ReactNode } from "react";

export type BadgeColor = "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "muted";

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
  className?: string;
}

const colors: Record<BadgeColor, string> = {
  primary: "bg-blue-100 text-blue-700 border-blue-200",
  secondary: "bg-purple-100 text-purple-700 border-purple-200",
  accent: "bg-yellow-100 text-yellow-800 border-yellow-200",
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-orange-100 text-orange-700 border-orange-200",
  error: "bg-red-100 text-red-700 border-red-200",
  muted: "bg-muted text-muted-foreground border-border",
};

export default function Badge({ children, color = "primary", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
