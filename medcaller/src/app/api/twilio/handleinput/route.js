import { NextRequest } from "next/server";
import { twilio } from "twilio";

/**
 * 2️⃣ HANDLE USER INPUT (second route)
 */
export async function POST(req) {
  try {
    const data = await req.formData();
    const digit = data.get("Digits");

    let responseText = "Sorry, I did not understand that.";
    if (digit === "1") responseText = "You selected Option A.";
    else if (digit === "2") responseText = "You selected Option B.";
    else if (digit === "3") responseText = "You selected Option C.";

    const twiml = `
      <Response>
        <Say voice="alice">${responseText}</Say>
        <Say voice="alice">Returning to the main menu.</Say>
        <Redirect>${process.env.PUBLIC_URL}/api/twilio</Redirect>
      </Response>
    `;

    return new Response(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("Twilio Input Error:", err);
    return new Response(
      `<Response><Say>There was an error processing your input.</Say></Response>`,
      { status: 500, headers: { "Content-Type": "text/xml" } }
    );
  }
}
