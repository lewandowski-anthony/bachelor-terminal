import AbstractListOpenCommand from '../core/AbstractListOpenCommand.js';
import { renderTable } from '../utils/table.js';
import { decodeBase64Utf8 } from '../utils/base64.js';
import { USER_STATE } from '../../models/userState.js';
import { logList } from '../../data/logs.js';

export default class LogsCommand extends AbstractListOpenCommand {
    constructor(term) {
        super('logs', 'List and open logs', term);
    }

    list() {
        const logs = [...logList].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
        const headers = ['Id', 'Creator', 'Date'];
        renderTable(this.term, headers, logs);
    }

    open(id) {
        if (!id) return this.usage();
        const log = logList.find(f => String(f.id) === String(id));
        if (!log) return this.term.writeln(`Log not found: ${id}`);
        if (log.creator !== USER_STATE.user.username && ['admin', 'logmaster'].includes(USER_STATE.user.role) === false) {
            this.term.writeln(`You don't have permission to access this log.`);
            return this.term.writeln(`Please, use an admin account or the 'logmaster' account to access it.`);
        }
        this.term.writeln('');
        this.term.writeln(`Opening log ${log.id} created by ${log.creator} on ${log.date} ...`);
        const text = decodeBase64Utf8(log.data);
        this.term.writeln('');
        this.term.writeln(`--- Log number ${log.id} from ${log.creator} on ${log.date} ---`);
        text.split('\n').forEach(line => this.term.writeln(line));
        this.term.writeln(`--- End of log number ${log.id} ---`);
    }

    usage() {
        this.term.writeln('Usage: logs <subcommand> [args]');
        this.term.writeln('Subcommands:');
        this.term.writeln('- list : List all logs');
        this.term.writeln('- open <id> : Open log with the given id');
    }

}
