import { NextResponse } from "next/server";
import { getPatientLocation } from "@/lib/db";

/**
 * GET /api/patients?name=Full%20Name
 * Returns: { location: { lat: number, lng: number } }
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const rawName = searchParams.get("name");

  // 1) Validate input
  const name = (rawName || "").trim();
  console.log(name)

  if (!name) {
    return NextResponse.json(
      { error: "Patient name is required" },
      { status: 303}
    );
  }

  try {
    // 2) Fetch address string from DB
    const address = await getPatientLocation(name); // MUST return a single address string
    if (!address) {
      return NextResponse.json(
        { error: "Patient not found or address invalid", addressType: typeof address },
        { status: 404 }
      );
    }

    // 3) Read Google key from env (DON'T hard-code secrets)
    const apiKey = process.env.GEOCODE_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEOCODE_KEY env var missing" },
        { status: 500 }
      );
    }

    // 4) Call Google Geocoding
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const geocodeRes = await fetch(geocodeUrl, { cache: "no-store" });
    if (!geocodeRes.ok) {
      return NextResponse.json(
        { error: `Geocoding HTTP ${geocodeRes.status}` },
        { status: 502 }
      );
    }

    const geocodeData = await geocodeRes.json();

    // 5) Validate geocode response
    const status = geocodeData?.status;
    const coords = geocodeData?.results?.[0]?.geometry?.location ?? null;

    if (status !== "OK" || !coords) {
      return NextResponse.json(
        {
          error: "Geocoding failed",
          geocode_status: status || "NO_STATUS",
          results_count: geocodeData?.results?.length ?? 0,
          address,
        },
        { status: 502 }
      );
    }

    // 6) Success
    return NextResponse.json({ location: coords }, { status: 200 });
  } catch (err) {
    // Log server-side only
    console.error("GET /api/patients error:", err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
