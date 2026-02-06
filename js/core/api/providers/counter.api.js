import { USERS } from "../../../models/user.js";
import { APIS } from "../config/apis.js";
import { get } from "../httpClient.js";

export function giveASlap(receiverName) {
    const { baseUrl } = APIS.slapCounters;
    return get(`${baseUrl}/${receiverName}-slap/up`);
}

/**
 * Fetches the slap count for all users.
 * @returns an object like { anthony: 5, antoine: 3 }
 */
export async function fetchSlapCount() {
  const { baseUrl } = APIS.slapCounters;

  const users = [USERS.anthony, USERS.antoine];

  const results = await Promise.all(
    users.map(async (user) => {
      try {
        const data = await get(`${baseUrl}/${user.username}-slap`);
        return [user.username, data.data.up_count];
      } catch (err) {
        return [user.username, 0];
      }
    })
  );
  return results;
}