import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Req KEEP SAME DOCTOR NAME DO NOT CHANGE 
// {
//   "doctorFirstName": "John",
//   "doctorLastName": "Smith",
//   "patientFirstName": "Jane",
//   "patientLastName": "Jessie",
//   "insurance": "Singh",
//   "dateOfBirth": "1990-04-12",
//   "score": 82,
//   "patientNumber": "7325550101",
//   "email": "jane.doe@email.com"
// }

// RES
// {
//   "success": true,
//   "doctorId": "53bacce9-dedc-488a-9861-302ffb3a736e",
//   "patientId": "e3c922b3-cdc5-4bd1-a6b7-588f974c726c"
// }

export async function POST(req: Request) {

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

 
  const body = await req.json().catch(() => ({}));

  const {
    doctorFirstName,
    doctorLastName,
    patientFirstName,
    patientLastName,
    insurance,
    dateOfBirth,
    score,
    patientNumber,
    email,
  } = body as {
    doctorFirstName?: string;
    doctorLastName?: string;
    patientFirstName?: string;
    patientLastName?: string;
    insurance?: string;
    dateOfBirth?: string; 
    score?: number;
    patientNumber?: string;
    email?: string;
  };

  // 3) basic validation (optional but saves you pain)
  if (
    !doctorFirstName ||
    !doctorLastName ||
    !patientFirstName ||
    !patientLastName ||
    !insurance ||
    !dateOfBirth
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // 4) call your lambda (include tokens from cookies)
  const payload = {
    accessToken,
    refreshToken,
    doctorFirstName,
    doctorLastName,
    patientFirstName,
    patientLastName,
    insurance,
    dateOfBirth,
    score,
    patientNumber,
    email,
  };

  const resp = await fetch(
    "https://uxg0a1lqt3.execute-api.us-east-1.amazonaws.com/createPatients",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    return NextResponse.json(data, { status: resp.status });
  }

  // Lambda returns: { success: true, doctorId, patientId }
  return NextResponse.json(
    {
      success: data.success === true,
      doctorId: data.doctorId,
      patientId: data.patientId,
    },
    { status: 200 }
  );
}
