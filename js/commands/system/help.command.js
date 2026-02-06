import ICommand from '../core/ICommand.js';

export default class HelpCommand extends ICommand {
  constructor(term, registry) {
    super('help', 'List all available commands');
    this.term = term;
    this.registry = registry;
  }

  async execute() {
    this.term.writeln('Available commands:');
    this.auth.user.commands.forEach(name => {
      const cmd = this.registry.commands[name];
      this.term.writeln(`- ${name} : ${cmd?.description || ''}`);
    });
  }
}
