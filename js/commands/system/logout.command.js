import ICommand from '../core/ICommand.js';

export default class LogoutCommand extends ICommand {
  constructor(term) {
    super('logout', 'Log out from the terminal');
    this.term = term;
  }

  async execute() {
    window.auth.reset();
    this.term.writeln('Logged out.');
  }
}
