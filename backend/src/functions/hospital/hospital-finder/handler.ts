// Body: {address, query?, radius? }
export const handler = async (event: any) => {
  let body: any = {};
  try {
    body = event?.body ? JSON.parse(event.body) : {};
  } catch (err) {
    console.log("BODY_PARSE_ERROR:", err);
    body = {};
  }

  const {
    address,
    query = "hospital",
    radius = 5000,
  } = body;

  const addr = (address || "").trim();
  if (!addr) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "address is required (plain English)" }),
    };
  }

  const rad = Number(radius);
  if (!Number.isFinite(rad) || rad <= 0) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "radius must be a positive number (meters)" }),
    };
  }

  // Keys
  const geocodeKey = process.env.GEOCODE_KEY;
  const placesKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!geocodeKey) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing GEOCODE_KEY (or GOOGLE_MAPS_API_KEY)" }),
    };
  }

  if (!placesKey) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing GOOGLE_MAPS_API_KEY (or GEOCODE_KEY)" }),
    };
  }

  try {
    // 1) Geocode address -> lat/lng
    const geocodeUrl =
      `https://maps.googleapis.com/maps/api/geocode/json` +
      `?address=${encodeURIComponent(addr)}` +
      `&key=${geocodeKey}`;

    const geocodeRes = await fetch(geocodeUrl);
    const geocodeData = await geocodeRes.json();

    const geoStatus = geocodeData?.status;
    const coords = geocodeData?.results?.[0]?.geometry?.location ?? null;

    if (geoStatus !== "OK" || !coords) {
      return {
        statusCode: 502,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          error: "Geocoding failed",
          geocode_status: geoStatus || "NO_STATUS",
          results_count: geocodeData?.results?.length ?? 0,
          address: addr,
        }),
      };
    }

    const locationStr = `${coords.lat},${coords.lng}`;

    // 2) Places text search near that location
    const textSearchUrl =
      `https://maps.googleapis.com/maps/api/place/textsearch/json` +
      `?query=${encodeURIComponent(query)}` +
      `&location=${encodeURIComponent(locationStr)}` +
      `&radius=${encodeURIComponent(String(rad))}` +
      `&key=${placesKey}`;

    const searchRes = await fetch(textSearchUrl);
    const searchData = await searchRes.json();

    const placesStatus = searchData?.status;
    const places = Array.isArray(searchData?.results) ? searchData.results : [];

    if (placesStatus !== "OK" && placesStatus !== "ZERO_RESULTS") {
      return {
        statusCode: 502,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          error: "Places search failed",
          places_status: placesStatus || "NO_STATUS",
          address: addr,
          location: locationStr,
        }),
      };
    }

    // optional: limit
    const limitedPlaces = places.slice(0, 10);

    // 3) details calls
    const detailedResults = await Promise.all(
      limitedPlaces.map(async (place: any) => {
        const detailsUrl =
          `https://maps.googleapis.com/maps/api/place/details/json` +
          `?place_id=${place.place_id}` +
          `&fields=name,formatted_phone_number,opening_hours,geometry,formatted_address,website` +
          `&key=${placesKey}`;

        const detailsRes = await fetch(detailsUrl);
        const detailsJson = await detailsRes.json();
        const d = detailsJson?.result ?? {};

        const rating = typeof place?.rating === "number" ? place.rating : null;

        // Shape to match your DB columns
        return {
          hospital_name: d?.name ?? place?.name ?? "Unknown",
          hospital_address: d?.formatted_address ?? place?.formatted_address ?? "N/A",
          hospital_phone_number: d?.formatted_phone_number ?? "N/A",
          ranking: rating == null ? null : Math.round(Number(rating)),
          call_status: "pending",
        };
      })
    );

    detailedResults.sort((a: any, b: any) => Number(b?.ranking ?? 0) - Number(a?.ranking ?? 0));

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        input: { address: addr, query, radius: rad},
        geocoded: { location: coords, locationStr },
        results: detailedResults,
      }),
    };
  } catch (error: any) {
    console.error("lambda search error:", error);
    console.error("cause:", error?.cause);

    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        error: error?.message ?? "Server error",
        cause: error?.cause?.message ?? null,
        code: error?.cause?.code ?? null,
      }),
    };
  }
};
