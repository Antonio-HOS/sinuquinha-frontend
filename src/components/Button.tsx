import { gajrajOne } from "@/src/fonts";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "danger" | "success" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  name?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-[#FFD700] bg-[#FFD700] text-black hover:bg-[#FFEDAD]",
  outline: "border-[#FFD700] bg-transparent text-[#FFD700] hover:bg-[#FFD700] hover:text-black",
  danger: "border-[#FFD700] bg-transparent text-[#FFD700] hover:bg-[#FFD700] hover:text-black",
  success: "border-[#2AC054] bg-transparent text-[#2AC054] hover:bg-[#2AC054] hover:text-[#004C55]",
  ghost: "border-transparent bg-white/10 text-[#FFEDAD] hover:bg-white/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-12 px-5 text-xl",
  lg: "h-14 px-6 text-[2rem]",
};

export function getButtonClassName({
  variant = "danger",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return `${gajrajOne.className} inline-flex items-center justify-center rounded-md border leading-none transition-colors active:scale-[0.98] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
}

export default function Button({
  name,
  children,
  variant = "danger",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={getButtonClassName({ variant, size, className })}
      {...props}
    >
      {children ?? name}
    </button>
  );
}
