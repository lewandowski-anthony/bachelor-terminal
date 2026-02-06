let numberOfAttempts = 0;
const SERVER_NAME = 'evg-2026-server';
const PASSWORD_LINE = 'password:';

window.term = new Terminal({
  cursorBlink: true,
  cursorStyle: 'block',
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

// --- Command history
const history = [];
let historyIndex = -1;

// --- Tab detection
let lastTabTime = 0;
const DOUBLE_TAB_THRESHOLD = 400; // ms

// --- Helper: get autocomplete options
function getAutocompleteOptions(currentInput) {
  const parts = currentInput.trim().split(/\s+/);
  const cmdName = parts[0]?.toLowerCase();
  const args = parts.slice(1);

  const command = window.COMMANDS[cmdName];
  if (!command || args.length === 0) return [];

  if (args[0] === 'open' || args.length === 1) {
    let options = [];
    if (cmdName === 'logs') options = window.logList.map(l => String(l.id));
    else if (cmdName === 'medias') options = window.mediaList.map(f => f.name);
    else if (cmdName === 'files') options = window.fileList.map(f => f.name);

    const lastArg = args[args.length - 1];
    return options.filter(o => o.startsWith(lastArg));
  }

  return [];
}

term.write(window.promptText);

term.onKey(async e => {
  const event = e.domEvent;
  const key = e.key;

  if (event.key === 'Enter') {
    term.write('\r\n');

    if (auth.state === 'shell') {
      if (input.trim()) history.push(input);
      historyIndex = history.length;

      await window.executeCommand(input);
    } 
    else if (auth.state === 'password') {
      numberOfAttempts = handleAuthPasswordInput(input, numberOfAttempts);
    }
    else {
      handleAuthLoginInput(input);
    }

    window.promptText = auth.state === 'login'
      ? 'login: '
      : auth.state === 'password'
      ? `${PASSWORD_LINE}`
      : `${auth.user.displayName}@${SERVER_NAME}:~$ `;

    term.write(window.promptText);
    input = '';
  }

  else if (event.key === 'Backspace') {
    if (input.length > 0) {
      input = input.slice(0, -1);
      term.write('\b \b');
    }
  }

  else if (event.key === 'ArrowUp') {
    if (history.length === 0) return;
    historyIndex = Math.max(0, historyIndex - 1);
    term.write('\x1b[2K\r' + window.promptText + history[historyIndex]);
    input = history[historyIndex];
  }

  else if (event.key === 'ArrowDown') {
    if (history.length === 0) return;
    historyIndex = Math.min(history.length, historyIndex + 1);
    const nextInput = historyIndex < history.length ? history[historyIndex] : '';
    term.write('\x1b[2K\r' + window.promptText + nextInput);
    input = nextInput;
  }

  else if (event.key === 'Tab') {
    const now = Date.now();
    const options = getAutocompleteOptions(input);

    if (options.length === 1) {
      const parts = input.trim().split(/\s+/);
      parts[parts.length - 1] = options[0];
      input = parts.join(' ') + ' ';
      term.write('\x1b[2K\r' + window.promptText + input);
    } 
    else if (options.length > 1) {
      if (now - lastTabTime < DOUBLE_TAB_THRESHOLD) {
        term.write('\r\n' + options.join('  ') + '\r\n' + window.promptText + input);
      }
    }

    lastTabTime = now;
    event.preventDefault();
  }

  else if (!event.ctrlKey && !event.metaKey && key.length === 1) {
    input += key;
    term.write(key);
  }
});

window.addEventListener('resize', () => fitAddon.fit());
