import AbstractListOpenCommand from '../core/AbstractListOpenCommand.js';
import { renderTable } from '../utils/table.js';

export default class HintsCommand extends AbstractListOpenCommand {
  constructor(term) {
    super('hints', 'List and open hints', term);
  }

  list() {
    const hints = [...window.hintList].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const headers = ['Id', 'Title'];
    renderTable(this.term, headers, hints);
  }

  open(id) {
    const hint = window.hintList.find(l => String(l.id) === String(id));
    if (!hint) return this.term.writeln('Hint not found');
    hint.data.split('\n').forEach(l => this.term.writeln(l));
  }
}
