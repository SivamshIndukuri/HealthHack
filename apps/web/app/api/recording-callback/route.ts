import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const callSid = body.get('CallSid');
  const recordingSid = body.get('RecordingSid');
  const recordingUrl = body.get('RecordingUrl');

  console.log('Recording completed:');
  console.log('CallSid:', callSid);
  console.log('RecordingSid:', recordingSid);
  console.log('Recording URL:', recordingUrl);

  // You could save recording URL to DB here if needed

  return new NextResponse('OK', { status: 200 });
}
