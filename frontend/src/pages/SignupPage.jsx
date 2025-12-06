// src/pages/SignupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/signup", form);

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Signup failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-10 mb-8">
      <div className="glass-card w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-1 text-center text-slate-50">
          Create an account
        </h2>
        <p className="text-xs text-slate-400 mb-5 text-center">
          Sign up as a normal user to rate stores on the platform.
        </p>

        {error && (
          <div className="mb-3 text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 text-xs text-emerald-300 bg-emerald-900/30 border border-emerald-700/60 rounded-lg px-3 py-2">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium mb-1 text-slate-300">
              Full Name
            </label>
            <input
              name="name"
              className="w-full bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={form.name}
              onChange={handleChange}
              required
              minLength={20}
              maxLength={60}
              placeholder="Enter your full name (20–60 characters)"
            />
          </div>

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
              Address
            </label>
            <textarea
              name="address"
              className="w-full bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              value={form.address}
              onChange={handleChange}
              maxLength={400}
              required
              rows={3}
              placeholder="Your full address (max 400 characters)"
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
              placeholder="Create a strong password"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              8–16 characters, at least one uppercase letter and one special
              character.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-medium mt-2 shadow-lg shadow-emerald-500/30 transition"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
