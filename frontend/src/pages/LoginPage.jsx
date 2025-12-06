import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;
      auth.login(token, user);

      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "USER") navigate("/user/stores");
      else if (user.role === "OWNER") navigate("/owner/dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="glass-card w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-1 text-center text-slate-50">
          Welcome back
        </h2>
        <p className="text-xs text-slate-400 mb-5 text-center">
          Login as Admin, User, or Owner using your email.
        </p>

        {error && (
          <div className="mb-3 text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-medium mt-2 shadow-lg shadow-sky-500/30 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
