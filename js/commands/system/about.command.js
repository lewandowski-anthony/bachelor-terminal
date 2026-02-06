import ICommand from '../core/ICommand.js';

export default class AboutCommand extends ICommand {
  constructor(term) {
    super('about', 'About this terminal');
    this.term = term;
  }

  async execute() {
    this.term.writeln('EVG 2026 Terminal');
    this.term.writeln('Private terminal for wedding-related informations.');
  }
}
