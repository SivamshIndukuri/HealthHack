import axios from "axios";

export default async function handler(req, res) {
  const { location, radius = 5000, query = "psychiatrist" } = req.query;

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    // 1️⃣ Text Search: get nearby psychiatrists
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&location=${location}&radius=${radius}&key=${googleApiKey}`;

    const searchResponse = await axios.get(textSearchUrl);
    const places = searchResponse.data.results;

    // 2️⃣ For each place, call Place Details API to get phone and opening hours
    const detailedResults = await Promise.all(
      places.map(async (place) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,opening_hours,geometry&key=${googleApiKey}`;
        const detailsResponse = await axios.get(detailsUrl);
        const details = detailsResponse.data.result;

        return {
          name: details.name,
          address: place.formatted_address,
          location: details.geometry?.location,
          rating: place.rating || "N/A",
          phone: details.formatted_phone_number || "N/A",
          hours: details.opening_hours?.weekday_text || [],
        };
      })
    );

    detailedResults.sort((a, b) => b.rating - a.rating)

    res.status(200).json({ results: detailedResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
