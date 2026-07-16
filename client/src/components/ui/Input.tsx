import { type InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="
w-full
rounded-lg
border
border-gray-300
px-4
py-3
outline-none

focus:ring-2
focus:ring-indigo-500

"
    />
  );
}
