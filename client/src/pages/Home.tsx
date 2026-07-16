import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  FolderKanban,
  Users,
  Bell,
  BarChart3,
} from "lucide-react";
import Footer from "../components/layout/Footer";

export default function Home() {
  const features = [
    {
      icon: <LayoutDashboard size={28} />,
      title: "Workspace Management",
      description: "Create multiple workspaces and collaborate with your team.",
    },
    {
      icon: <FolderKanban size={28} />,
      title: "Kanban Board",
      description: "Organize tasks using drag and drop workflow.",
    },
    {
      icon: <Users size={28} />,
      title: "Team Collaboration",
      description: "Invite members and manage tasks effortlessly.",
    },
    {
      icon: <Bell size={28} />,
      title: "Real-time Notifications",
      description: "Receive instant updates whenever work changes.",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Dashboard",
      description: "Track project progress with charts and analytics.",
    },
    {
      icon: <CheckCircle2 size={28} />,
      title: "Project Tracking",
      description: "Monitor deadlines, priorities and completed work.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <main className="flex-1">
        {/* Navbar */}

        <header className="border-b border-slate-800">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <h1 className="text-3xl font-bold text-blue-500">FlowBoard</h1>

            <div className="flex gap-3">
              <Link
                to="/auth"
                className="rounded-lg border border-slate-700 px-5 py-2 transition hover:bg-slate-800"
              >
                Login
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}

        <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
          <h1 className="max-w-4xl text-6xl font-bold leading-tight">
            Manage Projects.
            <br />
            Collaborate Better.
            <br />
            Deliver Faster.
          </h1>

          <p className="mt-8 max-w-2xl text-lg text-slate-400">
            FlowBoard is a collaborative project management platform that helps
            teams organize workspaces, projects and tasks using an intuitive
            Kanban board.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              to="/auth?mode=register"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-700"
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* Features */}

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <h2 className="mb-12 text-center text-4xl font-bold">Features</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:border-blue-500"
              >
                <div className="mb-5 text-blue-500">{feature.icon}</div>

                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>

                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
