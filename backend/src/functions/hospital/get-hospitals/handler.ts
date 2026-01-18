import { getPool } from "../../../libs/db/db"; 
import { auth } from "../../../libs/auth/auth";

export const handler = async (event: any) => {
  let body: any = {};

  try {
    body = event?.body ? JSON.parse(event.body) : {};
  } catch (err) {
    console.log("BODY_PARSE_ERROR:", err);
  }

  const { accessToken, refreshToken, patientId } = body;

  if (!patientId) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "patientId is required" }),
    };
  }

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
      `SELECT hospital_id, hospital_name,
              hospital_address, hospital_phone_number,
              ranking, call_status
       FROM clinic.hospitals
       WHERE patient_id = $1`,
      [patientId]
    );

    if (rows.length === 0) {
      return {
        statusCode: 404,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Hospitals not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ hospitals: rows }),
    };
  } catch (err) {
    console.error("Get hospitals error:", err);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Failed to fetch hospitals" }),
    };
  }
};
