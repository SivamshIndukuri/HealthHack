import { NextRequest, NextResponse } from 'next/server';
import { twiml as TwiML } from 'twilio';

function isValidDateMMDD(mmdd: string): boolean {
  if (!/^\d{4}$/.test(mmdd)) return false;
  const month = parseInt(mmdd.slice(0, 2), 10);
  const day = parseInt(mmdd.slice(2, 4), 10);
  if (month < 1 || month > 12) return false;
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && day === 29) return true;
  return day >= 1 && day <= daysInMonth[month - 1];
}

// In-memory store
const callResponses: Record<string, any> = {};

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const step = url.searchParams.get('step');
  const $insuranceName = url.searchParams.get('insuranceName') || 'the insurance';

  const body = await req.formData();
  const digits = body.get('Digits')?.toString();
  const callSid = body.get('CallSid')?.toString() || 'unknown';

  if (!callResponses[callSid]) callResponses[callSid] = {};

  const VoiceResponse = TwiML.VoiceResponse;
  const response = new VoiceResponse();

  switch (step) {
    case 'ppd-services':
      if (digits === '1' || digits === '0') {
        const providesCare = digits === '1';
        callResponses[callSid].providesPPD = providesCare;

        const gather = response.gather({
          numDigits: 1,
          action: `/api/gather?step=confirm-ppd&ppd=${digits}&insuranceName=${encodeURIComponent($insuranceName)}`,
          method: 'POST',
        });

        gather.say(
          `You indicated that you ${providesCare ? 'do' : 'do not'} provide care for post partum depression. Press 1 to confirm, or 0 to re-enter.`
        );
      } else {
        const gather = response.gather({
          numDigits: 1,
          action: `/api/gather?step=ppd-services&insuranceName=${encodeURIComponent($insuranceName)}`,
          method: 'POST',
        });

        gather.say('Invalid input. Press 1 for yes, or 0 for no.');
      }
      break;

    case 'confirm-ppd': {
      const ppd = url.searchParams.get('ppd');
      if (digits === '1') {
        if (ppd === '0') {
          response.say('Thank you for confirming. We appreciate your time. Goodbye.');
          response.hangup();
        } else {
          const gather = response.gather({
            numDigits: 1,
            action: `/api/gather?step=insurance&insuranceName=${encodeURIComponent($insuranceName)}`,
            method: 'POST',
          });

          gather.say(`Thank you. Press 1 if you accept ${$insuranceName}. Press 0 if you do not.`);
        }
      } else {
        const gather = response.gather({
          numDigits: 1,
          action: `/api/gather?step=ppd-services&insuranceName=${encodeURIComponent($insuranceName)}`,
          method: 'POST',
        });

        gather.say('Okay. Do you provide care for post partum depression? Press 1 for yes, or 0 for no.');
      }
      break;
    }

    case 'insurance':
      if (digits === '1' || digits === '0') {
        callResponses[callSid].insuranceAccepted = digits === '1';

        const insuranceAccepted = digits === '1' ? 'accepted' : 'not accepted';

        const gather = response.gather({
          numDigits: 1,
          action: `/api/gather?step=confirm-insurance&insurance=${digits}&insuranceName=${encodeURIComponent($insuranceName)}`,
          method: 'POST',
        });

        gather.say(`You indicated that you ${insuranceAccepted} ${$insuranceName}. Press 1 to confirm, or 0 to re-enter.`);
      } else {
        const gather = response.gather({
          numDigits: 1,
          action: `/api/gather?step=insurance&insuranceName=${encodeURIComponent($insuranceName)}`,
          method: 'POST',
        });

        gather.say(`Invalid input. Press 1 if you accept ${$insuranceName}. Press 0 if you do not.`);
      }
      break;

    case 'confirm-insurance': {
      const insurance = url.searchParams.get('insurance');

      if (digits === '1') {
        const gather = response.gather({
          numDigits: 4,
          action: `/api/gather?step=availability&insurance=${insurance}&insuranceName=${encodeURIComponent($insuranceName)}`,
          method: 'POST',
        });

        gather.say('Thank you. Please enter your soonest availability in MMDD format.');
      } else {
        const gather = response.gather({
          numDigits: 1,
          action: `/api/gather?step=insurance&insuranceName=${encodeURIComponent($insuranceName)}`,
          method: 'POST',
        });

        gather.say(`Okay. Press 1 if you accept ${$insuranceName}. Press 0 if you do not.`);
      }
      break;
    }

    case 'availability': {
      const insurance = url.searchParams.get('insurance');

      if (digits && isValidDateMMDD(digits)) {
        callResponses[callSid].availability = digits;
        const month = digits.slice(0, 2);
        const day = digits.slice(2, 4);

        const gather = response.gather({
          numDigits: 1,
          action: `/api/gather?step=confirm-date&insurance=${insurance}&date=${digits}&insuranceName=${encodeURIComponent($insuranceName)}`,
          method: 'POST',
        });

        gather.say(`You entered availability on ${month}/${day}. Press 1 to confirm, or 0 to re-enter.`);
      } else {
        const gather = response.gather({
          numDigits: 4,
          action: `/api/gather?step=availability&insurance=${url.searchParams.get('insurance')}&insuranceName=${encodeURIComponent($insuranceName)}`,
          method: 'POST',
        });

        gather.say('Invalid date. Please enter your availability in MMDD format.');
      }
      break;
    }

    case 'confirm-date': {
      const insurance = url.searchParams.get('insurance');
      const date = url.searchParams.get('date');

      if (digits === '1') {
        response.say(
          `Thank you. You indicated availability on ${date!.slice(
            0,
            2
          )}/${date!.slice(2, 4)} and insurance ${
            callResponses[callSid].insuranceAccepted ? $insuranceName : 'not accepted'
          }. Goodbye.`
        );
        response.hangup();

        console.log('Final provider response:', callResponses[callSid]);
      } else {
        const gather = response.gather({
          numDigits: 4,
          action: `/api/gather?step=availability&insurance=${insurance}&insuranceName=${encodeURIComponent($insuranceName)}`,
          method: 'POST',
        });

        gather.say('Okay. Please re-enter your availability in MMDD format.');
      }
      break;
    }

    default:
      response.say('An error occurred. Goodbye.');
      response.hangup();
      break;
  }

  return new NextResponse(response.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
