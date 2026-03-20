import { env } from "../env.js";

export async function getEventMatches(eventKey: string) {
  const url = `${env.NEXUS_URL}/event/${eventKey}/matches`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Nexus error: ${res.status}`);
  }
  return res.json();
}
