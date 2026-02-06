import ICommand from '../../core/ICommand.js';

export default class WhoAmICommand extends ICommand {
  constructor(term) {
    super('whoami', 'Display current user');
    this.term = term;
  }

  async execute() {
    this.term.writeln(`Current user: ${window.auth.getCurrentUser()}`);
  }
}
