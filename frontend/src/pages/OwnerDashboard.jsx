// src/pages/OwnerDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OwnerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [storeDetails, setStoreDetails] = useState(null);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user?.role !== "OWNER") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const fetchStores = async () => {
    try {
      setLoadingStores(true);
      setError("");
      const res = await api.get("/owner/stores");
      setStores(res.data);
      if (res.data.length > 0) {
        setSelectedStoreId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load your stores.");
    } finally {
      setLoadingStores(false);
    }
  };

  const fetchStoreRatings = async (storeId) => {
    if (!storeId) return;
    try {
      setLoadingRatings(true);
      setError("");
      const res = await api.get(`/owner/stores/${storeId}/ratings`);
      setStoreDetails(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load ratings for this store.");
    } finally {
      setLoadingRatings(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "OWNER") {
      fetchStores();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (selectedStoreId) {
      fetchStoreRatings(selectedStoreId);
    }
  }, [selectedStoreId]);

  if (!isAuthenticated) {
    return (
      <div className="mt-10 text-center text-slate-300">
        Please log in as a <span className="font-semibold">Store Owner</span> to
        view this page.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">
          Store Owner Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor your stores, see who rated them, and track the overall
          performance.
        </p>
      </div>

      {error && (
        <div className="text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Store selector */}
      <div className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <span className="block text-xs font-medium text-slate-300 mb-1">
            Your Stores
          </span>
          {loadingStores ? (
            <span className="text-xs text-slate-500">Loading stores…</span>
          ) : stores.length === 0 ? (
            <span className="text-xs text-slate-500">
              You do not own any stores yet.
            </span>
          ) : (
            <select
              value={selectedStoreId || ""}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="w-full max-w-xs bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col gap-1 text-xs text-slate-400">
          <span>
            Logged in as:{" "}
            <span className="font-medium text-slate-200">{user?.email}</span>
          </span>
          <span>Role: Store Owner</span>
        </div>
      </div>

      {/* Ratings & analytics */}
      {storeDetails && (
        <div className="glass-card p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">
                {storeDetails.store.name}
              </h2>
              <p className="text-xs text-slate-400">
                {storeDetails.store.address}
              </p>
            </div>

            <div className="flex gap-3 text-xs">
              <div className="flex flex-col items-start">
                <span className="text-slate-400">Average Rating</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/40 text-xs mt-1">
                  ⭐ {storeDetails.averageRating}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-slate-400">Total Ratings</span>
                <span className="mt-1 text-slate-100 font-semibold">
                  {storeDetails.totalRatings}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-2">
              Users who rated this store
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Rating</th>
                    <th className="px-4 py-2 text-left">Rated At</th>
                  </tr>
                </thead>
                <tbody>
                  {storeDetails.ratings.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-4 text-center text-slate-500"
                      >
                        No ratings yet.
                      </td>
                    </tr>
                  )}
                  {storeDetails.ratings.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-slate-800/80 hover:bg-slate-900/60"
                    >
                      <td className="px-4 py-2 text-slate-100">
                        {r.user.name}
                      </td>
                      <td className="px-4 py-2 text-slate-300">
                        {r.user.email}
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 text-xs">
                          ⭐ {r.value}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-[11px] text-slate-400">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {loadingRatings && (
              <p className="mt-2 text-[11px] text-slate-500">
                Loading ratings…
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
