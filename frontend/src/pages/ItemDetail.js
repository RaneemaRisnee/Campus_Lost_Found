import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getItemById, createClaim, deleteItem } from "../api";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimForm, setClaimForm] = useState({ claimerName: "", claimerEmail: "", claimerPhone: "", proofDescription: "" });
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getItemById(id);
        setItem(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleClaim = async (e) => {
    e.preventDefault();
    setClaimSubmitting(true);
    setClaimError("");
    try {
      await createClaim({ ...claimForm, item: id });
      setClaimSuccess(true);
    } catch (err) {
      setClaimError(err.response?.data?.message || "Failed to submit claim.");
    } finally {
      setClaimSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeleting(true);
    try {
      await deleteItem(id);
      window.history.back();
    } catch (err) {
      alert("Failed to delete item.");
      setDeleting(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!item) return <div className="empty-state"><div className="empty-icon">❌</div><h3>Item not found</h3></div>;

  const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="detail-page">
      <Link to="/items" className="back-link">← Back to listings</Link>

      <div className="detail-card">
        <div className="detail-header">
          <h1 className="detail-title">{item.title}</h1>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className={`badge badge-${item.type}`}>{item.type.toUpperCase()}</span>
            <span className={`badge badge-${item.status}`}>{item.status}</span>
          </div>
        </div>

        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>{item.description}</p>

        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <div className="detail-meta-label">Category</div>
            <div className="detail-meta-value">{item.category}</div>
          </div>
          <div className="detail-meta-item">
            <div className="detail-meta-label">Location</div>
            <div className="detail-meta-value">📍 {item.location}</div>
          </div>
          <div className="detail-meta-item">
            <div className="detail-meta-label">Date {item.type === "lost" ? "Lost" : "Found"}</div>
            <div className="detail-meta-value">{fmt(item.dateOccurred)}</div>
          </div>
          <div className="detail-meta-item">
            <div className="detail-meta-label">Reported On</div>
            <div className="detail-meta-value">{fmt(item.createdAt)}</div>
          </div>
          <div className="detail-meta-item">
            <div className="detail-meta-label">Views</div>
            <div className="detail-meta-value">👁 {item.viewCount}</div>
          </div>
          {item.tags?.length > 0 && (
            <div className="detail-meta-item">
              <div className="detail-meta-label">Tags</div>
              <div className="detail-meta-value">{item.tags.map(t => <span key={t} style={{ display: "inline-block", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "4px", padding: "0 6px", marginRight: "4px", fontSize: "0.82rem" }}>{t}</span>)}</div>
            </div>
          )}
        </div>

        {/* Contact info */}
        <div className="detail-section">
          <h3>Contact Information</h3>
          <div className="detail-meta-grid">
            <div className="detail-meta-item">
              <div className="detail-meta-label">Name</div>
              <div className="detail-meta-value">{item.contactName}</div>
            </div>
            <div className="detail-meta-item">
              <div className="detail-meta-label">Email</div>
              <div className="detail-meta-value"><a href={`mailto:${item.contactEmail}`}>{item.contactEmail}</a></div>
            </div>
            {item.contactPhone && (
              <div className="detail-meta-item">
                <div className="detail-meta-label">Phone</div>
                <div className="detail-meta-value">{item.contactPhone}</div>
              </div>
            )}
          </div>
        </div>

        {/* Claim form — only for found items that are active */}
        {item.type === "found" && item.status === "active" && (
          <div className="detail-section">
            <h3>Claim This Item</h3>
            {claimSuccess ? (
              <div className="form-success">✅ Your claim has been submitted! The finder will review it and contact you.</div>
            ) : (
              <form onSubmit={handleClaim}>
                <div className="form-row" style={{ marginBottom: "1rem" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Your Name *</label>
                    <input value={claimForm.claimerName} onChange={e => setClaimForm({ ...claimForm, claimerName: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Your Email *</label>
                    <input type="email" value={claimForm.claimerEmail} onChange={e => setClaimForm({ ...claimForm, claimerEmail: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Proof of Ownership *</label>
                  <textarea value={claimForm.proofDescription} onChange={e => setClaimForm({ ...claimForm, proofDescription: e.target.value })} placeholder="Describe something specific that proves this is yours — a sticker, saved files, serial number, etc." required />
                </div>
                {claimError && <p className="form-error">⚠ {claimError}</p>}
                <button type="submit" className="btn btn-success" style={{ border: "none", width: "100%", padding: "0.75rem" }} disabled={claimSubmitting}>
                  {claimSubmitting ? "Submitting..." : "Submit Claim"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="detail-section" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "🗑 Delete Item"}</button>
        </div>
      </div>
    </div>
  );
}
