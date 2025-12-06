import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserStoresPage from "./pages/UserStoresPage";
import OwnerDashboard from "./pages/OwnerDashboard";

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-slate-800 text-sky-400"
      : "text-slate-300 hover:text-sky-300 hover:bg-slate-800/60";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top nav */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-sm font-extrabold text-white shadow-lg shadow-sky-500/30">
              SR
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-slate-50">
                Store Ratings
              </span>
              <span className="text-[11px] text-slate-400">
                Admin • User • Owner
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 text-xs sm:text-sm">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-1.5 rounded-full transition ${isActive(
                    "/login"
                  )}`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-3 py-1.5 rounded-full transition ${isActive(
                    "/signup"
                  )}`}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className={`px-3 py-1.5 rounded-full transition ${isActive(
                      "/admin"
                    )}`}
                  >
                    Admin
                  </Link>
                )}
                {user?.role === "USER" && (
                  <Link
                    to="/user/stores"
                    className={`px-3 py-1.5 rounded-full transition ${isActive(
                      "/user/stores"
                    )}`}
                  >
                    Stores
                  </Link>
                )}
                {user?.role === "OWNER" && (
                  <Link
                    to="/owner/dashboard"
                    className={`px-3 py-1.5 rounded-full transition ${isActive(
                      "/owner/dashboard"
                    )}`}
                  >
                    Owner
                  </Link>
                )}

                <span className="hidden sm:inline text-[11px] text-slate-400 mr-1">
                  {user?.email} • {user?.role}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-full border border-slate-700 text-slate-200 text-xs hover:bg-slate-800/80 transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <div className="mt-12 flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-10 bg-sky-500/20 blur-3xl rounded-full" />
                  <h1 className="relative text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-50">
                    Rate stores. Track feedback. ✨
                  </h1>
                </div>
                <p className="max-w-xl text-slate-400 text-sm">
                  A mini platform where admins manage stores, users submit
                  ratings from 1–5, and owners see exactly how their store is
                  performing.
                </p>
              </div>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user/stores" element={<UserStoresPage />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
