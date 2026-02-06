import ICommand from './ICommand.js';

export default class AbstractListOpenCommand extends ICommand {
  constructor(name, description, term) {
    super(name, description);
    this.term = term;
  }

  async execute(args) {
    if (!args?.length) return this.usage();

    const sub = args[0];
    if (sub === 'list') return this.list();
    if (sub === 'open') return this.open(...args.slice(1));

    this.term.writeln('Unknown subcommand');
  }

  usage() {}
  list() {}
  open() {}
}
