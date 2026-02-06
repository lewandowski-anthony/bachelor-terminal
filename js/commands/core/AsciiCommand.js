import ICommand from './ICommand.js';

class AsciiCommand extends ICommand {
  constructor(name, description, term) {
    super(name, description);
    this.term = term;
  }

  async displayAscii(lines, speed = 120) {
    for (const line of lines) {
      this.term.writeln(line);
      await new Promise(r => setTimeout(r, speed));
    }
  }
}

window.AsciiCommand = AsciiCommand;
