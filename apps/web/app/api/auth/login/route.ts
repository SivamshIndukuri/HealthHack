import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/db/pool";
import jwt from "jsonwebtoken";
import { UserRow } from "@/types/user"
import crypto from "crypto";



// POST request send data to server to create or update resources 
export async function POST(req:Request){
    const body = await req.json().catch(()=>({}))

    const {username, password} = body as {username?:string, password?:string}

    // 1. Validate User input 
    if (!username || !password) {
        return NextResponse.json(
          { error: "Missing username or password" },
          { status: 400 }
        );
    }

    let user:UserRow;

    // 2. grab password to compair cradentials 
    try{
        const { rows } = await pool.query(
            `SELECT user_id, username, user_password 
            from clinic.users
            Where username = $1`,
            [username]
        )

        if (rows.length === 0){
            return NextResponse.json({error:"Invalid Username"}, { status:401});
        }

        user = rows[0]
    } catch(err:any){
        console.log(err)
        return NextResponse.json({ error: "Failed to Authenticate user"},{status:500});
    }
    
    const isValid = await bcrypt.compare(password, user.user_password)

    if(!isValid){
        return NextResponse.json({error: "Wrong Password"}, {status:401})
    }

    // 3.  User Athentcated; Now Generate token
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

    // 4. set refresh token 
    let refreshToken: string;
    try{
        await pool.query(
            `DELETE FROM clinic.refresh_tokens WHERE user_id = $1`,
            [user.user_id]
        );

        const newRefreshToken = crypto.randomBytes(32).toString("hex");
        const refreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
        
        await pool.query(
            `INSERT INTO clinic.refresh_tokens(user_id, token, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '1 day')`,
            [user.user_id, refreshTokenHash]
        );
        
        refreshToken = newRefreshToken;
    }
    catch(err:any){
        console.log(err)
        return NextResponse.json({ error: "Failed Refresh Token"},{status:500}); 
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 30, 
        path: "/",
    });
    response.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
    });

    return response;
}