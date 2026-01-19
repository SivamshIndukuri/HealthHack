import { getPool } from "../db/db";
import jwt from "jsonwebtoken";
import crypto from "crypto";

type AuthResult =
  | { valid: true; expired: false; userId: string; accessToken: string; payload: any }
  | { valid: true; expired: true; userId: string; accessToken: string }
  | { valid: false; expired: false }
  | { valid: false; expired: true };

export async function auth(refreshToken: string, authToken: string): Promise<AuthResult> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return { valid: false, expired: false };

  // 1) Verify access token
  try {
    const decoded: any = jwt.verify(authToken, secret);

    const userId =
      decoded?.userId ??
      decoded?.user_id ??
      decoded?.sub ??
      null;

    if (!userId) return { valid: false, expired: false };

    return {
      valid: true,
      expired: false,
      userId,
      accessToken: authToken,   
      payload: decoded,
    };
  } catch (err: any) {
    if (err?.name !== "TokenExpiredError") {
      return { valid: false, expired: false };
    }
  }

  // 2) Access token expired -> use refresh token
  if (!refreshToken) return { valid: false, expired: true };

  const pool = getPool();
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  let userId: string;
  try {
    const { rows } = await pool.query(
      `
      SELECT user_id
      FROM clinic.refresh_tokens
      WHERE token = $1
        AND expires_at > NOW()
        AND revoked_at IS NULL
      LIMIT 1
      `,
      [refreshTokenHash]
    );

    if (rows.length === 0) return { valid: false, expired: true };
    userId = rows[0].user_id;
  } catch (err: any) {
    console.log("REFRESH_LOOKUP_ERROR:", err);
    return { valid: false, expired: true };
  }

  const newAccessToken = jwt.sign(
    {
      iss: "HealthHack",
      userId,
      jti: crypto.randomBytes(16).toString("hex"),
    },
    secret,
    { expiresIn: "1h" }
  );

  return {
    valid: true,
    expired: true,
    userId,
    accessToken: newAccessToken,
  };
}
