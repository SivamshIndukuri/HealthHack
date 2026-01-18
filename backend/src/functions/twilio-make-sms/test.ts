import { handler } from './handler'; // replace with actual filename

const testEvent = {
  body: JSON.stringify({
    body: 'Hello from Lambda test!',
    to: '+12019821188', // replace with a real number you can send to
  }),
};

const testContext = {}; // can be empty for most tests

handler(testEvent, testContext)
  .then((response) => {
    console.log('Lambda response:', response);
  })
  .catch((err) => {
    console.error('Error:', err);
  });
