import { NextRequest, NextResponse } from 'next/server';
import Twilio from 'twilio';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { to, insurance } = body; // dynamic insurance

  const from = process.env.TWILIO_NUMBER!;
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const ngrokUrl = process.env.TWIML_URL!;

  const client = Twilio(accountSid, authToken);

  try {
    const call = await client.calls.create({
      to,
      from,
      url: `${ngrokUrl}/api/voice?insuranceName=${encodeURIComponent(insurance ?? 'the insurance')}`, // pass dynamic insuranceName
    });

    console.log('Call SID:', call.sid, 'Insurance:', insurance);
    return NextResponse.json({ message: 'Call placed', sid: call.sid });
  } catch (err: any) {
    console.error('Error placing call:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
