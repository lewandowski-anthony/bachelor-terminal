import ICommand from '../../core/ICommand.js';

export default class ClearCommand extends ICommand {
  constructor(term) {
    super('clear', 'Clear terminal');
    this.term = term;
  }

  async execute() {
    this.term.clear();
  }
}
