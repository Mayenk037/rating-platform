// src/pages/UserStoresPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UserStoresPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingLoadingId, setRatingLoadingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role !== "USER") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/user/stores", {
        params: search ? { search } : {},
      });
      setStores(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load stores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "USER") {
      fetchStores();
    }
  }, [isAuthenticated, user]);

  const handleRate = async (storeId, value, hasRated) => {
    try {
      if (!value) return;
      setRatingLoadingId(storeId);
      setError("");

      if (hasRated) {
        await api.put(`/user/stores/${storeId}/rate`, { value });
      } else {
        await api.post(`/user/stores/${storeId}/rate`, { value });
      }

      await fetchStores();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to submit or update rating."
      );
    } finally {
      setRatingLoadingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mt-10 text-center text-slate-300">
        Please log in as a <span className="font-semibold">User</span> to view
        this page.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Browse Stores</h1>
        <p className="text-xs text-slate-400 mt-1">
          View registered stores, see overall ratings, and submit or update your
          own rating.
        </p>
      </div>

      {error && (
        <div className="text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          placeholder="Search stores by name or address..."
          className="flex-1 bg-slate-950/60 border border-slate-700/70 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={fetchStores}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm rounded-lg font-medium shadow shadow-sky-500/30"
        >
          Search
        </button>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-slate-900/80 text-slate-300">
            <tr>
              <th className="px-4 py-2 text-left">Store</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Overall</th>
              <th className="px-4 py-2 text-left">Your Rating</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 text-center text-slate-500"
                >
                  No stores found.
                </td>
              </tr>
            )}
            {stores.map((s) => {
              const hasRated =
                s.userRating !== null && s.userRating !== undefined;
              return (
                <tr
                  key={s.id}
                  className="border-t border-slate-800/80 hover:bg-slate-900/60"
                >
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-slate-100">{s.name}</p>
                  </td>
                  <td className="px-4 py-3 align-top text-slate-400">
                    <span className="line-clamp-2">{s.address}</span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/40 text-xs">
                      ⭐ {s.overallRating}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {hasRated ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 text-xs">
                        Your rating: {s.userRating}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">
                        Not rated yet
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <select
                        className="bg-slate-950/70 border border-slate-700/70 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        defaultValue={hasRated ? s.userRating : ""}
                        onChange={(e) =>
                          handleRate(s.id, Number(e.target.value), hasRated)
                        }
                        disabled={ratingLoadingId === s.id}
                      >
                        <option value="" disabled>
                          {hasRated ? "Change rating" : "Rate"}
                        </option>
                        {[1, 2, 3, 4, 5].map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                      {ratingLoadingId === s.id && (
                        <span className="text-[11px] text-slate-500">
                          Saving...
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {loading && (
        <p className="mt-2 text-[11px] text-slate-500">Loading stores…</p>
      )}
    </div>
  );
}

export default UserStoresPage;
