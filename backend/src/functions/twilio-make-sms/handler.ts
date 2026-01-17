import Twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../../.env' });

const accountSid: string | undefined = process.env.TWILIO_ACCOUNT_SID;
const authToken: string | undefined = process.env.TWILIO_AUTH_TOKEN;

console.log(accountSid, authToken);

if (!accountSid || !authToken) {
  throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set');
}

const client = Twilio(accountSid, authToken);

type Event = {
  body: string;
};

type Response = {
  statusCode: number;
  body: string;
};

export const handler = async (event: Event, context: any): Promise<Response> => {
  const data = JSON.parse(event.body);
  const body: string = data.body;
  const to: string = data.to;

  try {
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_NUMBER!,
      to: to,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(message),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
