"use client";
import React from "react";

export default function DoctorCard({ name, rating, location, hours, phone }) {
  const formattedHours = Array.isArray(hours) ? hours.join(", ") : hours || "N/A";

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.name}>{name || "Unknown Doctor"}</h3>

        {/* Top-right rating badge that doesn't affect layout */}
        <div style={styles.badge} aria-label={`Rating ${rating ?? "N/A"}`}>
          <span style={styles.star}>★</span>
          <span style={styles.score}>{rating ?? "N/A"}</span>
        </div>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Location</span>
        <span style={styles.value}>{location || "N/A"}</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Hours</span>
        <span style={styles.value}>{formattedHours}</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Phone</span>
        {phone && phone !== "N/A" ? (
          <a href={`tel:${phone}`} style={styles.link}>{phone}</a>
        ) : (
          <span style={styles.value}>N/A</span>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e9eef3",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(16, 24, 40, 0.06)",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  name: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 600,
    color: "#111827",
  },
  badge: {
    fontSize: "14px",
    background: "#fff7e6",
    color: "#b4690e",
    padding: "4px 10px",
    borderRadius: "999px",
    border: "1px solid #fde3a7",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "96px 1fr",
    gap: "10px",
    padding: "10px 0",
    borderTop: "1px solid #f2f4f7",
  },
  label: {
    color: "#6b7280",
    fontSize: "13px",
  },
  value: {
    color: "#374151",
    fontSize: "14px",
  },
  link: {
    color: "#0ea5e9",
    textDecoration: "none",
    fontSize: "14px",
  },
};
