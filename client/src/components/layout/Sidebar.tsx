import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Columns3,
  Users,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Workspaces",
      path: "/workspaces",
      icon: Briefcase,
    },

    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },

    {
      name: "Kanban",
      path: "/kanban",
      icon: Columns3,
    },

    {
      name: "Members",
      path: "/members",
      icon: Users,
    },
  ];

  return (
    <aside
      className="
w-full
md:w-64
bg-slate-950
text-white
p-6
"
    >
      <h1
        onClick={() => navigate("/dashboard")}
        className="
text-2xl
font-bold
mb-10
cursor-pointer

hover:text-indigo-400

"
      >
        FlowBoard
      </h1>

      <nav className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `

flex
items-center
gap-3

px-4
py-3

rounded-xl

transition
cursor-pointer

${isActive ? "bg-indigo-600" : "hover:bg-slate-800"}

`}
            >
              <Icon size={20} />

              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
