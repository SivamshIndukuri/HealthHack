import twilio from "twilio";

// CREATING A VOICE CALL WITH A SPECIFIC MESSAGE WITH TWILIO VOICE
export async function POST(req) {
  try {
    // Parse the JSON body
    const { to, message } = await req.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: "Missing 'to' or 'message'" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Twilio credentials from environment variables
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Make the outbound call
    const call = await client.calls.create({
      from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number
      to: to,
      twiml: `<Response><Say>${message}</Say></Response>`, // text-to-speech message
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

// ACCESS SUPABASE INSURANCE AUDIOS & 

// CONCATENATING A VOICE CALL USING ELEVENLABS AUDIOS