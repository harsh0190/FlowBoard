import { useState } from "react";
import { Calendar, MessageCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import TaskModal from "./TaskModal";
import { deleteTaskApi } from "../features/task/taskApi";
import {
  deleteTask as removeTask,
  type Task,
  type TaskStatus,
} from "../features/task/taskSlice";
import { useAppDispatch } from "../hooks/redux";

const STATUSES: Array<{ id: TaskStatus; label: string }> = [
  { id: "todo", label: "Todo" },
  { id: "in-progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Completed" },
];

const priorityColor: Record<Task["priority"], string> = {
  low: "bg-green-100 text-green-600",
  medium: "bg-yellow-100 text-yellow-600",
  high: "bg-red-100 text-red-600",
};

type TaskCardProps = {
  task: Task;
  onStatusChange: (task: Task, nextStatus: TaskStatus) => void;
};

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    try {
      await deleteTaskApi(task._id);
      dispatch(removeTask(task._id));
      toast.success("Task deleted");
    } catch {
      toast.error("Unable to delete task");
    }
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition cursor-pointer"
      >
        <div className="flex justify-between items-start gap-2">
          <h2 className="font-bold text-lg">{task.title}</h2>
          <button
            onClick={handleDelete}
            aria-label="Delete task"
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {task.description && (
          <p className="text-gray-500 mt-3">{task.description}</p>
        )}

        <div className="flex items-center gap-2 mt-4 text-gray-400 text-sm">
          <Calendar size={16} />
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </div>

        <div className="flex justify-between items-center mt-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${priorityColor[task.priority]}`}
          >
            {task.priority}
          </span>

          <span className="flex gap-1 items-center text-gray-600">
            <MessageCircle size={16} />
            {task.comments?.length || 0}
          </span>
        </div>

        <div
          className="mt-5 pt-4 border-t border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <select
            value=""
            onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
            aria-label="Update status"
            className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 outline-none cursor-pointer transition hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-400"
          >
            <option value="" disabled hidden>
              Update status
            </option>

            {STATUSES.filter((s) => s.id !== task.status).map((s) => (
              <option
                key={s.id}
                value={s.id}
                className="text-gray-800 bg-white"
              >
                Move to {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {open && <TaskModal task={task} close={() => setOpen(false)} />}
    </>
  );
}
