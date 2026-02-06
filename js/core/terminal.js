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
    else if (cmdName === 'files') options = window.fileList.map(f => f.name);

    const lastArg = args[args.length - 1];
    return options.filter(o => o.startsWith(lastArg));
  }

  return [];
}

term.write(getPrompt());

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
      let passwordInputResponse = handleAuthPasswordInput(input, numberOfAttempts);
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
