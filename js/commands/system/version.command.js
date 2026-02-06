import ICommand from '../core/ICommand.js';

export default class VersionCommand extends ICommand {
  constructor(term) {
    super('version', 'Display terminal version');
    this.term = term;
  }

  async execute() {
    this.term.writeln('evg-terminal v1.0.0');
  }
}
