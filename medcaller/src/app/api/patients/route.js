import { NextResponse } from "next/server"
import { getPatientLocation } from "@/lib/db"

export async function GET(req) {
    const {searchParams } = new URL(req.url);
    const name = searchParams.get("name")

    if (!name) {
    return NextResponse.json({ error: "Patient name is required" }, { status: 400 });
  }
   
  try {
    const location = await getPatientLovcation(name);

    if (!location) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const googleApiKey = process.env.GEOCODE_KEY
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${googleApiKey}`;

    const geocodeRes = await fetch(geocodeUrl);
    const geocodeData = await geocodeRes.json();
    const coords = geocodeData.results[0]?.geometry?.location ?? null;

    return NextResponse.json({ location: coords }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }


}