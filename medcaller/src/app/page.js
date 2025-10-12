"use client";
import DoctorCard from "./doctorCard";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("")



 
  useEffect(() => {
      fetch("/api/psychiatrists?location=40.5742,-74.6387&radius=10000&query=psychiatrist")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);        // logs the JSON object
          setDoctors(data.results);
          setLoading(false); 
        })
      

  }, []);


  



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
      </header>

      {/* Doctor cards */}
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

  // Enlarged background image
  bgWrap: {
    position: "absolute",
    top: 50,
    right: 50,
    width: 1500,       // bigger size (was 460)
    height: 800,      // taller (was 220)
    zIndex: 1,        // behind everything
    pointerEvents: "none",
    filter: "drop-shadow(0 8px 24px rgba(16,24,40,0.08))",
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
