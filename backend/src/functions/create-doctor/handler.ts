import { getPool } from "../../libs/db/db"; // adjust if your path is ../../libs/db
import { auth } from "../../libs/auth/auth"

// input auth token, userId, doctor, name patients info
export const handler = async (event: any) => {
    let body: any = {};
    try {
      body = event?.body ? JSON.parse(event.body) : {};
    } catch (err) {
      console.log("BODY_PARSE_ERROR:", err);
      body = {};
    }
  
    const {accessToken, refreshToken, doctorFirstName, doctorLastName} = body 
    
    if (!doctorFirstName || !doctorLastName) {
        return {
          statusCode: 400,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ error: "Missing doctorFirstName or doctorLastName" }),
        };
    }

    let validAccessToken = accessToken
    
    const authStatus = await auth(refreshToken, accessToken)

    if(!authStatus.valid){
        return{
            statusCode: 401,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ success: "Failed to Authenticate" }),
        }
    }

    if(authStatus.expired){
        validAccessToken = authStatus.accessToken
    }

    let pool = getPool()
    try{
        await pool.query(
            `INSERT INTO clinic.doctors (
              user_id,
              doctor_first_name,
              doctor_last_name
            )
            VALUES ($1, $2, $3)`,
            [
                authStatus.userId,
                doctorFirstName,
                doctorLastName
            ]
        );
        
        return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ 
                validAccessToken,
                success: "Created Docter" }),
        }
    } catch(err:any){
        console.log('Failed to Insert Doctor', err)
        return{
            statusCode: 500,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ success: "Failed to make Doctor" }),
        }
    }
    
}