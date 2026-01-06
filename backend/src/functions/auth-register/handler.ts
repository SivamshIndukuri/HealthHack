import bcrypt from "bcryptjs";
import { getPool } from "../../libs/db/db"; // adjust if your path is ../../libs/db

export const handler = async (event: any) => {
  console.log("EVENT:", JSON.stringify(event));

  // Parse body (works for HTTP API)
  let body: any = {};
  try {
    body = event?.body ? JSON.parse(event.body) : {};
  } catch (e) {
    console.log("BODY_PARSE_ERROR:", e);
    body = {};
  }

  console.log("PARSED_BODY:", body);

  const { username, password } = body as { username?: string; password?: string };

  if (!username || !password) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing username or password" }),
    };
  }

  if (password.length < 8) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Password must be at least 8 characters" }),
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const pool = getPool();

    const { rows } = await pool.query(
      `INSERT INTO clinic.users (username, user_password, user_role)
       VALUES ($1, $2, $3)
       RETURNING user_id, username, user_role, created_at`,
      [username, passwordHash, "user"]
    );

    return {
      statusCode: 201,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user: rows[0] }),
    };
  } catch (err: any) {
    console.log("DB_ERROR:", err);

    if (err?.code === "23505") {
      return {
        statusCode: 409,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "User already exists" }),
      };
    }

    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Failed to register user", detail: String(err?.message ?? err) }),
    };
  }
};
