import { handleAuthLoginInput, handleAuthPasswordInput } from "./auth.js";
import CommandRegistry from "../commands/core/CommandRegistry.js";
import { USER_STATE } from "../models/userState.js";
import { getPrompt } from "./prompt.js";
import { mediaList } from "../data/medias.js";
import { logList } from "../data/logs.js";
import { hintList } from "../data/hints.js";

let numberOfAttempts = 0;

const term = new Terminal({
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

const commandRegistry = new CommandRegistry(term);

const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById('terminal'));
fitAddon.fit();

let input = '';

// --- Command history
const history = [];
let historyIndex = -1;

// --- Tab detection
let lastTabTime = 0;
const DOUBLE_TAB_THRESHOLD = 400; // ms

// --- Maintenance settings
const unlockDate = new Date('2026-02-28T00:00:00');
let maintenanceInterval = null;
let maintenanceBypassed = true;

// --- Display maintenance message if needed
function showMaintenanceMessage() {
  term.clear();

  const now = new Date();
  let diff = unlockDate - now;

  if (diff <= 0) {
    clearInterval(maintenanceInterval);
    term.clear();
    initTerminal();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const message = `Maintenance in progress\nTime remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`;

  const cols = term.cols;
  const rows = term.rows;

  const lines = message.split('\n');
  const verticalPadding = Math.floor((rows - lines.length) / 2);

  term.write('\x1b[2J'); // Clear the screen

  // Vertical padding
  for (let i = 0; i < verticalPadding; i++) term.writeln('');

  // Center each line
  lines.forEach(line => {
    const padding = ' '.repeat(Math.floor((cols - line.length) / 2));
    term.writeln(padding + line);
  });
}

// --- Check if maintenance is ongoing
if (new Date() < unlockDate && !maintenanceBypassed) {

  term.onKey(e => e.domEvent.preventDefault());
  maintenanceInterval = setInterval(showMaintenanceMessage, 1000);
  showMaintenanceMessage();
} else {
  initTerminal();
}

window.addEventListener('keydown', (e) => {
  // Ctrl + Shift + M
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') {
    maintenanceBypassed = true;

    clearInterval(maintenanceInterval);
    term.clear();
    initTerminal();

    console.log('🚨 Maintenance bypass activé');
  }
});


// --- Initialization function for the normal terminal
function initTerminal() {
  term.write(getPrompt());

  // --- Helper: get autocomplete options
  function getAutocompleteOptions(currentInput) {
    const parts = currentInput.trim().split(/\s+/);
    const cmdName = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    const command = commandRegistry.commands[cmdName];
    if (!command || args.length === 0) return [];

    if (args[0] === 'open' || args.length === 1) {
      let options = [];
      if (cmdName === 'logs') options = logList.map(l => String(l.id));
      else if (cmdName === 'medias') options = mediaList.map(f => f.name);
      else if (cmdName === 'files') options = window.fileList?.map(f => f.name) || [];

      const lastArg = args[args.length - 1];
      return options.filter(o => o.startsWith(lastArg));
    }

    return [];
  }

  term.onKey(async e => {
    const event = e.domEvent;
    const key = e.key;

    if (event.key === 'Enter') {
      term.writeln('');

      if (USER_STATE.state === 'shell') {
        if (input.trim()) history.push(input);
        historyIndex = history.length;

        await commandRegistry.execute(input);
      }
      else if (USER_STATE.state === 'password') {
        const passwordInputResponse = handleAuthPasswordInput(input, numberOfAttempts);
        numberOfAttempts = passwordInputResponse.numberOfAttempts;
        term.writeln(passwordInputResponse.message + '\r\n');
      }
      else {
        term.writeln(handleAuthLoginInput(input));
      }
      term.write(getPrompt());
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
      term.write('\x1b[2K\r' + getPrompt() + history[historyIndex]);
      input = history[historyIndex];
    }

    else if (event.key === 'ArrowDown') {
      if (history.length === 0) return;
      historyIndex = Math.min(history.length, historyIndex + 1);
      const nextInput = historyIndex < history.length ? history[historyIndex] : '';
      term.write('\x1b[2K\r' + getPrompt() + nextInput);
      input = nextInput;
    }

    else if (event.key === 'Tab') {
      const now = Date.now();
      const options = getAutocompleteOptions(input);

      if (options.length === 1) {
        const parts = input.trim().split(/\s+/);
        parts[parts.length - 1] = options[0];
        input = parts.join(' ') + ' ';
        term.write('\x1b[2K\r' + getPrompt() + input);
      }
      else if (options.length > 1) {
        if (now - lastTabTime < DOUBLE_TAB_THRESHOLD) {
          term.write('\r\n' + options.join('  ') + '\r\n' + getPrompt() + input);
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
}
