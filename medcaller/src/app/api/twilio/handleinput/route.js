import { setSession, getSession, clearSession } from "@/lib/sessionStore.js";

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const stage = url.searchParams.get("stage") || "intro";
    const body = await req.text();
    const params = new URLSearchParams(body);
    const digit = params.get("Digits");
    const callSid = params.get("CallSid");

    let twiml = "";
    const base = process.env.PUBLIC_URL;

    // END CALL IMMEDIATELY
    if (digit === "0") {
      const thanks = `${base}/api/supabase?file=thanks.mp3`;
      twiml = `
        <Response>
          <Play>${thanks}</Play>
          <Hangup/>
        </Response>
      `;
      clearSession(callSid);
    }

    // --- INTRO STAGE: are you available? ---
    else if (stage === "intro") {
      if (digit === "1") {
        console.log("Doctor available for call:", callSid);
        // Available → save it and go to insurance step
        setSession(callSid, { available: true, stage: "insurance" });

        const insurance = `${base}/api/supabase?file=Aetna.mp3`;
        twiml = `
          <Response>
            <Gather input="dtmf" timeout="5" numDigits="1"
              action="${base}/api/twilio/handleinput?stage=insurance"
              method="POST">
              <Play>${insurance}</Play>
            </Gather>
            <Say>No input received. Goodbye.</Say>
            <Hangup/>
          </Response>
        `;
      } else if (digit === "0") {
        // Not available
        console.log("Doctor NOT available for call:", callSid);
        setSession(callSid, { available: false });
        const thanks = `${base}/api/supabase?file=thanks.mp3`;
        twiml = `
          <Response>
            <Play>${thanks}</Play>
            <Hangup/>
          </Response>
        `;
        clearSession(callSid);
      } else {
        // Invalid input
        twiml = `
          <Response>
            <Say>Invalid input. Returning to main menu.</Say>
            <Redirect>${base}/api/twilio/menu</Redirect>
          </Response>
        `;
      }
    }

    // --- INSURANCE STAGE ---
    else if (stage === "insurance") {
      const thanks = `${base}/api/supabase?file=thanks.mp3`;

      if (digit === "1") {
        setSession(callSid, { takesInsurance: true });
        console.log("Doctor takes insurance for call:", callSid);
      } else {
        setSession(callSid, { takesInsurance: false });
        console.log("Doctor does NOT take insurance for call:", callSid);
      }

      // Get final session info
      const session = getSession(callSid);
      console.log("Session after insurance step:", session);

      if (session?.doctorFound) {
        console.log("✅ Doctor found for call:", callSid);
      }

      twiml = `
        <Response>
          <Play>${thanks}</Play>
          <Hangup/>
        </Response>
      `;
      clearSession(callSid);
    }

    return new Response(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });

  } catch (err) {
    console.error("Twilio Input Error:", err);
    return new Response(
      `<Response><Say>Error processing input.</Say></Response>`,
      { status: 500, headers: { "Content-Type": "text/xml" } }
    );
  }
}
