import { NextResponse } from "next/server";
import pool from "@/db/pool";
import crypto from "crypto";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(){
    const cookieStore =  await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
        const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        res.cookies.set("access_token", "", { maxAge: 0, path: "/" });
        res.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
        return res;
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    let user;
    try{
        const { rows } = await pool.query(
            `SELECT user_id
            FROM clinic.refresh_tokens
            WHERE token = $1 and 
            expires_at > NOW()
            LIMIT 1`,[refreshTokenHash]
        )

        if(rows.length == 0){
            const res =  NextResponse.json({ error: "Unauthorized: failed to find valid refresh token" }, { status: 401 });
            res.cookies.set("access_token", "", { maxAge: 0, path: "/" });
            res.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
            return res;
        }

        user = rows[0]
    }
    catch(err:any){
        const res =  NextResponse.json({ error: "Failed to Athenticate" }, { status: 401 });
        res.cookies.set("access_token", "", { maxAge: 0, path: "/" });
        res.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
        return res;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const token = jwt.sign(
        {
            iss: 'HealthHack',
            userId: user.user_id,
            jti: crypto.randomBytes(16).toString('hex'),
        },
        secret,
        {
            expiresIn: "30m"
        }
    )
    
    const response = NextResponse.json({ success: true });
    
    response.cookies.set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 30, 
        path: "/",
    });
    return response
}