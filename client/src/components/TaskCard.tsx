import { useState } from "react";

import { useDraggable } from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";

import { Calendar, MessageCircle, Trash2 } from "lucide-react";

import TaskModal from "./TaskModal";

import { deleteTaskApi } from "../features/task/taskApi";

import toast from "react-hot-toast";

export default function TaskCard({ task }: any) {
  const [open, setOpen] = useState(false);
  const deleteTask = async (
  e: React.MouseEvent
) => {
  e.stopPropagation();

  try {
    await deleteTaskApi(task._id);

    toast.success("Task deleted");
    setTimeout(() => {
  window.location.reload();
}, 300);
  } catch {
    toast.error("Unable to delete task");
  }
};

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
        <div
  className="
flex
justify-between
items-start
"
>
  <h2
    className="
font-bold
text-lg
"
  >
    {task.title}
  </h2>

  <button
    onClick={deleteTask}
    onPointerDown={(e) => e.stopPropagation()}
    className="
p-2

rounded-lg

text-red-500

hover:bg-red-50

transition

cursor-pointer
"
  >
    <Trash2 size={18} />
  </button>
</div>

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
