
const M_SIZE_WIDTH = 25;
const S_SIZE_WIDTH = 10;

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

  logs: {
    fn(args) {
      if (!args || args.length === 0) {
        term.writeln('Usage: logs [list|open] <log_id>');
        return;
      }
      const sub = args[0].toLowerCase();
      if (sub === 'list') {

        const sortedLogs = [...window.logList].sort((a, b) => new Date(b.date) - new Date(a.date));
        term.writeln(
          pad('id', S_SIZE_WIDTH) +
          pad('creator', S_SIZE_WIDTH) +
          pad('date', M_SIZE_WIDTH)
        );
        term.writeln('-'.repeat(M_SIZE_WIDTH + S_SIZE_WIDTH + S_SIZE_WIDTH));
        sortedLogs
          .forEach(log => {
            term.writeln(
              pad(log.id, S_SIZE_WIDTH) +
              pad(log.creator, S_SIZE_WIDTH) +
              pad(log.date, M_SIZE_WIDTH)
            )
          });
      } else if (sub === 'open') {
        const id = args[1];

        if (!id) {
          term.writeln('Usage: logs open <log_id>');
          return;
        }

        const log = window.logList.find(f => f.id === id || String(f.id) === String(id));
        if (!log) {
          term.writeln(`Log not found: ${id}`);
          return;
        }
        if (log.creator !== auth.username && auth.role !== 'admin') {
          term.writeln(`You don't have permission to access this log.`);
          return;
        }
        term.writeln(`Opening log ${log.id} created by ${log.creator} on ${log.date} ...`);
        const text = atob(log.data);
        term.writeln(`--- Log number ${log.id} from ${log.creator} on ${log.date} ---`);
        text.split('\n').forEach(line => term.writeln(line));
        term.writeln(`--- End of log number ${log.id} ---`);
      }
    }
  },

  files: {
    fn(args) {
      if (!args || args.length === 0) {
        term.writeln('Usage: file [list|open] <filename> [password]');
        return;
      }

      const sub = args[0].toLowerCase();
      if (sub === 'list') {
        return new Promise(resolve => {
          withLoading(term, 'Loading files...', () => {
            const sorted = [...window.fileList].sort((a, b) => a.type.localeCompare(b.type));
            term.writeln(pad('File Name', 25) + pad('Type', 10) + pad('Status', 10));
            term.writeln('-'.repeat(45));
            sorted.forEach(f => {
              term.writeln(pad(f.name, 25) + pad(f.type, 10) + pad(f.password ? 'protected' : 'public', 10));
            });
            resolve();
          });
        });
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
      } else {
        term.writeln('Unknown subcommand. Use list or open.');
      }
    },
    desc: 'List and open available files'
  }
};

window.COMMANDS = COMMANDS;


window.executeCommand = async function (input) {
  const parts = input.trim().split(/\s+/);
  const cmd = parts.shift()?.toLowerCase();
  const args = parts;

  if (!cmd) return;

  if (!auth.commands.includes(cmd)) {
    term.writeln(`Unknown command: ${cmd}`);
    return;
  }

  const command = window.COMMANDS[cmd];
  if (!command) return;

  await command.fn(args);
};


