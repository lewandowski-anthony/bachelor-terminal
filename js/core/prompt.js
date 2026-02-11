import { USER_STATE } from "../models/userState.js";

export function getPrompt() {
  if (USER_STATE.state === 'login') return 'login: ';
  if (USER_STATE.state === 'password') return 'password: ';
  return `${USER_STATE.user.displayName}@bachelor-server:~$ `;
}
