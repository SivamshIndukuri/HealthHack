import { NextResponse } from "next/server";
import pool from "@/db/pool";
import crypto from "crypto";
import { cookies } from "next/headers";


export async function POST(){
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
        return NextResponse.json({ success: true });
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    // delete refresh token
    try{
       await pool.query(
            `DELETE FROM clinic.refresh_tokens where token = $1`,
            [refreshTokenHash]
        );
    }catch(err:any){
        console.error("Logout: failed to delete refresh token", err);
    }

    const res = NextResponse.json({ success: true });
    
    const cookieOpts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 0,
        path: "/",
    };
    
    res.cookies.set("access_token", "", cookieOpts);
    res.cookies.set("refresh_token", "", cookieOpts)

    return res
}