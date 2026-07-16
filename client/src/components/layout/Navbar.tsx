import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import NotificationMenu from "./NotificationMenu";

import { logout } from "../../features/auth/authSlice";

const pageDetails: Record<
  string,
  {
    title: string;
    subtitle: string;
  }
> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Workspace Overview",
  },

  "/workspaces": {
    title: "Workspaces",
    subtitle: "Manage your workspaces",
  },

  "/projects": {
    title: "Projects",
    subtitle: "Manage your projects",
  },

  "/kanban": {
    title: "Kanban Board",
    subtitle: "Manage project workflow",
  },

  "/members": {
    title: "Members",
    subtitle: "Manage workspace members",
  },

  "/profile": {
    title: "Profile",
    subtitle: "Manage your profile",
  },

  "/settings": {
    title: "Settings",
    subtitle: "Application settings",
  },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const { user } = useAppSelector(
    (state) => state.auth
  );

  const page =
    pageDetails[location.pathname] || {
      title: "FlowBoard",
      subtitle: "Project Management",
    };
    useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  }

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  function handleLogout() {
    dispatch(logout());

    localStorage.removeItem("token");

    navigate("/login");
  }

  return (
    <header
      className="
h-20
bg-white
border-b

flex
items-center
justify-between

px-8
"
    >
      {/* Left */}

      <div>

        <h1
          className="
text-3xl
font-bold
text-slate-900
"
        >
          {page.title}
        </h1>

        <p
          className="
text-gray-500
mt-1
"
        >
          {page.subtitle}
        </p>

      </div>

      {/* Right */}

      <div
      ref={menuRef}
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

w-56

bg-white

border
rounded-xl
shadow-lg

p-3

z-50
"
          >
            <div className="p-3">

              <p className="font-bold">
                {user?.name}
              </p>

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
              onClick={() =>
                navigate("/profile")
              }
              className="
flex
items-center
gap-3

w-full

p-3

rounded

hover:bg-gray-100

cursor-pointer
"
            >
              <User size={18} />
              Profile
            </button>

            <button
              onClick={() =>
                navigate("/settings")
              }
              className="
flex
items-center
gap-3

w-full

p-3

rounded

hover:bg-gray-100

cursor-pointer
"
            >
              <Settings size={18} />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="
flex
items-center
gap-3

w-full

p-3

rounded

text-red-500

hover:bg-red-50

cursor-pointer
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