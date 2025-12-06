// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const [userFilters, setUserFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
    sortBy: "name",
    order: "ASC",
  });

  const [storeFilters, setStoreFilters] = useState({
    name: "",
    address: "",
    sortBy: "name",
    order: "ASC",
  });

  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [error, setError] = useState("");

  // redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user?.role !== "ADMIN") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard stats.");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const params = { ...userFilters };
      Object.keys(params).forEach(
        (key) => params[key] === "" && delete params[key]
      );

      const res = await api.get("/admin/users", { params });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users list.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStores = async () => {
    try {
      setLoadingStores(true);
      const params = { ...storeFilters };
      Object.keys(params).forEach(
        (key) => params[key] === "" && delete params[key]
      );

      const res = await api.get("/admin/stores", { params });
      setStores(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load stores list.");
    } finally {
      setLoadingStores(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      await Promise.all([fetchDashboard(), fetchUsers(), fetchStores()]);
      setLoading(false);
    };
    if (isAuthenticated && user?.role === "ADMIN") {
      load();
    }
  }, [isAuthenticated, user]); // initial load

  const handleUserFilterChange = (e) => {
    const { name, value } = e.target;
    setUserFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreFilterChange = (e) => {
    const { name, value } = e.target;
    setStoreFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyUserFilters = () => {
    fetchUsers();
  };

  const applyStoreFilters = () => {
    fetchStores();
  };

  const toggleUserSort = (field) => {
    setUserFilters((prev) => {
      const order =
        prev.sortBy === field && prev.order === "ASC" ? "DESC" : "ASC";
      const next = { ...prev, sortBy: field, order };
      // trigger reload
      setTimeout(() => {
        setUserFilters(next);
        fetchUsers();
      }, 0);
      return next;
    });
  };

  const toggleStoreSort = (field) => {
    setStoreFilters((prev) => {
      const order =
        prev.sortBy === field && prev.order === "ASC" ? "DESC" : "ASC";
      const next = { ...prev, sortBy: field, order };
      setTimeout(() => {
        setStoreFilters(next);
        fetchStores();
      }, 0);
      return next;
    });
  };

  const totalAdmins = useMemo(
    () => users.filter((u) => u.role === "ADMIN").length,
    [users]
  );
  const totalOwners = useMemo(
    () => users.filter((u) => u.role === "OWNER").length,
    [users]
  );
  const totalNormalUsers = useMemo(
    () => users.filter((u) => u.role === "USER").length,
    [users]
  );

  if (!isAuthenticated) {
    return (
      <div className="mt-10 text-center text-slate-300">
        Please log in as an <span className="font-semibold">Admin</span> to view
        this page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">
            Admin Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Overview of users, stores, and ratings across the platform.
          </p>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex flex-col gap-1 bg-gradient-to-br from-sky-900/40 to-slate-900/80">
          <span className="text-[11px] text-sky-300 flex items-center gap-1">
            👤 Total Users
          </span>
          <span className="text-2xl font-extrabold text-slate-50">
            {stats.totalUsers}
          </span>
          <p className="text-[11px] text-slate-400">
            {totalAdmins} Admin • {totalOwners} Owners • {totalNormalUsers}{" "}
            Users
          </p>
        </div>

        <div className="glass-card p-4 flex flex-col gap-1 bg-gradient-to-br from-emerald-900/40 to-slate-900/80">
          <span className="text-[11px] text-emerald-300 flex items-center gap-1">
            🏬 Total Stores
          </span>
          <span className="text-2xl font-extrabold text-slate-50">
            {stats.totalStores}
          </span>
          <p className="text-[11px] text-slate-400">
            Stores owned by registered owners.
          </p>
        </div>

        <div className="glass-card p-4 flex flex-col gap-1 bg-gradient-to-br from-yellow-900/40 to-slate-900/80">
          <span className="text-[11px] text-yellow-300 flex items-center gap-1">
            ⭐ Total Ratings
          </span>
          <span className="text-2xl font-extrabold text-slate-50">
            {stats.totalRatings}
          </span>
          <p className="text-[11px] text-slate-400">
            Rating submissions from all normal users.
          </p>
        </div>

        <div className="glass-card p-4 flex flex-col gap-1 bg-gradient-to-br from-indigo-900/40 to-slate-900/80">
          <span className="text-[11px] text-indigo-300 flex items-center gap-1">
            🔐 Active Admin
          </span>
          <span className="text-sm font-semibold text-slate-50 truncate">
            {user?.email}
          </span>
          <p className="text-[11px] text-slate-400">
            You can manage users & stores from this panel.
          </p>
        </div>
      </div>

      {/* Users Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">Users</h2>
          {loadingUsers && (
            <span className="text-[11px] text-slate-500">Refreshing…</span>
          )}
        </div>

        {/* Filters */}
        <div className="glass-card p-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
            <input
              name="name"
              placeholder="Filter by name"
              className="bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={userFilters.name}
              onChange={handleUserFilterChange}
            />
            <input
              name="email"
              placeholder="Filter by email"
              className="bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={userFilters.email}
              onChange={handleUserFilterChange}
            />
            <input
              name="address"
              placeholder="Filter by address"
              className="bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={userFilters.address}
              onChange={handleUserFilterChange}
            />
            <select
              name="role"
              className="bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={userFilters.role}
              onChange={handleUserFilterChange}
            >
              <option value="">All roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="OWNER">OWNER</option>
              <option value="USER">USER</option>
            </select>
          </div>
          <button
            onClick={applyUserFilters}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs rounded-lg font-medium shadow shadow-sky-500/30"
          >
            Apply Filters
          </button>
        </div>

        {/* Users table */}
        <div className="glass-card overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => toggleUserSort("name")}
                >
                  Name
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => toggleUserSort("email")}
                >
                  Email
                </th>
                <th className="px-4 py-2 text-left">Address</th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => toggleUserSort("role")}
                >
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-slate-800/80 hover:bg-slate-900/60"
                >
                  <td className="px-4 py-2 text-slate-100">{u.name}</td>
                  <td className="px-4 py-2 text-slate-300">{u.email}</td>
                  <td className="px-4 py-2 text-slate-400">
                    <span className="line-clamp-2">{u.address}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] border ${
                        u.role === "ADMIN"
                          ? "bg-sky-500/10 text-sky-300 border-sky-500/40"
                          : u.role === "OWNER"
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
                          : "bg-slate-500/10 text-slate-300 border-slate-500/40"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Stores Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">Stores</h2>
          {loadingStores && (
            <span className="text-[11px] text-slate-500">Refreshing…</span>
          )}
        </div>

        <div className="glass-card p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <input
              name="name"
              placeholder="Filter by name"
              className="bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={storeFilters.name}
              onChange={handleStoreFilterChange}
            />
            <input
              name="address"
              placeholder="Filter by address"
              className="bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={storeFilters.address}
              onChange={handleStoreFilterChange}
            />
            <select
              name="sortBy"
              className="bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={storeFilters.sortBy}
              onChange={handleStoreFilterChange}
            >
              <option value="name">Sort by name</option>
              <option value="address">Sort by address</option>
            </select>
          </div>
          <button
            onClick={applyStoreFilters}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs rounded-lg font-medium shadow shadow-sky-500/30"
          >
            Apply Filters
          </button>
        </div>

        <div className="glass-card overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => toggleStoreSort("name")}
                >
                  Name
                </th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Owner</th>
                <th className="px-4 py-2 text-left">Owner Email</th>
                <th className="px-4 py-2 text-left">Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-slate-500"
                  >
                    No stores found.
                  </td>
                </tr>
              )}
              {stores.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-slate-800/80 hover:bg-slate-900/60"
                >
                  <td className="px-4 py-2 text-slate-100">{s.name}</td>
                  <td className="px-4 py-2 text-slate-400">
                    <span className="line-clamp-2">{s.address}</span>
                  </td>
                  <td className="px-4 py-2 text-slate-200">
                    {s.ownerName || "-"}
                  </td>
                  <td className="px-4 py-2 text-slate-300">
                    {s.ownerEmail || "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/40 text-xs">
                      ⭐ {s.averageRating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {loading && (
        <p className="mt-2 text-[11px] text-slate-500">Loading data…</p>
      )}
    </div>
  );
}

export default AdminDashboard;
