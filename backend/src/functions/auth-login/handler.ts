import { getPool } from "../../libs/db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//import { UserRow } from "@/types/user"
import crypto from "crypto";

export const handler = async (event: any) => {
    
    let body;
    body = JSON.parse(event.body);

    //  1. Validate User input
    if(!body.username || !body.password){
        return {
            statusCode: 400,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ error: "Missing username or password" }),
        };
    }

    let user;

    const pool = getPool();

    try{
        const { rows } = await pool.query(
            `SELECT user_id, username, user_password 
            from clinic.users
            Where username = $1`,
            [body.username]
        )
        
        if (rows.length === 0){
            return {
                statusCode: 401,
                headers: { "content-type": "application/json" },
                body: JSON.stringify({error: "Invalid Username or Password"})
            }
        }

        user = rows[0]
    } catch(err:any){
        console.log(err)
        return {
            statusCode: 500,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({error: "Invalid Username and Password"})
        }
    }

    const isValid = await bcrypt.compare(body.password, user.user_password)

    if(!isValid){
        return {
            statusCode: 401,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({error: "Invlid Password"})
        }
    }

    // 3.  User Athentcated; Now Generate token
    const secret = process.env.JWT_SECRET;
    
    const accessToken = jwt.sign(
        {
            iss: 'HealthHack',
            userId: user.user_id,
            jti: crypto.randomBytes(16).toString('hex'),
        },
        secret!,
        {
            expiresIn: "1h"
        }
    )

    
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
            VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
            [user.user_id, refreshTokenHash]
        );

        refreshToken = newRefreshToken;
    }catch(err:any){
        return {
            statusCode: 500,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({error: "Failed to set Refresh Token"})
        }
    }

    return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            accessToken,
            refreshToken,
            user: { userId: user.user_id, username: user.username },
        }),
    };
}
