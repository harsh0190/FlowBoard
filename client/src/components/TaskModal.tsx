import { useEffect, useState } from "react";
import { X, Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { updateTask } from "../features/task/taskSlice";
import { useAppDispatch } from "../hooks/redux";
import {
  addCommentApi,
  getTaskActivityApi,
  updateTaskApi,
  isConflict,
} from "../features/task/taskApi";

import Button from "./ui/Button";

type Priority = "low" | "medium" | "high";

type Comment = {
  _id?: string;
  text: string;
  createdAt?: string;
  user?: { name?: string };
};

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  version: number;
  comments?: Comment[];
};

type ActivityItem = { _id: string; message: string; createdAt: string };

type Draft = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
};

type UpdateTaskPayload = {
  version: number;
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
};

type Conflict = { latest: Task; fields: (keyof Draft)[] };

const FIELD_LABEL: Record<keyof Draft, string> = {
  title: "Title",
  description: "Description",
  priority: "Priority",
  dueDate: "Due date",
};

const toDraft = (t: Task): Draft => ({
  title: t.title,
  description: t.description ?? "",
  priority: t.priority,
  dueDate: t.dueDate ? t.dueDate.split("T")[0] : "",
});

const changedFields = (base: Draft, draft: Draft) =>
  (Object.keys(base) as (keyof Draft)[]).filter(
    (k) => (k === "title" ? draft[k].trim() : draft[k]) !== base[k],
  );

const show = (v: string) => v || "(empty)";

type TaskModalProps = { task: Task; close: () => void };

