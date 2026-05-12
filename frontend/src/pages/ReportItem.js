import React, { useState } from "react";
import { createItem } from "../api";

const CATEGORIES = [
  "Electronics", "Clothing", "Accessories", "Books & Stationery",
  "ID & Cards", "Keys", "Bags", "Sports Equipment", "Other",
];

const initial = {
  title: "", description: "", category: "", type: "lost",
  location: "", dateOccurred: "", contactName: "",
  contactEmail: "", contactPhone: "", tags: "",
};

export default function ReportItem() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      await createItem(payload);
      setSuccess(true);
      setForm(initial);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <h2 className="form-title">Report an Item</h2>
      <p className="form-subtitle">Fill in the details below to report a lost or found item on campus.</p>

      {success && (
        <div className="form-success">
          ✅ Item reported successfully! It is now visible to other students and staff.
          <button onClick={() => setSuccess(false)} style={{ marginLeft: "1rem", background: "none", border: "none", cursor: "pointer", color: "inherit" }}>✕</button>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={submit}>
          {/* Type toggle */}
          <div className="form-group">
            <label>I am reporting this item as: *</label>
            <div className="type-toggle">
              <button type="button" className={`type-btn lost ${form.type === "lost" ? "selected" : ""}`} onClick={() => setForm({ ...form, type: "lost" })}>
                🔍 Lost
              </button>
              <button type="button" className={`type-btn found ${form.type === "found" ? "selected" : ""}`} onClick={() => setForm({ ...form, type: "found" })}>
                ✅ Found
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Item Title *</label>
            <input name="title" value={form.title} onChange={handle} placeholder="e.g. Blue Casio scientific calculator" required maxLength={100} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handle} required>
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date {form.type === "lost" ? "Lost" : "Found"} *</label>
              <input type="date" name="dateOccurred" value={form.dateOccurred} onChange={handle} required max={new Date().toISOString().split("T")[0]} />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handle} placeholder="Describe the item in detail — colour, brand, markings, etc." required maxLength={500} />
          </div>

          <div className="form-group">
            <label>Location {form.type === "lost" ? "(Where you lost it)" : "(Where you found it)"} *</label>
            <input name="location" value={form.location} onChange={handle} placeholder="e.g. Library, 2nd Floor, near the printers" required />
          </div>

          <div className="form-group">
            <label>Tags <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(comma-separated)</span></label>
            <input name="tags" value={form.tags} onChange={handle} placeholder="e.g. blue, casio, calculator, fx-991" />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.25rem 0" }} />
          <p style={{ fontWeight: 600, fontFamily: "var(--font-heading)", marginBottom: "1rem", fontSize: "0.95rem" }}>Contact Information</p>

          <div className="form-row">
            <div className="form-group">
              <label>Your Name *</label>
              <input name="contactName" value={form.contactName} onChange={handle} placeholder="Full name" required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="contactEmail" value={form.contactEmail} onChange={handle} placeholder="your@email.com" required />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
            <input name="contactPhone" value={form.contactPhone} onChange={handle} placeholder="+94 7X XXX XXXX" />
          </div>

          {error && <p className="form-error">⚠ {error}</p>}

          <button type="submit" className="form-submit" disabled={submitting}>
            {submitting ? "Submitting..." : `Submit ${form.type === "lost" ? "Lost" : "Found"} Item Report`}
          </button>
        </form>
      </div>
    </div>
  );
}
