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

class AsciiCommand extends ICommand {
  constructor(name, description, term) {
    super(name, description);
    this.term = term;
  }

  /**
   * Display an ASCII art progressively, line by line, centered in the terminal.
   * The startingText remains visible while animating the ASCII art.
   * @param {string[]} asciiLines - The lines of the ASCII Art
   * @param {object} options - {speed: ms between frames, startingText, finalText}
   */
  async displayAsciiArt(asciiLines, options = {}) {
    const cols = this.term.cols;
    const rows = this.term.rows;
    const speed = options.speed || 150;
    const startingText = options.startingText || null;
    const finalText = options.finalText || null;

    // Prepare starting text lines
    const startingLines = startingText ? [startingText] : [];

    // Generate progressive frames
    const frames = [];
    for (let i = 1; i <= asciiLines.length; i++) {
      frames.push(asciiLines.slice(0, i));
    }

    // Center horizontally
    const centerFrame = (frame) =>
      frame.map(line => {
        const padding = Math.floor((cols - line.length) / 2);
        return ' '.repeat(Math.max(padding, 0)) + line;
      });

    // Display each frame
    for (let i = 0; i < frames.length; i++) {
      this.term.clear();

      // Display starting text at the top
      startingLines.forEach(line => {
        const padding = Math.floor((cols - line.length) / 2);
        this.term.writeln(' '.repeat(Math.max(padding, 0)) + line);
      });

      // Center ASCII Art vertically after starting text
      const frame = centerFrame(frames[i]);
      const emptyLines = Math.floor((rows - frame.length - startingLines.length) / 2);
      for (let j = 0; j < emptyLines; j++) this.term.writeln('');
      frame.forEach(line => this.term.writeln(line));

      await new Promise(resolve => setTimeout(resolve, speed));
    }

    // Display final text
    if (finalText) {
      const padding = Math.floor((cols - finalText.length) / 2);
      this.term.writeln('\r\n' + ' '.repeat(Math.max(padding, 0)) + finalText + '\r\n');
    }
  }
}

class SuitUpCommand extends AsciiCommand {
  constructor(term) {
    super('suitup', 'Get the best suitup tips for the wedding');
    this.term = term;
  }

  async execute() {
    const legendary = [
       '                     ........                                                                ',    
       '             .::....:::::.                             ...                                   ',
       '           .^^^^:.......::                          :~!777!~^.                               ',
       '           ^^^^^::::....:                          ^???????777!~:.                           ',
       '          :^^^!JJJJJ??!:.                         :?!!~~!!!7?77777~:                         ',
       '         :^^^^7GPPPPPP?:.                        :!~^^^^^^^~7?777777~:                       ',
       '         ^^^^^~JYPPPPY:                         .~^^^^^^^^^^^7??777777.                      ',
       '         .~~~~~^~~!~^.                          ~~~^^~~~^^^^^7??????7?~                      ',
       '          ^~~~~~~:.                            .^^^^^^~~~^^^^!????????7                      ',
       '         .~~~~~~:                              :^^^^^^^^^^^^^~????????!                      ',
       '       ^?~~~~~~7^                             .^^^^^^^^^^^^^^!??7777??:                      ',
       '      5#?~~!7?JY.                             .^^^^^^^^^^^^^^~~~^^^7?^                       ',
       '    :P@5~7JY555J                              .^^^^^^^^^^^^^^^^^^~77:                        ',
       '    7GPYY5555557                              :^^^^^^^^^^^^^^~~!77~                          ',
       '    ?5Y55555555^                              .:^^^^^^^^^^^~~~7?~.                           ',
       '   :Y5555555555~                                .^~~~~~~~~~~~~~.                             ',
       '   J55555555555~                :7JJJ?77!~^:.. .^~~~~~~~~~~~~~^.                             ',
       '  ^555555555555^               !Y5555555555YYJJJ~~~~~~~~~~~~~~~?~                            ',
       '  !555555555555?:::.. ...:^~??J55555555YYYYJJJYJ5Y!~~~~~~~~~~~~JY?~.                         ',
       '  !5555555555555555YJJYYYY555555555555YJJJJJJJJ5&B7!~~!75GJ~~~!JJYYJ?7~:                     ',
       '  755555555555555555555555555555555555YJJJJJJJ?75#P7!7P#&#G?~~?JJJJJYY5YJ7^.                 ',
       '  ^555555555555555555555555555555555555YJJJJJJ7!!?BGPGG5J?!!!7JJJJJJYYY5555YJ?!:             ',
       '   :!JY5555555555555555555555555555555YJJJJJJ?!!!!P#Y7!!!!!!7JJJJJJJYYY555555555Y^           ',
       '      .^!?JY55555555555555555555555555YJJJJJJ!!!7P##?!!!!!!!?JJJJJJJJJY5555555555!           ',
       '           .:^~7?JYY555555555555555555YJJJJJ77!?B&#&J!!!!!!7JJJJJJJJYY55555555555~           ',
       '                  ..^~!7?JYY5555555555YJJJJ?!77B&###?!!!!!7JJJJJJJJY5555555555555~           ',
       '                           !5555555555YJJJJ7!!P&##&G!!!!!!?JJJJJJJY55555555555555J.          ',
       '                           75555555555YJJJ7!!?####&Y!!!!!7JJJJJJJY5555555555555555:          ',
       '                          .Y5555555555YJJ?!!!5&####7!!!!7JJJJJJYY55555555555555555~          ',
       '                          7555555555555YJ7777#&&&&B77777?YYYYYY5555555555555555555Y.         ',
       '                         .7777777777777!!~~^75YYY5?^^^^^!!!!!7777777777777777777777:         ',
    '                                   .7777~     .7.    !777~ .7.   !^                              ',
    '                                   ?&^:^YG:   5&5   ^@!.^P5 YB. JG:                              ',
    '                                   ?#    B5  ?G.B?  ^&^ .PP  JGJP.                               ',
    '                                   ?#.   GP ^&Y!Y&^ ^&PBJ~    5#.                                ',
    '                                   ?&. .7#^.#?.:.JB.^@^7P7.   YB                                 ',
    '                                   ^5JJJJ: !Y     5!:5: :Y?   7Y                                 ',
    ]
    await this.displayAsciiArt(legendary, {
      speed: 150,
      startingText: 'It is gonna be LEGEND- wait for it... !',
      finalText: 'LEGENDARY'
    });
  }
}

