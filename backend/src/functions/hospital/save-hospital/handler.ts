import { getPool } from "../../../libs/db/db"; 
import { auth } from "../../../libs/auth/auth";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";


const sqs = new SQSClient({ region:"us-east-1"}); 
const QUEUE_URL = process.env.QUEUE_URL!;

export const handler = async (event: any) => {
    let body: any = {};

    try {
        body = event?.body ? JSON.parse(event.body) : {};
    } catch (err) {
    console.log("BODY_PARSE_ERROR:", err);
    body = {};
    }

    const { accessToken, refreshToken, patientId, results } = body;

    // 1) Validate input
    if (!accessToken || !refreshToken) {
        return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "accessToken and refreshToken are required" }),
        };
    }

    if (!patientId) {
        return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "patientId is required" }),
        };
    }

    if (!Array.isArray(results) || results.length === 0) {
        return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "results must be a non-empty array" }),
        };
    }

    const authStatus = await auth(refreshToken, accessToken);

    if (!authStatus.valid) {
        return {
        statusCode: 401,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Failed to validate" }),
        };
    }

    const pool = getPool();

    try{
        const inserted: any[] = [];
        let attempted = 0;

        for (const h of results) {
            attempted++;

            const hospital_name = String(h?.hospital_name ?? "").trim();
            const hospital_address = String(h?.hospital_address ?? "").trim();
            const hospital_phone_number = String(h?.hospital_phone_number ?? "N/A").trim();

            if (!hospital_name || !hospital_address) continue;

            const rankingRaw = h?.ranking;
            const ranking =
                rankingRaw === null || rankingRaw === undefined || rankingRaw === ""
                ? null
                : Math.round(Number(rankingRaw));

            const call_status = String(h?.call_status ?? "pending").trim() || "pending";


            const { rows } = await pool.query(
                `
                INSERT INTO clinic.hospitals (
                  hospital_name,
                  hospital_address,
                  hospital_phone_number,
                  ranking,
                  call_status,
                  patient_id
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING
                RETURNING hospital_id, hospital_name, hospital_address, hospital_phone_number, ranking, call_status, patient_id
                `,
                [
                  hospital_name,
                  hospital_address,
                  hospital_phone_number,
                  Number.isFinite(ranking as any) ? ranking : null,
                  call_status,
                  patientId, 
                ]
              );
            if (rows.length > 0) inserted.push(rows[0]);
        }

        let messageId: string | undefined;

        try {
            const result = await sqs.send(
                new SendMessageCommand({
                QueueUrl: QUEUE_URL,
                MessageBody: JSON.stringify({ patientId }),
                })
            );
            messageId = result.MessageId;
        } catch (err) {
            console.error("SQS_SEND_ERROR:", err);
            return {
            statusCode: 500,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ error: "SQS send failed" }),
            };
        }

        return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              attempted,
              inserted: inserted.length,
              hospitals: inserted,
            }),
        };
    } catch(err: any){
        console.error("SAVE_HOSPITALS_ERROR:", err);

        return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: err?.message ?? "Failed to save hospitals" }),
        };
    }
}