
let numberOfAttempts = 0;

const SERVER_NAME = 'evg-2026-server';
const PASSWORD_LINE = 'password:';

window.term = new Terminal({
  cursorBlink: true,
  cursorStyle: 'block',
  cursorBlink: true,
  fontFamily: '"Courier New", monospace',
  fontSize: 15,
  theme: {
    background: '#000000',
    foreground: '#00ff00',
    cursor: '#00ff00'
  }
});

const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById('terminal'));
fitAddon.fit();

window.promptText = 'login: ';
let input = '';

term.write(promptText);

term.onKey(e => {
  const event = e.domEvent;
  const key = e.key;

  if (event.key === 'Enter') {
    term.write('\r\n');

    if (auth.state === 'shell') {
      window.executeCommand(input);
    } 
    else if (auth.state === 'password') {
      numberOfAttempts = handleAuthPasswordInput(input, numberOfAttempts);
    }
    else {
      handleAuthLoginInput(input);
      if (auth.state === 'shell') {
      }
    }
    window.promptText = auth.state === 'login' ? 'login: ' : auth.state === 'password' ? `${PASSWORD_LINE}` : `${auth.username}@${SERVER_NAME}:~$ `;
    term.write(promptText);
    input = '';
  }

  else if (event.key === 'Backspace') {
    if (input.length > 0) {
      input = input.slice(0, -1);
      term.write('\b \b');
    }
  }

  else if (!event.ctrlKey && !event.metaKey && event.key.length === 1) {
    input += key;
    term.write(key);
  }
});

window.addEventListener('resize', () => fitAddon.fit());
