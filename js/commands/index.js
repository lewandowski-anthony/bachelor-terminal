import CommandRegistry from './core/CommandRegistry.js';

import HelpCommand from './system/help.command.js';
import LogsCommand from './content/logs.command.js';
import BzBombCommand from './fun/bzbomb.command.js';
import SuitUpCommand from './fun/suitup.command.js';
import HintsCommand from './content/hints.command.js';
import MediasCommand from './content/medias.command.js';
import WhoAmICommand from './system/whoami.command.js';
import AboutCommand from './system/about.command.js';
import VersionCommand from './system/version.command.js';
import LogoutCommand from './system/logout.command.js';

const registry = new CommandRegistry(term);

[
    new HelpCommand(term, registry),
    new LogsCommand(term),
    new BzBombCommand(term),
    new SuitUpCommand(term),
    new HintsCommand(term),
    new MediasCommand(term),
    new WhoAmICommand(term),
    new AboutCommand(term),
    new VersionCommand(term),
    new LogoutCommand(term),
].forEach(cmd => registry.register(cmd));

window.executeCommand = input => registry.execute(input);
