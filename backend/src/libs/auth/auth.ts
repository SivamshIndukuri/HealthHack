import { getPool } from "../db/db"
import jwt from "jsonwebtoken";
import crypto from "crypto";


type AuthResult =
| { valid: true; expired: false; payload: any, userId: any }
| { valid: false; expired: false }                
| { valid: false; expired: true }                  
| { valid: true; expired: true; userId:any; accessToken: string }; 

export async function auth(refreshToken: string, authToken: string): Promise<AuthResult> {
    const secret = process.env.JWT_SECRET;
    if (!secret) return { valid: false, expired: false };
  
    if (!authToken) return { valid: false, expired: false };
  
    try {
      const decoded: any = jwt.verify(authToken, secret);
      if (!decoded?.userId) return { valid: false, expired: false };
      return { valid: true, expired: false, userId: decoded.userId, payload: decoded };
    } catch (err: any) {
      if (err.name !== "TokenExpiredError") 
      return { valid: false, expired: false };
    }
  
    if (!refreshToken) return { valid: false, expired: true };
  
    const pool = getPool();
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  
    let userId: string;
    try {
      const { rows } = await pool.query(
        `SELECT user_id
         FROM clinic.refresh_tokens
         WHERE token = $1
           AND expires_at > NOW()
         LIMIT 1`,
        [refreshTokenHash]
      );
      if (rows.length === 0) return { valid: false, expired: true };
      userId = rows[0].user_id;
    } catch (err: any) {
      console.log(err);
      return { valid: false, expired: true };
    }
  
    const accessToken = jwt.sign(
      { iss: "HealthHack", userId, jti: crypto.randomBytes(16).toString("hex") },
      secret,
      { expiresIn: "1h" }
    );
  
    return { valid: true, expired: true, accessToken, userId };
  }
  