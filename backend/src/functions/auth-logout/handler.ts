import { getPool } from "../../libs/db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const handler = async (event: any) => {
    let body;
    body = JSON.parse(event.body);

    const refreshToken = body.refreshToken

    if(!refreshToken){
        return{
            statusCode: 400,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ success: "Missing token" }),
        }
    }

    const pool = getPool();
    const refreshTokenHash = crypto.createHash("sha256").update(body.refreshToken).digest("hex");

    try{
        await pool.query(
            `DELETE FROM clinic.refresh_tokens where token = $1`,
            [refreshTokenHash]
        );
    } catch(err:any){
        console.error("Logout: failed to delete refresh token", err);
    }
    
    return{
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "Logged Out" }),
    }
}