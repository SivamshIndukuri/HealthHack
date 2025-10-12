"use client";
import DoctorCard from "./doctorCard";
import Image from "next/image";

export default function Home() {
  const doctors = [
    { name: "Dr. Jane Smith", location: "123 Main St, Bridgeport, CT", number: "(203) 555-1212", rating: "4.5", hours: "9AM – 5PM" },
    { name: "Dr. John Doe", location: "456 Elm St, Stamford, CT", number: "(203) 555-2323", rating: "4.7", hours: "10AM – 6PM" },
    { name: "Dr. Emily Nguyen", location: "789 Maple Ave, Norwalk, CT", number: "(203) 555-3434", rating: "4.9", hours: "8AM – 4PM" },
    { name: "Dr. Emily Nguyen", location: "789 Maple Ave, Norwalk, CT", number: "(203) 555-3434", rating: "4.9", hours: "8AM – 4PM" },
    { name: "Dr. Emily Nguyen", location: "789 Maple Ave, Norwalk, CT", number: "(203) 555-3434", rating: "4.9", hours: "8AM – 4PM" },
    { name: "Dr. Emily Nguyen", location: "789 Maple Ave, Norwalk, CT", number: "(203) 555-3434", rating: "4.9", hours: "8AM – 4PM" },
    { name: "Dr. Emily Nguyen", location: "789 Maple Ave, Norwalk, CT", number: "(203) 555-3434", rating: "4.9", hours: "8AM – 4PM" },
    { name: "Dr. Emily Nguyen", location: "789 Maple Ave, Norwalk, CT", number: "(203) 555-3434", rating: "4.9", hours: "8AM – 4PM" },
    { name: "Dr. Emily Nguyen", location: "789 Maple Ave, Norwalk, CT", number: "(203) 555-3434", rating: "4.9", hours: "8AM – 4PM" },
    { name: "Dr. Emily Nguyen", location: "789 Maple Ave, Norwalk, CT", number: "(203) 555-3434", rating: "4.9", hours: "8AM – 4PM" },

  ];


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
