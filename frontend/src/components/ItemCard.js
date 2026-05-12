import React from "react";
import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <Link to={`/items/${item._id}`} className="item-card">
      <div className="item-card-header">
        <span className={`badge badge-${item.type}`}>{item.type.toUpperCase()}</span>
        <span className={`badge badge-${item.status}`}>{item.status}</span>
      </div>
      <div className="item-card-body">
        <div className="item-card-title">{item.title}</div>
        <div className="item-card-desc">{item.description}</div>
        <div className="item-card-meta">
          <span>📁 {item.category}</span>
          <span>📍 {item.location}</span>
          <span>📅 {fmt(item.dateOccurred)}</span>
        </div>
      </div>
    </Link>
  );
}
