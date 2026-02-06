import ICommand from '../core/ICommand.js';
import { USER_STATE } from '../../models/userState.js';

export default class LogoutCommand extends ICommand {
  constructor(term) {
    super('logout', 'Log out from the terminal');
    this.term = term;
  }

  async execute() {
    USER_STATE.reset();
    this.term.writeln('Logged out.');
  }
}
