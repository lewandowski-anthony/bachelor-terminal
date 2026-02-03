window.term = new Terminal({
  cursorBlink: true,
  theme: {
    background: '#000',
    foreground: '#00ff00'
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
  const ev = e.domEvent;
  const key = e.key;

  if (ev.key === 'Enter') {
    term.write('\r\n');

    if (auth.state === 'shell') {
      window.executeCommand(input);
      term.write('\r\n' + promptText);
    } else {
      handleAuthInput(input);
      if (auth.state === 'shell') {
        term.write('\r\n' + promptText);
      }
    }

    input = '';
  }

  else if (ev.key === 'Backspace') {
    if (input.length > 0) {
      input = input.slice(0, -1);
      term.write('\b \b');
    }
  }

  else if (!ev.ctrlKey && !ev.metaKey && ev.key.length === 1) {
    input += key;
    term.write(key);
  }
});

window.addEventListener('resize', () => fitAddon.fit());
