import Twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../../.env' });

const accountSid: string | undefined = process.env.TWILIO_ACCOUNT_SID;
const authToken: string | undefined = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set');
}

const client = Twilio(accountSid, authToken);

type Event = {
  From?: string;
  To?: string;
  Url?: string;
};

type Response = {
  statusCode: number;
  body: string;
};

export const handler = async (event: Event, context: any): Promise<Response> => {
  // Default values if not provided
  const from: string = event.From || process.env.TWILIO_NUMBER!;
  const to: string = event.To || '+12019821188'; // Replace with a verified number
  const url: string = event.Url || 'http://demo.twilio.com/docs/voice.xml';

  try {
    const call = await client.calls.create({ to, from, url });
    console.log('Call successfully placed');
    console.log(call.sid);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Success! Call SID: ${call.sid}` }),
    };
  } catch (error: any) {
    console.error('Error placing call:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || error }),
    };
  }
};