class BzBombCommand extends AsciiCommand {
  constructor(term) {
    super('bzbomb', 'Activate the bounzi bomb');
    this.term = term;
  }

  async execute() {
    const explosion = [
      '                  .               ',
      '                 .                ',
      '                 .       :       ',
      '                 :      .        ',
      '        :..   :  : :  .          ',
      '           ..  ; :: .            ',
      '              ... .. :..         ',
      '             ::: :...            ',
      '         ::.:.:...;; .....       ',
      '      :..     .;.. :;     ..     ',
      '            . :. .  ;.           ',
      '             .: ;;: ;.           ',
      '            :; .BRRRV;           ',
      '               YB BMMMBR         ',
      '              ;BVIMMMMMt         ',
      '        .=YRBBBMMMMMMMB          ',
      '      =RMMMMMMMMMMMMMM;          ',
      '    ;BMMR=VMMMMMMMMMMMV.         ',
      '   tMMR::VMMMMMMMMMMMMMB:        ',
      '  tMMt ;BMMMMMMMMMMMMMMMB.       ',
      ' ;MMY ;MMMMMMMMMMMMMMMMMMV       ',
      ' XMB .BMMMMMMMMMMMMMMMMMMM:      ',
      ' BMI +MMMMMMMMMMMMMMMMMMMMi      ',
      ' .MM= XMMMMMMMMMMMMMMMMMMMMY     ',
      ' BMt YMMMMMMMMMMMMMMMMMMMMi      ',
      ' VMB +MMMMMMMMMMMMMMMMMMMM:      ',
      ' ;MM+ BMMMMMMMMMMMMMMMMMMR       ',
      '  tMBVBMMMMMMMMMMMMMMMMMB.       ',
      '   tMMMMMMMMMMMMMMMMMMMB:        ',
      '    ;BMMMMMMMMMMMMMMMMY          ',
      '      +BMMMMMMMMMMMBY:           ',
      '        :+YRBBBRVt;              '
    ];

    await this.displayAsciiArt(explosion, {
      speed: 150,
      finalText: '💥 RUN ! THE BOUNZI BOMB IS ACTIVATED 💥'
    });
  }
}


class AboutCommand extends ICommand {
  constructor(term) {
    super('about', 'Learn more about this terminal');
    this.term = term;
  }

  async execute() {
    this.term.writeln('This terminal contains every information about Lucas and Benjamin wedding !');
    this.term.writeln('It is where the bestmen and the witnesses can find all the necessary information about the event, such as schedules, locations, and more.');
    this.term.writeln('The bachelor countdown events informations are also hidden in this terminal, but you will have to find it by yourself !');
    this.term.writeln('The project demonstrates the use of JavaScript, HTML, and CSS to create an interactive and engaging user experience.');
  }
}

class LogoutCommand extends ICommand {
  constructor(term) {
    super('logout', 'Logout from the terminal');
    this.term = term;
  }

  async execute() {
    window.auth = new Auth();
    this.term.writeln('You have been logged out.');
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
      const description = cmd?.description || 'This command has not been implemented yet.';
      this.term.writeln(`- ${cmdName} : ${description}`);
    });
  }
}

class ClearCommand extends ICommand {
  constructor(term) {
    super('clear', 'Clear the screen');
    this.term = term;
  }

  async execute() {
    this.term.clear();
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
commandRegistry.register(new ClearCommand(term));
commandRegistry.register(new UsersCommand(term));
commandRegistry.register(new BzBombCommand(term));
commandRegistry.register(new SuitUpCommand(term));
commandRegistry.register(new LogsCommand(term));
commandRegistry.register(new MediasCommand(term));
commandRegistry.register(new AboutCommand(term));
commandRegistry.register(new LogoutCommand(term, { value: promptText }));

window.COMMANDS = commandRegistry.commands;
window.executeCommand = input => commandRegistry.execute(input);
