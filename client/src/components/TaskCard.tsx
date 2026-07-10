import { useState } from "react";

import { useDraggable } from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";

import { Calendar, MessageCircle } from "lucide-react";

import TaskModal from "./TaskModal";

export default function TaskCard({ task }: any) {
  const [open, setOpen] = useState(false);

  const {
    attributes,

    listeners,

    setNodeRef,

    transform,

    isDragging,
  } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),

    opacity: isDragging ? 0.6 : 1,
  };

  const priorityColor: any = {
    low: "bg-green-100 text-green-600",

    medium: "bg-yellow-100 text-yellow-600",

    high: "bg-red-100 text-red-600",
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`

bg-white

rounded-2xl

shadow

p-6

hover:-translate-y-1

transition

select-none


${isDragging ? "cursor-grabbing" : "cursor-pointer"}


`}
      >
        <h2
          className="
font-bold
text-lg
"
        >
          {task.title}
        </h2>

        <p
          className="
text-gray-500
mt-3
"
        >
          {task.description}
        </p>

        <div
          className="
flex
items-center
gap-2
mt-6
text-gray-400
text-sm
"
        >
          <Calendar size={16} />
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </div>

        <div
          className="
flex
justify-between
items-center
mt-5
"
        >
          <span
            className={`

px-3

py-1

rounded-full

text-sm

${priorityColor[task.priority]}

`}
          >
            {task.priority}
          </span>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();

              setOpen(true);
            }}
            className="
flex
gap-1
items-center

cursor-pointer

hover:text-indigo-600

transition
"
          >
            <MessageCircle size={16} />

            {task.comments?.length || 0}
          </button>
        </div>
      </div>

      {open && <TaskModal task={task} close={() => setOpen(false)} />}
    </>
  );
}
