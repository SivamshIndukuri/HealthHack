"use client";
import DoctorCard from "./doctorCard";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Waiting..."); // 🆕 add status state

  // 🆕 Fetch status from Twilio session store periodically
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/sessions");
        const json = await res.json();

        // Determine doctorFound or availability status
        const anyDoctorFound = Object.values(json || {}).some(
          (s) => s.doctorFound === true
        );

        if (anyDoctorFound) setStatus("✅ Doctor Found");
        else if (Object.keys(json || {}).length > 0)
          setStatus("📞 Calling Doctors...");
        else setStatus("Waiting...");
      } catch (e) {
        console.error("Error fetching session status:", e);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // 1️⃣ Fetch patient location
  useEffect(() => {
    const q = name.trim();
    if (!q) return;

    (async () => {
      try {
        const res = await fetch(`/api/patients?name=${encodeURIComponent(q)}`);
        const json = await res.json();
        if (res.ok && json?.location?.lat != null && json?.location?.lng != null) {
          setLocation(json.location);
        } else {
          console.error("patients error:", json);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [name]);

  // 2️⃣ Fetch psychiatrists only after coords exist
  useEffect(() => {
    if (!location) return;

    (async () => {
      setLoading(true);
      try {
        const { lat, lng } = location;
        const res = await fetch(
          `/api/psychiatrists?location=${lat},${lng}&radius=10000&query=psychiatrist`
        );
        const json = await res.json();
        setDoctors(Array.isArray(json.results) ? json.results : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [location]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Image
          src="/RWJLogo.png"
          alt="RWJ Logo"
          width={500}
          height={90}
          priority
        />

        <input
          type="text"
          id="text"
          placeholder="Full Name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setName(e.target.value);
              console.log("Enter pressed:", e.target.value);
            }
          }}
          style={{
            marginLeft: "25px",
            padding: "5px",
            border: "2px solid #333",
            borderRadius: "100px",
            marginRight: "100px",
            width: "350px",
          }}
        />

        {/* 🆕 Status display */}
        <span
          style={{
            fontWeight: "bold",
            color:
              status === "✅ Doctor Found"
                ? "green"
                : status === "📞 Calling Doctors..."
                ? "orange"
                : "gray",
          }}
        >
          {status}
        </span>
      </header>

      <main style={styles.wrap}>
        {doctors.map((d, i) => (
          <DoctorCard key={i} {...d} />
        ))}
      </main>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #F7FAFF 0%, #F2F5FA 100%)",
    overflow: "hidden",
  },

  header: {
    position: "relative",
    zIndex: 5,
    maxWidth: 1200,
    margin: "28px auto 8px",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  wrap: {
    position: "relative",
    zIndex: 5,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 28,
    padding: "24px",
    maxWidth: 1200,
    margin: "0 auto 48px",
  },
};
