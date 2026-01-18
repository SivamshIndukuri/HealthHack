import { getPool } from "../../libs/db/db";
import { auth } from "../../libs/auth/auth";

// authToken, refreshToken
export const handler = async (event: any) => {
  let body: any = {};
  try {
    body = event?.body ? JSON.parse(event.body) : {};
  } catch (err) {
    console.log("BODY_PARSE_ERROR:", err);
    body = {};
  }

  const { accessToken, refreshToken } = body;

  const authStatus = await auth(refreshToken, accessToken);
  if (!authStatus.valid) {
    return {
      statusCode: 401,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Failed to validate" }),
    };
  }

  const pool = getPool();

  try {
    const { rows } = await pool.query(
      `
      SELECT
        d.doctor_id,
        d.doctor_first_name,
        d.doctor_last_name,
        p.patient_id,
        p.patient_first_name,
        p.patient_last_name,
        p.insurance,
        p.date_of_birth,
        p.score,
        p.patient_phone_number,
        p.email,
        p.patient_status,
        p.created_at
      FROM clinic.patients p
      JOIN clinic.doctors d
        ON p.doctor_id = d.doctor_id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      `,
      [authStatus.userId]
    );

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ patients: rows }),
    };
  } catch (err: any) {
    console.error("Get patients error:", err);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Failed to fetch patients" }),
    };
  }
};
