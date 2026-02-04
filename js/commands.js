const COMMANDS = {
  help: {
    fn() {
      term.writeln('Available commands:');
      auth.commands.forEach(cmd => {
        const description = window.COMMANDS[cmd]?.desc || '';
        term.writeln(`- ${cmd} : ${description}`);
      });
    },
    desc: 'List all the available commands'
  },

  about: {
    fn() {
      term.writeln('Web terminal with custom users 😎');
    },
    desc: 'Information about this terminal'
  },

  clear: {
    fn() {
      term.clear();
      term.write(promptText);
    },
    desc: 'Clear the screen'
  },

  bzbomb: {
    fn() {
      term.writeln('💣 BOUNZI BOMB ACTIVATED 💣');
      const weddingDate = new Date(2026, 8, 15, 12, 0, 0);
      weddingCountdown(term, promptText, weddingDate);
    },
    desc: 'Activate the BZBOMB countdown'
  },

  slap: {
    fn() {
      term.writeln('Lucas\'s heritage has been slapped!');
      const weddingDate = new Date(2026, 9, 19, 12, 0, 0);
      weddingCountdown(term, promptText, weddingDate);
    },
    desc: 'Virtually slap Lucas\'s heritage'
  },

  users: {
    fn() {
      term.writeln('List of available users:');
      Object.keys(window.USERS).forEach(user => {
        if (user !== 'common') term.writeln(`- ${user}`);
      });
    },
    desc: 'List all users of the terminal'
  },
  logout: {
    fn() {
      auth.state = 'login';
      auth.username = '';
      auth.commands = [];
      promptText = 'login: ';
      term.writeln('\nLogged out.\n');
    },
    desc: 'Log out the user'
  },
  files: {
    fn(args) {
      if (!args || args.length === 0) {
        term.writeln('Usage: file [list|open] <filename> [password]');
        return;
      }

      const sub = args[0].toLowerCase();
      if (sub === 'list') {
        const sorted = [...window.fileList].sort((a, b) => a.type.localeCompare(b.type));

        const nameWidth = 25;
        const typeWidth = 10;
        const statusWidth = 10;

        term.writeln(
          pad('File Name', nameWidth) +
          pad('Type', typeWidth) +
          pad('Status', statusWidth)
        );
        term.writeln('-'.repeat(nameWidth + typeWidth + statusWidth));

        sorted.forEach(f => {
          term.writeln(
            pad(f.name, nameWidth) +
            pad(f.type, typeWidth) +
            pad(f.password ? 'protected' : 'public', statusWidth)
          );
        });

        function pad(str, width) {
          str = str || '';
          if (str.length > width - 1) return str.slice(0, width - 1) + '…';
          return str + ' '.repeat(width - str.length);
        }
      } else if (sub === 'open') {
        const name = args[1];
        const pwd = args[2] || null;

        if (!name) {
          term.writeln('Usage: file open <filename> [password]');
          return;
        }

        const file = window.fileList.find(f => f.name.toLowerCase() === name.toLowerCase());
        if (!file) {
          term.writeln(`File not found: ${name}`);
          return;
        }

        if (file.password && atob(file.password).toLowerCase() !== String(pwd).toLowerCase()) {
          term.writeln('Wrong password!');
          return;
        }

        term.writeln(`Opening ${file.name} (${file.type}) ...`);

        if (file.type === 'video') {
          window.open(atob(file.data), '_blank');
        } else if (file.type === 'image') {
          const imgWindow = window.open('');
          imgWindow.document.write(`<img src="${atob(file.data)}" style="max-width:100%;height:auto;">`);
        } 
        else if (file.type === 'text') {
          const text = atob(file.data);
          term.writeln('--- ' + file.name + ' ---');
          text.split('\n').forEach(line => term.writeln(line));
          term.writeln('--- End of ' + file.name + ' ---');
        }
      } else {
        term.writeln('Unknown subcommand. Use list or open.');
      }
    },
    desc: 'List and open available files'
  }
};

window.COMMANDS = COMMANDS;


window.executeCommand = function(input) {
  const parts = input.trim().split(/\s+/);
  const cmd = parts.shift().toLowerCase();
  const args = parts;

  if (!cmd) return;

  if (!auth.commands.includes(cmd)) {
    term.writeln(`Unknown command: ${cmd}`);
    return;
  }

  window.COMMANDS[cmd]?.fn(args);
};

