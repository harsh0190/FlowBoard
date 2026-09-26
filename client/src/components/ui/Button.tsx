import { type ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger";
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={twMerge(
        "px-5 py-2 rounded-lg font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary"
          ? "bg-indigo-600 text-white hover:bg-indigo-700"
          : "bg-red-500 text-white hover:bg-red-600",
        className,
      )}
    >
      {children}
    </button>
  );
}