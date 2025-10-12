import { getAllSessions } from "@/lib/sessionStore.js";

export async function GET() {
  const sessions = getAllSessions();
  return Response.json(sessions);
}