export default function TaskModal({ task, close }: TaskModalProps) {
  const dispatch = useAppDispatch();

  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [base, setBase] = useState<Draft | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [conflict, setConflict] = useState<Conflict | null>(null);

  const commentCount = task.comments?.length ?? 0;

  useEffect(() => {
    let cancelled = false;

    getTaskActivityApi(task._id)
      .then((logs) => !cancelled && setActivity(logs))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [task._id, commentCount, task.version]);

  const startEdit = () => {
    const d = toDraft(task);
    setBase(d);
    setDraft(d);
    setConflict(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setConflict(null);
  };

  const save = async (version: number, attempt = 0) => {
    if (!base || !draft) return;

    const fields = changedFields(base, draft);
    if (fields.length === 0) {
      toast("No changes to save.");
      return cancelEdit();
    }
    if (!draft.title.trim()) return toast.error("Title is required.");

    const payload: UpdateTaskPayload = { version };
    if (fields.includes("title")) payload.title = draft.title.trim();
    if (fields.includes("description")) payload.description = draft.description;
    if (fields.includes("priority")) payload.priority = draft.priority;
    if (fields.includes("dueDate")) payload.dueDate = draft.dueDate || null;

    try {
      setSaving(true);
      const saved = await updateTaskApi(task._id, payload);
      dispatch(updateTask(saved));
      cancelEdit();
      toast.success(
        attempt > 0 ? "Merged with someone else's changes." : "Task updated.",
      );
    } catch (e: unknown) {
      if (!isConflict(e)) return toast.error("Unable to update task.");

      const latest = (
        e as { response: { data: { currentTask: Task } } }
      ).response.data.currentTask;
      dispatch(updateTask(latest as Parameters<typeof updateTask>[0]));

      const theirs = toDraft(latest);
      const overlap = fields.filter((k) => theirs[k] !== base[k]);

      if (overlap.length === 0 && attempt < 2) {
        // They edited other fields: safe to apply mine on top of their version
        setSaving(false);
        return save(latest.version, attempt + 1);
      }

      setConflict({ latest, fields: overlap });
    } finally {
      setSaving(false);
    }
  };

  const addComment = async () => {
    if (!comment.trim() || sending) return;

    try {
      setSending(true);
      const updated = await addCommentApi(task._id, comment);
      dispatch(updateTask(updated));
      setComment("");
    } catch {
      toast.error("Unable to add comment.");
    } finally {
      setSending(false);
    }
  };

  const field =
    "w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] md:w-125 max-h-[90vh] overflow-y-auto p-8 relative">
        <button
          onClick={close}
          className="absolute right-5 top-5 border border-red-500 text-red-500 rounded-full p-1 hover:bg-red-500 hover:text-white transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {!editing || !draft ? (
          <>
            <div className="flex items-start gap-3 mb-2 pr-10">
              <h1 className="text-2xl font-bold">{task.title}</h1>
              <button
                onClick={startEdit}
                aria-label="Edit task"
                className="mt-1 text-gray-500 hover:text-indigo-600 cursor-pointer"
              >
                <Pencil size={18} />
              </button>
            </div>

            <p className="text-gray-600 mb-3">{task.description}</p>

            <p className="text-sm text-gray-500 mb-5">
              Priority: <span className="font-medium">{task.priority}</span>
              {task.dueDate && (
                <> · Due: {new Date(task.dueDate).toLocaleDateString()}</>
              )}
            </p>
          </>
        ) : (
          <div className="space-y-3 mb-5 pr-10">
            <input
              className={field}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Title"
            />

            <textarea
              className={field}
              rows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              placeholder="Description"
            />

            <div className="flex gap-3">
              <select
                className={field}
                value={draft.priority}
                onChange={(e) =>
                  setDraft({ ...draft, priority: e.target.value as Priority })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                className={field}
                value={draft.dueDate}
                onChange={(e) =>
                  setDraft({ ...draft, dueDate: e.target.value })
                }
              />
            </div>

            {conflict && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
                <p className="font-semibold text-amber-900 mb-2">
                  Someone else changed this task while you were editing.
                </p>

                <table className="w-full text-left mb-3">
                  <thead className="text-amber-800">
                    <tr>
                      <th className="pr-3">Field</th>
                      <th className="pr-3">Yours</th>
                      <th>Theirs</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800">
                    {conflict.fields.map((k) => (
                      <tr key={k}>
                        <td className="pr-3 font-medium">{FIELD_LABEL[k]}</td>
                        <td className="pr-3">{show(draft[k])}</td>
                        <td>{show(toDraft(conflict.latest)[k])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex gap-2">
                  <Button
                    disabled={saving}
                    onClick={() => save(conflict.latest.version, 1)}
                  >
                    Keep mine
                  </Button>
                  <Button
                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    onClick={cancelEdit}
                  >
                    Use theirs
                  </Button>
                </div>
              </div>
            )}

            {!conflict && (
              <div className="flex gap-2">
                <Button disabled={saving} onClick={() => save(task.version)}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        <hr className="mb-5 border-gray-200" />

        <h2 className="font-semibold mb-3">Comments</h2>

        <div className="space-y-3 max-h-52 overflow-y-auto mb-5">
          {commentCount > 0 ? (
            task.comments!.map((c, i) => (
              <div
                key={c._id ?? i}
                className="flex gap-3 rounded-xl border border-indigo-100 border-l-4 border-l-indigo-500 bg-indigo-50 p-3"
              >
                <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center">
                  {c.user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-indigo-900">
                    {c.user?.name ?? "Unknown"}
                  </p>
                  <p className="text-gray-800 wrap-break-word">{c.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No comments yet</p>
          )}
        </div>

        <input
          className={`${field} rounded-xl p-3 mb-4`}
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addComment()}
        />

        <Button onClick={addComment} disabled={sending}>
          {sending ? "Adding..." : "Add Comment"}
        </Button>

        <h2 className="font-semibold mb-3 mt-8 pt-6 border-t border-gray-200">
          Activity
        </h2>

        <ul className="space-y-3 max-h-40 overflow-y-auto text-sm">
          {activity.length > 0 ? (
            activity.map((a) => (
              <li key={a._id} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                <div>
                  <p className="text-gray-600">{a.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-400">No activity yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}
