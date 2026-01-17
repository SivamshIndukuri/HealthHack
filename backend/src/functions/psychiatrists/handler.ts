// backend/serverless/src/functions/psychiatrists/handler.ts

export const handler = async (event: any) => {
  console.log("EVENT:", JSON.stringify(event));

  const qs = event?.queryStringParameters || {};
  const location = qs.location; // "lat,lng"
  const radius = qs.radius || "5000";
  const query = qs.query || "psychiatrist";

  if (!location) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Location is required" }),
    };
  }

  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleApiKey) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing GOOGLE_MAPS_API_KEY" }),
    };
  }

  try {
    const textSearchUrl =
      `https://maps.googleapis.com/maps/api/place/textsearch/json` +
      `?query=${encodeURIComponent(query)}` +
      `&location=${encodeURIComponent(location)}` +
      `&radius=${encodeURIComponent(radius)}` +
      `&key=${googleApiKey}`;

    const searchRes = await fetch(textSearchUrl);
    const searchData = await searchRes.json();
    const places = Array.isArray(searchData?.results) ? searchData.results : [];

    const detailedResults = await Promise.all(
      places.map(async (place: any) => {
        const detailsUrl =
          `https://maps.googleapis.com/maps/api/place/details/json` +
          `?place_id=${place.place_id}` +
          `&fields=name,formatted_phone_number,opening_hours,geometry,formatted_address,website` +
          `&key=${googleApiKey}`;

        const detailsRes = await fetch(detailsUrl);
        const detailsJson = await detailsRes.json();
        const d = detailsJson?.result ?? {};

        const rating = typeof place?.rating === "number" ? place.rating : null;

        return {
          name: d?.name ?? place?.name ?? "Unknown",
          location: d?.formatted_address ?? place?.formatted_address ?? "N/A",
          address: d?.geometry?.location ?? place?.geometry?.location ?? null,
          rating,
          phone: d?.formatted_phone_number ?? "N/A",
          hours: Array.isArray(d?.opening_hours?.weekday_text) ? d.opening_hours.weekday_text : [],
          website: d?.website ?? null,
          place_id: place?.place_id ?? null,
        };
      })
    );

    detailedResults.sort((a: any, b: any) => Number(b?.rating ?? 0) - Number(a?.rating ?? 0));

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ results: detailedResults }),
    };
  } catch (error: any) {
    console.error("psychiatrists handler error:", error);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: error?.message ?? "Server error" }),
    };
  }
};
