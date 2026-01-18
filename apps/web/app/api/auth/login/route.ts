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

    const resp = await fetch(`https://uxg0a1lqt3.execute-api.us-east-1.amazonaws.com/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
        return NextResponse.json(data, { status: resp.status });
    }

    const res = NextResponse.json(
        { user: data.user }, // don’t send tokens back to browser
        { status: 200 }
    );

    res.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 30,
    });

    res.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });

    return res;
}