
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Req
// {
//     "patientId": "5c14a2ff-403c-4c5f-8fa4-b5c335fb0ef8"
// }

// Res
// {
//     "hospitals": [
//         {
//             "hospital_id": "fa4be292-3eb0-41b9-9ca9-bd966f4f4429",
//             "hospital_name": "Saint Peter's University Hospital",
//             "hospital_address": "254 Easton Ave, New Brunswick, NJ 08901, USA",
//             "hospital_phone_number": "(732) 745-8600",
//             "ranking": 4,
//             "call_status": "pending"
//         },
//         {
//             "hospital_id": "5a0b05d4-8241-4de8-9315-d5ed82ef4975",
//             "hospital_name": "Bridgewater Internal Medicine",
//             "hospital_address": "215 Union Ave Suite E, Bridgewater, NJ 08807, USA",
//             "hospital_phone_number": "(908) 685-1818",
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

  const { patientId } = (await req.json().catch(() => ({}))) as {
    patientId?: string;
  };

  if (!patientId) {
    return NextResponse.json({ error: "patientId is required" }, { status: 400 });
  }

  const resp = await fetch(
    "https://uxg0a1lqt3.execute-api.us-east-1.amazonaws.com/getHospital",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken, patientId }),
      cache: "no-store",
    }
  );

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    return NextResponse.json(data, { status: resp.status });
  }

  return NextResponse.json({ hospitals: data.hospitals ?? [] }, { status: 200 });
}
