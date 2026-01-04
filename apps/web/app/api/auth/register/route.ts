import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/db/pool";

// POST request send data to server to create or update resources 
export async function POST(req:Request){
    const body = await req.json().catch(() => ({}));

    const {username, password} = body as {username?:string, password?:string};

    if(!username || !password){
        return NextResponse.json({error: "Missing username or password"},{status:400});
    }

    if(password.length < 8){
        return NextResponse.json({error: "Password must be at least 8 characters"},{status:400});
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    try{
        const { rows } = await pool.query(
            `INSERT INTO 
            clinic.users (username, password, user_role) 
            VALUES($1, $2, $3)
            RETURNING user_id, username, user_role, created_at`,
            [username, passwordHash, "user"]
        )

        return NextResponse.json({ user: rows[0] }, { status: 201 });
    }
    catch(err:any){
        if(err?.code === '23505'){
            return NextResponse.json({ error: "User already exists"},{status:409});
        }
        console.log(err)
        return NextResponse.json({ error: "Failed to register user"},{status:500});
    }
}