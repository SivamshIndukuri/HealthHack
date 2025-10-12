import twilio from "twilio";

export async function POST(req) {
  try {
    const { to } = { to: "+12019821188" };

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const call = await client.calls.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      url: `${process.env.PUBLIC_URL}/api/twilio/menu`,
    });

    return new Response(
      JSON.stringify({ success: true, sid: call.sid }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Twilio Call Error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
