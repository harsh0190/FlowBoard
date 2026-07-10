import { useState } from "react";

import { Search, User, Settings, LogOut } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import NotificationMenu from "./NotificationMenu";

import { logout } from "../../features/auth/authSlice";

import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logout());

    localStorage.removeItem("token");

    navigate("/login");
  }

  return (
    <header
      className="
h-16
bg-white
border-b

flex
items-center
justify-between

px-8
"
    >
      <div
        className="
hidden
md:flex

items-center
gap-3

bg-gray-100

px-4
py-2

rounded-lg

w-96
"
      >
        <Search size={18} />

        <input
          placeholder="Search..."
          className="
bg-transparent
outline-none
w-full
"
        />
      </div>

      <div
        className="
flex
items-center
gap-5
relative
"
      >
        <NotificationMenu />

        <button
          onClick={() => setOpen(!open)}
          className="
w-10
h-10

rounded-full

bg-indigo-600
text-white

font-bold
cursor-pointer

hover:bg-indigo-700

transition
"
        >
          {user?.name?.charAt(0)}
        </button>

        {open && (
          <div
            className="
absolute
right-0
top-14

bg-white

border
rounded-xl
shadow-lg

w-56

p-3

z-50
"
          >
            <div className="p-3">
              <p className="font-bold">{user?.name}</p>

              <p
                className="
text-sm
text-gray-500
"
              >
                {user?.email}
              </p>
            </div>

            <hr />

            <button
              onClick={() => navigate("/profile")}
              className="
flex
gap-3
items-center

p-3
cursor-pointer
w-full

hover:bg-gray-100
rounded
"
            >
              <User size={18} />
              Profile
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="
flex
gap-3
items-center
p-3
w-full
cursor-pointer
hover:bg-gray-100
rounded
"
            >
              <Settings size={18} />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="
flex
gap-3
items-center

p-3

w-full

text-red-500

hover:bg-red-50
cursor-pointer
rounded
"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
