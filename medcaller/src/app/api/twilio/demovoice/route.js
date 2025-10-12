import twilio from "twilio";

/**
 * 1️⃣ OUTBOUND CALL WITH INTERACTIVE MENU
 */
export async function POST(req) {
  try {
    const { to } = await req.json();
    if (!to)
      return new Response(JSON.stringify({ error: "Missing 'to'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // IMPORTANT: Replace this with your ngrok public URL in step 2
    const PUBLIC_URL = process.env.PUBLIC_URL;

    const twiml = `
      <Response>
        <Gather input="dtmf" timeout="5" numDigits="1" action="${PUBLIC_URL}/api/twilio/handleinput" method="POST">
          <Say voice="alice">
            Welcome to HealthHack. Press 1 for Option A, 2 for Option B, or 3 for Option C.
          </Say>
        </Gather>
        <Say voice="alice">We did not receive any input. Let's try again.</Say>
        <Redirect>${PUBLIC_URL}/api/twilio</Redirect>
      </Response>
    `;

    const call = await client.calls.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      twiml,
    });

    return new Response(
      JSON.stringify({ success: true, sid: call.sid }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Twilio Error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}