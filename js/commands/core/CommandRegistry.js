import HelpCommand from '../system/help.command.js';
import LogsCommand from '../content/logs.command.js';
import BzBombCommand from '../fun/bzbomb.command.js';
import SuitUpCommand from '../fun/suitup.command.js';
import HintsCommand from '../content/hints.command.js';
import MediasCommand from '../content/medias.command.js';
import WhoAmICommand from '../system/whoami.command.js';
import AboutCommand from '../system/about.command.js';
import VersionCommand from '../system/version.command.js';
import LogoutCommand from '../system/logout.command.js';
import ClearCommand from '../system/clear.command.js';
import {USER_STATE} from '../../models/userState.js';


export default class CommandRegistry {
  constructor(term) {
    this.term = term;
    this.commands = {};
    [
        new HelpCommand(term, this),
        new LogsCommand(term),
        new BzBombCommand(term),
        new ClearCommand(term),
        new SuitUpCommand(term),
        new HintsCommand(term),
        new MediasCommand(term),
        new WhoAmICommand(term),
        new AboutCommand(term),
        new VersionCommand(term),
        new LogoutCommand(term),
    ].forEach(cmd => this.register(cmd));
  }

  register(command) {
    this.commands[command.name] = command;
  }

  get commandList() {
    return Object.values(this.commands);
  }

  async execute(input) {
    const parts = input.trim().split(/\s+/);
    const name = parts.shift()?.toLowerCase();
    const args = parts;

    if (!name) return;

    if (!USER_STATE.user.everyUserCommands.includes(name)) {
      this.term.writeln(`Unknown command: ${name}`);
      return;
    }

    const cmd = this.commands[name];
    if (!cmd) return;

    await cmd.execute(args);
  }

  get auth() {
    return window.auth;
  }
}
