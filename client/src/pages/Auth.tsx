import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { loginApi, registerApi } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { useAppDispatch } from "../hooks/redux";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Auth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === "register" && !form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      let data;

      if (mode === "login") {
        data = await loginApi({
          email: form.email,
          password: form.password,
        });

        toast.success("Welcome back 👋");
      } else {
        data = await registerApi(form);

        toast.success("Account created successfully 🎉");
      }

      dispatch(setCredentials(data));

      navigate("/dashboard");
    } catch (err: any) {
      if (mode === "login" && err.response?.status === 404) {
        toast.error("User not found. Please register first.");

        setMode("register");

        return;
      }

      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-slate-50 to-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-indigo-600">FlowBoard</h1>

          <p className="mt-3 text-gray-500">Project Management Platform</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
          <div className="mb-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");

                setForm({
                  ...form,
                  name: "",
                });
              }}
              className={`cursor-pointer rounded-lg py-3 font-semibold transition ${
                mode === "login"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-500"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setMode("register")}
              className={`cursor-pointer rounded-lg py-3 font-semibold transition ${
                mode === "register"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-500"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <h2 className="text-3xl font-bold">
                {mode === "login" ? "Welcome Back 👋" : "Create Your Account"}
              </h2>

              <p className="mt-2 text-gray-500">
                {mode === "login"
                  ? "Continue managing your projects and team."
                  : "Create your account to start using FlowBoard."}
              </p>
            </div>

            {mode === "register" && (
              <Input
                placeholder="Full Name"
                value={form.name}
                disabled={loading}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            )}

            <Input
              placeholder="Email Address"
              type="email"
              disabled={loading}
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                disabled={loading}
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? mode === "login"
                  ? "Signing In..."
                  : "Creating Account..."
                : mode === "login"
                  ? "Login"
                  : "Create Account"}
            </Button>

            <div className="pt-2 text-center text-sm text-gray-500">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="cursor-pointer font-semibold text-indigo-600 hover:underline"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");

                      setForm({
                        name: "",
                        email: "",
                        password: "",
                      });
                    }}
                    className="cursor-pointer font-semibold text-indigo-600 hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
