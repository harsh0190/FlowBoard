import { useState } from "react";

import { Bell, Trash2 } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";

import {
  markAllRead,
  clearNotifications,
} from "../../features/notification/notificationSlice";

export default function NotificationMenu() {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  const notifications = useAppSelector(
    (state) => state.notification.notifications,
  );

  const unread = notifications.filter(
    (notification) => !notification.read,
  ).length;

  function toggleMenu() {
    setOpen((prev) => !prev);

    dispatch(markAllRead());
  }

  function clearAll() {
    dispatch(clearNotifications());
  }

  return (
    <div
      className="
relative
"
    >
      <button
        onClick={toggleMenu}
        className="
relative

cursor-pointer

hover:text-indigo-600

transition
"
      >
        <Bell size={22} />

        {unread > 0 && (
          <span
            className="
absolute

-top-2

-right-2

bg-red-500

text-white

text-xs

min-w-5

h-5

flex

items-center

justify-center

rounded-full
"
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
absolute

right-0

top-10


w-80


bg-white


border


rounded-xl


shadow-xl


p-4


z-9999
"
        >
          <div
            className="
flex

items-center

justify-between

mb-4
"
          >
            <h2
              className="
font-bold

text-lg
"
            >
              Notifications
            </h2>

            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="
flex

items-center

gap-1

text-sm

text-red-500

hover:text-red-700

cursor-pointer
"
              >
                <Trash2 size={15} />
                Clear
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div
              className="
text-center

py-8

text-gray-500
"
            >
              No notifications 🔕
            </div>
          ) : (
            <div
              className="
space-y-3

max-h-80

overflow-y-auto
"
            >
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="
border

rounded-lg

p-3

bg-gray-50
"
                >
                  <p
                    className="
text-sm

font-medium
"
                  >
                    {notification.message}
                  </p>

                  <p
                    className="
text-xs

text-gray-400

mt-1
"
                  >
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
