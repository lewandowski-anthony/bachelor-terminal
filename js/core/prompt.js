export function getPrompt() {
  if (state.auth.state === 'login') return 'login: ';
  if (state.auth.state === 'password') return 'password: ';
  return `${state.auth.user}@server:~$ `;
}
