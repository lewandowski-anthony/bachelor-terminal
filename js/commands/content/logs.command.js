import AbstractListOpenCommand from '../core/AbstractListOpenCommand.js';
import { renderTable } from '../utils/table.js';
import { decodeBase64Utf8 } from '../utils/base64.js';

export default class LogsCommand extends AbstractListOpenCommand {
  constructor(term) {
    super('logs', 'List and open logs', term);
  }

  list() {
    const logs = [...window.logList].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const headers = ['Id', 'Creator', 'Date'];
    renderTable(this.term, headers, logs);
  }

  open(id) {
    const log = window.logList.find(l => String(l.id) === String(id));
    if (!log) return this.term.writeln('Log not found');

    const text = decodeBase64Utf8(log.data);
    text.split('\n').forEach(l => this.term.writeln(l));
  }
}
