import React, { useEffect, useState } from "react";
import { getClaims, updateClaimStatus, deleteClaim } from "../api";

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const res = await getClaims(params);
      setClaims(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleStatus = async (claimId, status) => {
    try {
      await updateClaimStatus(claimId, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const handleDelete = async (claimId) => {
    if (!window.confirm("Delete this claim?")) return;
    try {
      await deleteClaim(claimId);
      load();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="section" style={{ maxWidth: 800 }}>
      <div className="section-header">
        <h2 className="section-title">📋 Claims Management</h2>
      </div>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Review and manage item claim requests submitted by students and staff.
      </p>

      <div className="filters">
        {["", "pending", "approved", "rejected"].map((s) => (
          <button key={s} className={`filter-btn ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : claims.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No claims found</h3>
          <p>No claims match the selected filter.</p>
        </div>
      ) : (
        claims.map((claim) => (
          <div key={claim._id} className="claim-card">
            <div className="claim-header">
              <div>
                <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>{claim.claimerName}</h3>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {claim.claimerEmail} &middot; Submitted {fmt(claim.createdAt)}
                </div>
                {claim.item && (
                  <div style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}>
                    For item: <strong>{claim.item.title}</strong> &nbsp;
                    <span className={`badge badge-${claim.item.type}`}>{claim.item.type}</span>
                  </div>
                )}
              </div>
              <span className={`badge badge-${claim.status}`}>{claim.status}</span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              <strong>Proof of ownership:</strong> {claim.proofDescription}
            </p>

            <div className="claim-actions">
              {claim.status === "pending" && (
                <>
                  <button className="btn btn-success btn-sm" onClick={() => handleStatus(claim._id, "approved")}>✓ Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleStatus(claim._id, "rejected")}>✕ Reject</button>
                </>
              )}
              <button className="btn btn-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)" }} onClick={() => handleDelete(claim._id)}>🗑 Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
