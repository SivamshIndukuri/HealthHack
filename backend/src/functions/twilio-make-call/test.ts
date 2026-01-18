import { handler } from './handler';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../../.env' });

const testEvent = {
  To: '+12019821188',
  From: process.env.TWILIO_NUMBER,       // Your Twilio number
  Url: 'http://demo.twilio.com/docs/voice.xml', // TwiML instructions
};

handler(testEvent, {})
  .then((res) => console.log('Lambda response:', res))
  .catch((err) => console.error(err));
