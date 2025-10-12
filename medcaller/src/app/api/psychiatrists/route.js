// src/app/api/psychiatrists/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const radius   = searchParams.get("radius") ?? "5000";
    const query    = searchParams.get("query") ?? "psychiatrist";

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleApiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_MAPS_API_KEY" }, { status: 500 });
    }

    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json` +
      `?query=${encodeURIComponent(query)}` +
      `&location=${encodeURIComponent(location)}` +
      `&radius=${encodeURIComponent(radius)}` +
      `&key=${googleApiKey}`;

    const searchRes = await fetch(textSearchUrl, { cache: "no-store" });
    const searchData = await searchRes.json();
    const places = Array.isArray(searchData.results) ? searchData.results : [];

    const detailedResults = await Promise.all(
      places.map(async (place) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json` +
          `?place_id=${place.place_id}` +
          `&fields=name,formatted_phone_number,opening_hours,geometry,formatted_address,website` +
          `&key=${googleApiKey}`;

        const detailsRes = await fetch(detailsUrl, { cache: "no-store" });
        const detailsJson = await detailsRes.json();
        const d = detailsJson.result ?? {};

        // ensure numeric rating or null
        const rating = typeof place.rating === "number" ? place.rating : null;

        return {
          name: d.name ?? place.name ?? "Unknown",
          location: d.formatted_address ?? place.formatted_address ?? "N/A",
          address: d.geometry?.location ?? place.geometry?.location ?? null,
          rating,
          phone: d.formatted_phone_number ?? "N/A",
          hours: Array.isArray(d.opening_hours?.weekday_text) ? d.opening_hours.weekday_text : [],
          website: d.website ?? null,
          place_id: place.place_id,
        };
      })
    );

    detailedResults.sort((a, b) => (Number(b.rating ?? 0) - Number(a.rating ?? 0)));

    return NextResponse.json({ results: detailedResults }, { status: 200 });
  } catch (error) {
    console.error("psychiatrists route error:", error);
    return NextResponse.json({ error: error?.message ?? "Server error" }, { status: 500 });
  }
}
