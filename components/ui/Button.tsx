import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-blue-600 shadow-lg shadow-blue-200",
  secondary: "bg-secondary text-secondary-foreground hover:bg-purple-600 shadow-lg shadow-purple-200",
  accent: "bg-accent text-accent-foreground hover:bg-yellow-400 shadow-lg shadow-yellow-200",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  ghost: "text-foreground hover:bg-muted",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-2xl font-semibold
        transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
