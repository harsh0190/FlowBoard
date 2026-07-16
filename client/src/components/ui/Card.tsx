import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;

  className?: string;

  onClick?: () => void;
}

export default function Card({
  children,

  className = "",

  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`

bg-white

rounded-2xl

shadow-sm

border

border-gray-100

p-6

${onClick ? "cursor-pointer" : ""}


${className}


`}
    >
      {children}
    </div>
  );
}
