import { X } from "lucide-react";

interface Props {
  open: boolean;

  close: () => void;

  title: string;

  children: React.ReactNode;
}

export default function Modal({
  open,

  close,

  title,

  children,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
"
    >
      <div
        className="
bg-white
rounded-xl
shadow-xl
w-[90%]
md:w-112.5
p-6
"
      >
        <div
          className="
flex
items-center
justify-between
mb-5
"
        >
          <h2
            className="
text-xl
font-bold
"
          >
            {title}
          </h2>

          <button
            onClick={close}
            className="
cursor-pointer
hover:text-red-500
transition
"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
