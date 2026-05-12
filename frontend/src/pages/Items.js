import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getItems } from "../api";
import ItemCard from "../components/ItemCard";

const CATEGORIES = [
  "Electronics", "Clothing", "Accessories", "Books & Stationery",
  "ID & Cards", "Keys", "Bags", "Sports Equipment", "Other",
];

export default function Items() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (type) params.type = type;
        if (category) params.category = category;
        if (search) params.search = search;
        const res = await getItems(params);
        setItems(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type, category, search, page]);

  const setFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
    setPage(1);
  };

  return (
    <div className="section">
      <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>
        {type === "lost" ? "🔍 Lost Items" : type === "found" ? "✅ Found Items" : "📋 All Items"}
        {total > 0 && <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "1rem", marginLeft: "0.5rem" }}>({total})</span>}
      </h2>

      {/* Filters */}
      <div className="filters">
        <button className={`filter-btn ${!type ? "active" : ""}`} onClick={() => setFilter("type", "")}>All</button>
        <button className={`filter-btn ${type === "lost" ? "active" : ""}`} onClick={() => setFilter("type", "lost")}>Lost</button>
        <button className={`filter-btn ${type === "found" ? "active" : ""}`} onClick={() => setFilter("type", "found")}>Found</button>
        <span style={{ borderLeft: "1px solid var(--border)", margin: "0 0.25rem" }} />
        {CATEGORIES.map((cat) => (
          <button key={cat} className={`filter-btn ${category === cat ? "active" : ""}`} onClick={() => setFilter("category", category === cat ? "" : cat)}>{cat}</button>
        ))}
      </div>

      <input
        className="search-bar"
        placeholder="🔍 Search items..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        style={{ marginBottom: "1.5rem" }}
      />

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No items found</h3>
          <p>Try changing your filters or search term.</p>
        </div>
      ) : (
        <>
          <div className="items-grid">
            {items.map((item) => <ItemCard key={item._id} item={item} />)}
          </div>
          {total > 12 && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", justifyContent: "center" }}>
              <button className="btn" onClick={() => setPage(p => p - 1)} disabled={page === 1} style={{ background: "white", border: "1px solid var(--border)" }}>← Prev</button>
              <span style={{ padding: "0.5rem 1rem", color: "var(--text-muted)" }}>Page {page}</span>
              <button className="btn" onClick={() => setPage(p => p + 1)} disabled={items.length < 12} style={{ background: "white", border: "1px solid var(--border)" }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
