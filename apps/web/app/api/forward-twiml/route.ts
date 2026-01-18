import { NextRequest, NextResponse } from 'next/server';
import { twiml as TwiML } from 'twilio';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const forwardTo = url.searchParams.get('forwardTo');

  const VoiceResponse = TwiML.VoiceResponse;
  const response = new VoiceResponse();

  if (!forwardTo) {
    response.say('No forwarding number provided. Goodbye.');
    response.hangup();
  } else {
    // Intro message
    response.say(
      { voice: 'alice' },
      'You will now be connected. This call may be recorded.'
    );

    // Forward call and record
    response.dial(
      { record: 'record-from-answer', recordingStatusCallback: '/api/recording-callback', callerId: process.env.TWILIO_NUMBER! },
      forwardTo
    );
  }

  return new NextResponse(response.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
