export async function POST(req) {
  try {
    const intro = `${process.env.PUBLIC_URL}/api/supabase?file=intro.mp3`;

    const twiml = `
      <Response>
        <Gather input="dtmf" timeout="5" numDigits="1"
          action="${process.env.PUBLIC_URL}/api/twilio/handleinput?stage=intro"
          method="POST">
          <Play>${intro}</Play>
        </Gather>
        <Say>No input received. Goodbye.</Say>
        <Hangup/>
      </Response>
    `;

    return new Response(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("Twilio Menu Error:", err);
    return new Response(
      `<Response><Say>Error loading menu.</Say></Response>`,
      { status: 500, headers: { "Content-Type": "text/xml" } }
    );
  }
}
