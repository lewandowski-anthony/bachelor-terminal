import AbstractListOpenCommand from '../core/AbstractListOpenCommand.js';
import { renderTable } from '../utils/table.js';
import { hintList } from '../../data/hints.js';

export default class HintsCommand extends AbstractListOpenCommand {
  constructor(term) {
    super('hints', 'List and open hints', term);
  }

  list() {
    const hints = [...hintList].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const headers = ['Id', 'Title'];
    renderTable(this.term, headers, hints);
  }

  open(id) {
    this.term.writeln(`============ Opening hint with id: ${id} ============`);
    const hint = hintList.find(l => String(l.id) === String(id));
    if (!hint) return this.term.writeln('Hint not found');
    hint.data.split('\n').forEach(l => this.term.writeln(l));
    this.term.writeln(`============ Closing hint with id: ${id} ============`);
  }

  usage() {
    this.term.writeln('Usage: hints <subcommand> [args]');
    this.term.writeln('Subcommands:');
    this.term.writeln('- list : List all hints');
    this.term.writeln('- open <id> : Open hint with the given id');
  }
}
