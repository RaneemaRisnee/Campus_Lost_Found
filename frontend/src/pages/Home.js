import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats, getItems } from "../api";
import ItemCard from "../components/ItemCard";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, itemsRes] = await Promise.all([
          getStats(),
          getItems({ limit: 6, sort: "-createdAt" }),
        ]);
        setStats(statsRes.data.data);
        setRecentItems(itemsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <h1>🎒 Campus Lost &amp; Found</h1>
        <p>Report lost items or help others find what they've left behind. Our smart system connects students and staff across campus.</p>
        <div className="hero-btns">
          <Link to="/report" className="btn btn-primary">+ Report an Item</Link>
          <Link to="/items" className="btn btn-secondary">Browse All Items</Link>
        </div>
      </div>

      {/* Stats */}
      {!loading && stats && (
        <div className="stats-grid">
          <div className="stat-card lost">
            <div className="stat-num" style={{ color: "var(--lost)" }}>{stats.totalLost}</div>
            <div className="stat-label">Lost Items</div>
          </div>
          <div className="stat-card found">
            <div className="stat-num" style={{ color: "var(--found)" }}>{stats.totalFound}</div>
            <div className="stat-label">Found Items</div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-num" style={{ color: "var(--accent)" }}>{stats.totalResolved}</div>
            <div className="stat-label">Successfully Resolved</div>
          </div>
        </div>
      )}

      {/* Recent items */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Recent Reports</h2>
          <Link to="/items" className="btn btn-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>View All →</Link>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : recentItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No items reported yet</h3>
            <p>Be the first to report a lost or found item!</p>
          </div>
        ) : (
          <div className="items-grid">
            {recentItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
