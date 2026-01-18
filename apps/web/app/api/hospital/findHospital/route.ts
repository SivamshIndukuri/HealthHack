 // app/api/auth/hospitals/findAndSave/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


// req:
// {
//     "patientId": "5c14a2ff-403c-4c5f-8fa4-b5c335fb0ef8",
//     "address": "2 Dipaolo Ct, Raritan, NJ",
//     "query": "hospital",
//     "radius": 5000
// }

// res
// {
//     "results": [
//         {
//             "hospital_name": "Hunterdon Healthcare",
//             "hospital_address": "45 F US-206, Raritan, NJ 08869, USA",
//             "hospital_phone_number": "(908) 237-4122",
//             "ranking": 5,
//             "call_status": "pending"
//         },
//         {
//             "hospital_name": "Maternity Pavillion At Robert Wood Johnson University Hospital",
//             "hospital_address": "110 Rehill Ave, Somerville, NJ 08876, USA",
//             "hospital_phone_number": "(908) 685-2863",
//             "ranking": 4,
//             "call_status": "pending"
//         },
//         {
//             "hospital_name": "Saint Peter's University Hospital",
//             "hospital_address": "254 Easton Ave, New Brunswick, NJ 08901, USA",
//             "hospital_phone_number": "(732) 745-8600",
//             "ranking": 4,
//             "call_status": "pending"
//         },

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { patientId, address, query, radius } = (await req.json().catch(() => ({}))) as {
    patientId?: string;
    address?: string;
    query?: string;
    radius?: number;
  };

  if (!patientId || !address) {
    return NextResponse.json({ error: "patientId and address are required" }, { status: 400 });
  }

  // 1) find hospitals
  const findResp = await fetch(
    "https://uxg0a1lqt3.execute-api.us-east-1.amazonaws.com/findHospital",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ address, query: query ?? "hospital", radius: radius ?? 5000 }),
      cache: "no-store",
    }
  );

  const findData = await findResp.json().catch(() => ({}));
  if (!findResp.ok) return NextResponse.json(findData, { status: findResp.status });

  const results = Array.isArray(findData.results) ? findData.results : [];

  // 2) save hospitals
  const saveResp = await fetch(
    "https://uxg0a1lqt3.execute-api.us-east-1.amazonaws.com/saveHospital",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken, patientId, results }),
      cache: "no-store",
    }
  );

  const saveData = await saveResp.json().catch(() => ({}));
  if (!saveResp.ok) return NextResponse.json(saveData, { status: saveResp.status });

  return NextResponse.json({ results, saved: saveData }, { status: 200 });
}
