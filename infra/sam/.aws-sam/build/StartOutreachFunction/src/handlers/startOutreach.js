import "dotenv/config";

export async function handler(event) {
  console.log("Lambda invoked");
  console.log(JSON.stringify(event, null, 2));

  return {
    statusCode: 200
  };
}
