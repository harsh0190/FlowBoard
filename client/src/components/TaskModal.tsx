import { useState } from "react";

import { X } from "lucide-react";

import { updateTask } from "../features/task/taskSlice";

import { useAppDispatch } from "../hooks/redux";

import { addCommentApi } from "../features/task/taskApi";

import Button from "./ui/Button";

export default function TaskModal({
  task,

  close,
}: any) {
  const dispatch = useAppDispatch();

  const [comment, setComment] = useState("");

  const addComment = async () => {
    if (!comment.trim()) return;

    const updated = await addCommentApi(
      task._id,

      comment,
    );

    dispatch(updateTask(updated));

    setComment("");
  };

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

rounded-2xl

shadow-2xl

w-[90%]
md:w-125

p-8

relative
"
      >
        <button
          onClick={close}
          className="
absolute

right-5

top-5


border
border-red-500

text-red-500

rounded-full

p-1


hover:bg-red-500
hover:text-white

transition

cursor-pointer
"
        >
          <X size={18} />
        </button>

        <h1
          className="
text-2xl

font-bold

mb-2
"
        >
          {task.title}
        </h1>

        <p
          className="
text-gray-600

mb-5
"
        >
          {task.description}
        </p>

        <hr className="mb-5" />

        <h2
          className="
font-semibold

mb-3
"
        >
          Comments
        </h2>

        <div
          className="
space-y-3

max-h-52

overflow-y-auto

mb-5
"
        >
          {task.comments?.length > 0 ? (
            task.comments.map((c: any) => (
              <div
                key={c._id}
                className="
bg-gray-50

border

rounded-xl

p-4
"
              >
                <p
                  className="
text-gray-800
"
                >
                  {c.text}
                </p>

                <small
                  className="
text-gray-400
"
                >
                  {c.user?.name}
                </small>
              </div>
            ))
          ) : (
            <p
              className="
text-gray-400

text-sm
"
            >
              No comments yet
            </p>
          )}
        </div>

        <input
          className="
w-full

border

rounded-xl

p-3

outline-none

focus:ring-2
focus:ring-indigo-500

mb-4
"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button
          onClick={addComment}
          className="
cursor-pointer
"
        >
          Add Comment
        </Button>
      </div>
    </div>
  );
}
