import { type InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={twMerge(
        "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500",
        className,
      )}
    />
  );
}