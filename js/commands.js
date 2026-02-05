// Constants
const M_SIZE_WIDTH = 25;
const S_SIZE_WIDTH = 10;

class ICommand {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
  async execute(args) {
    throw new Error('Execute method not implemented');
  }

  get auth() {
    return window.auth;
  }
}

class CommandRegistry {
  constructor(term) {
    this.commands = {};
    this.term = term;
  }

  get auth() {
    return window.auth;
  }

  register(command) {
    this.commands[command.name] = command;
  }

  async execute(input) {
    const parts = input.trim().split(/\s+/);
    const cmdName = parts.shift()?.toLowerCase();
    const args = parts;

    if (!cmdName) return;

    if (!this.auth.user.commands.includes(cmdName)) {
      this.term.writeln(`Unknown command: ${cmdName}`);
      return;
    }

    const command = this.commands[cmdName];
    if (!command) return;

    await command.execute(args);
  }

  listCommands() {
    return Object.values(this.commands);
  }
}

function pad(str, size) {
  return String(str).padEnd(size, ' ');
}

class AbstractFileManagementCommand extends ICommand {
  constructor(name, description, term) {
    super(name, description);
    this.term = term;
  }

  async execute(args) {
    if (!args || args.length === 0) return this.usage();

    const sub = args[0].toLowerCase();
    if (sub === 'list') return this.list();
    if (sub === 'open') return this.open(...args.slice(1));

    this.term.writeln(`Unknown subcommand. Use list or open.`);
  }

  usage() { throw new Error('usage() not implemented'); }
  list() { throw new Error('list() not implemented'); }
  open() { throw new Error('open() not implemented'); }
}


class LogsCommand extends AbstractFileManagementCommand {
  constructor(term) {
    super('logs', 'List and open logs', term);
  }

  usage() {
    this.term.writeln('Usage: logs [list|open] <log_id>');
  }

  list() {
    const sortedLogs = [...window.logList].sort((a, b) => new Date(b.date) - new Date(a.date));

    this.term.writeln(
      pad('id', S_SIZE_WIDTH) +
      pad('creator', S_SIZE_WIDTH) +
      pad('date', M_SIZE_WIDTH)
    );
    this.term.writeln('-'.repeat(M_SIZE_WIDTH + 2 * S_SIZE_WIDTH));

    sortedLogs.forEach(log => {
      this.term.writeln(
        pad(log.id, S_SIZE_WIDTH) +
        pad(log.creator, S_SIZE_WIDTH) +
        pad(log.date, M_SIZE_WIDTH)
      );
    });
  }

  open(id) {
    if (!id) return this.usage();

    const log = window.logList.find(f => String(f.id) === String(id));
    if (!log) return this.term.writeln(`Log not found: ${id}`);

    if (log.creator !== this.auth.user.username && this.auth.user.role !== 'admin') {
      return this.term.writeln(`You don't have permission to access this log.`);
    }

    this.term.writeln(`Opening log ${log.id} created by ${log.creator} on ${log.date} ...`);
    const text = atob(log.data);

    this.term.writeln(`--- Log number ${log.id} from ${log.creator} on ${log.date} ---`);
    text.split('\n').forEach(line => this.term.writeln(line));
    this.term.writeln(`--- End of log number ${log.id} ---`);
  }
}

class MediasCommand extends AbstractFileManagementCommand {
  constructor(term) {
    super('medias', 'List and open available medias', term);
  }

  usage() {
    this.term.writeln('Usage: medias [list|open] <filename> [password]');
  }

  list() {
    const sorted = [...window.mediaList].sort((a, b) => a.type.localeCompare(b.type));

    this.term.writeln(pad('Media Name', 25) + pad('Type', 10) + pad('Status', 10));
    this.term.writeln('-'.repeat(45));

    sorted.forEach(f => {
      this.term.writeln(
        pad(f.name, 25) +
        pad(f.type, 10) +
        pad(f.password ? 'protected' : 'public', 10)
      );
    });
  }

  open(name, pwd) {
    if (!name) return this.usage();

    const media = window.mediaList.find(f => f.name.toLowerCase() === name.toLowerCase());
    if (!media) return this.term.writeln(`Media not found: ${name}`);

    if (media.password && atob(media.password).toLowerCase() !== String(pwd || '').toLowerCase()) {
      return this.term.writeln('Wrong password!');
    }

    this.term.writeln(`Opening ${media.name} (${media.type}) ...`);

    if (media.type === 'video') {
      window.open(atob(media.data), '_blank');
    } else if (media.type === 'image') {
      const imgWindow = window.open('');
      imgWindow.document.write(`<img src="${atob(media.data)}" style="max-width:100%;height:auto;">`);
    } else {
      const text = atob(media.data);
      this.term.writeln(`--- ${media.name} content ---`);
      text.split('\n').forEach(line => this.term.writeln(line));
      this.term.writeln(`--- End of ${media.name} ---`);
    }
  }
}


class BzBombCommand extends ICommand {
  constructor(term) {
    super('bzbomb', 'Activate the bounzi bomb');
    this.term = term;
  }

  async execute() {
    this.term.writeln("BOUNZI BOMB ACTIVATED !");
    const bomb = [
      '     _ ._  _ , _ ._',
      '   (_\'( `  )_  .__)',
      ' ( (  (    )   `)  )_)',
      '(_\'__(_   (_ . _) _) ,__)',
      '   ( ( (  ) _`( )_` )  )',
      '  (__(_(._.)_)(_)_) ,__)',
      '     `~~`\\\'`~~`',
      '          -BOOM-'
    ];
    bomb.forEach(line => this.term.writeln(line));
  }
}

class HelpCommand extends ICommand {
  constructor(term, registry) {
    super('help', 'List all the available commands');
    this.term = term;
    this.registry = registry;
  }

  async execute() {
    this.term.writeln('Available commands:');
    this.auth.user.commands.forEach(cmdName => {
      const cmd = this.registry.commands[cmdName];
      const description = cmd?.description || '';
      this.term.writeln(`- ${cmdName} : ${description}`);
    });
  }
}

class ClearCommand extends ICommand {
  constructor(term, promptTextRef) {
    super('clear', 'Clear the screen');
    this.term = term;
    this.promptTextRef = promptTextRef;
  }

  async execute() {
    this.term.clear();
    this.term.write(this.promptTextRef.value);
  }
}

class UsersCommand extends ICommand {
  constructor(term) {
    super('users', 'List all users of the terminal');
    this.term = term;
  }

  async execute() {
    this.term.writeln('List of available users:');
    Object.keys(window.USERS).forEach(user => {
      if (user !== 'common') this.term.writeln(`- ${user}`);
    });
  }
}

const commandRegistry = new CommandRegistry(term, window.auth);

//-- Register usable commands 
commandRegistry.register(new HelpCommand(term, commandRegistry));
commandRegistry.register(new ClearCommand(term, { value: promptText }));
commandRegistry.register(new UsersCommand(term));
commandRegistry.register(new BzBombCommand(term));
commandRegistry.register(new LogsCommand(term));
commandRegistry.register(new MediasCommand(term));

window.COMMANDS = commandRegistry.commands;
window.executeCommand = input => commandRegistry.execute(input);
