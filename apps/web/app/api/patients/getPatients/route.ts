import { cookies } from "next/headers";
import { NextResponse } from "next/server";


// Now req body

//res body:
// {
//     "patients": [
//       {
//         "doctor_id": "7b4d1c1e-8a8f-4e87-9d2b-3a91c3b5a001",
//         "doctor_first_name": "John",
//         "doctor_last_name": "Smith",
//         "patient_id": "b2c9e7c0-12ab-4ef4-a5e1-99a4f2f1b777",
//         "patient_first_name": "Jane",
//         "patient_last_name": "Doe",
//         "insurance": "Aetna",
//         "date_of_birth": "1995-03-14",
//         "score": 87,
//         "patient_phone_number": "7325551234",
//         "email": "jane.doe@email.com",
//         "patient_status": "active",
//         "created_at": "2025-01-10T18:42:11.921Z"
//       }
//     ]
// }
  

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const resp = await fetch(
    "https://uxg0a1lqt3.execute-api.us-east-1.amazonaws.com/getPatients",
    {
      method: "POST", 
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
      cache: "no-store",
    }
  );

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    return NextResponse.json(data, { status: resp.status });
  }

  return NextResponse.json({ patients: data.patients ?? [] }, { status: 200 });
}
