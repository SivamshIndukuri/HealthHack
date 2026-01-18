import { getPool } from "../../libs/db/db"; // adjust if your path is ../../libs/db
import { auth } from "../../libs/auth/auth";
// import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";


// const sqs = new SQSClient({ region:"us-east-1"}); 
// const QUEUE_URL = process.env.QUEUE_URL!;

// input auth token, userId, doctor, name patients info
export const handler = async (event: any) => {
    let body: any = {};

    try {
      body = event?.body ? JSON.parse(event.body) : {};
    } catch (err) {
      console.log("BODY_PARSE_ERROR:", err);
      body = {};
    }
  
    const {
      accessToken,
      refreshToken,
      doctorFirstName,
      doctorLastName,
      patientFirstName,
      patientLastName,
      insurance,
      dateOfBirth,
      score,
      patientNumber,
      email,
    } = body;

    const authStatus = await auth(refreshToken, accessToken)
    if (authStatus.valid == false){
        return{
            statusCode: 401,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ success: "Failed to validate" }),
        }
    }
    let doctorId = null
    let pool = getPool()

    // find doctorId
    try{
        const { rows } = await pool.query(
            `Select doctor_id from clinic.doctors 
            WHERE user_id = $1
            AND doctor_first_name = $2
            AND doctor_last_name = $3`,
            [
                authStatus.userId,
                doctorFirstName,
                doctorLastName
            ]
        );

        if (rows.length === 0) {
            return {
              statusCode: 404,
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ error: "Doctor not found" }),
            };
        }
        
        doctorId = rows[0].doctor_id;
    } catch(err){
        console.error("DOCTOR_LOOKUP_ERROR:", err);
        return{
            statusCode: 500,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ success: "Failed to find doctor" }),
        }
    }

    let patientId = null
    //insert patient
    try{
        const { rows } = await pool.query(
            `INSERT INTO clinic.patients (
                user_id,
                patient_first_name,
                patient_last_name,
                insurance,
                date_of_birth,
                score,
                patient_phone_number,
                email,
                doctor_id,
                patient_status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING patient_id`,
            [
                authStatus.userId,
                patientFirstName,
                patientLastName,
                insurance,
                dateOfBirth,
                score,
                patientNumber,
                email,
                doctorId,
                "active"
            ]
        )

        if (rows.length === 0) {
            return {
              statusCode: 404,
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ error: "Doctor not found" }),
            };
        }

        patientId = rows[0].patient_id;

    } catch(err){
        console.error("Insert patient:", err);
        return{
            statusCode: 500,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ error: "Failed to insert patient" }),
        }
    }


    return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ success: true, doctorId, patientId}),
    };

   
};
