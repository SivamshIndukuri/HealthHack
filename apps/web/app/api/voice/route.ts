import { NextRequest, NextResponse } from 'next/server';
import { twiml as TwiML } from 'twilio';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const insuranceName = url.searchParams.get('insuranceName') || 'the insurance';

  const VoiceResponse = TwiML.VoiceResponse;
  const response = new VoiceResponse();

  // Intro
  response.say(
    { voice: 'alice' },
    'Hello. This is R W J Barnabas Hospital. ' +
      'This is an automated message seeking care for a patient experiencing symptoms of post partum depression.'
  );

  response.pause({ length: 1 });

  // First step: PPD services
  const gather = response.gather({
    numDigits: 1,
    action: `/api/gather?step=ppd-services&insuranceName=${encodeURIComponent(insuranceName)}`,
    method: 'POST',
  });

  gather.say(
    'Do you provide evaluations and services for post partum depression? Press 1 for yes, or press 0 for no.'
  );

  return new NextResponse(response.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
