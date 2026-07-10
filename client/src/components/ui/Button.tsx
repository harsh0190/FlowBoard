import { type ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger";
}

export default function Button({
  children,

  variant = "primary",

  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`

px-5
py-2
rounded-lg
font-medium
transition
cursor-pointer

${
  variant === "primary"
    ? "bg-indigo-600 text-white hover:bg-indigo-700"
    : "bg-red-500 text-white"
}

`}
    >
      {children}
    </button>
  );
}
