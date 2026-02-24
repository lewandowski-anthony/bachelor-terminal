import AbstractListOpenCommand from '../core/AbstractListOpenCommand.js';
import { renderTable } from '../utils/table.js';
import { decodeBase64Utf8 } from '../../utils/base64.js';
import { evgList } from '../../data/evg.js';
import { USER_STATE } from '../../models/userState.js';
import {USERS} from "../../models/user.js";

const RESTRICTED_ACCESS = {
  lucas: USERS['anthony'].username,
  benjamin: USERS['antoine'].username,
};

export default class EvgCommand extends AbstractListOpenCommand {
  constructor(term) {
    super('evg', 'Open every EVG information', term);
  }

  list() {
    const sortedInfos = this.getSortedInfos();
    const headers = ['Id', 'Title', 'Bachelor', 'Date'];
    renderTable(this.term, headers, sortedInfos);
  }

  open(id) {
    if (!id) return this.usage();

    const info = this.findById(id);
    if (!info) {
      return this.term.writeln(`EVG info not found: ${id}`);
    }

    if (!this.hasAccess(info)) {
      return this.term.writeln(
          `${this.capitalize(info.bachelor)} bachelor party can only be seen by ${this.getAllowedUser(info)}`
      );
    }

    this.displayInfo(info);
  }

  usage() {
    this.term.writeln('Usage: evg <subcommand> [args]');
    this.term.writeln('Subcommands:');
    this.term.writeln('- list : List all EVG information');
    this.term.writeln('- open <id> : Open bachelor party information with the given id');
  }

  // ---------------------
  // Private helpers
  // ---------------------

  getSortedInfos() {
    return [...evgList].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );
  }

  findById(id) {
    return evgList.find(item => String(item.id) === String(id));
  }

  hasAccess(info) {
    const allowedUser = RESTRICTED_ACCESS[info.bachelor];
    if (!allowedUser) return true;
    return USER_STATE.user?.username === allowedUser;
  }

  getAllowedUser(info) {
    return RESTRICTED_ACCESS[info.bachelor];
  }

  displayInfo(info) {
    this.term.writeln(`Opening ${info.title} ...`);

    const text = decodeBase64Utf8(info.data);

    this.term.writeln(`--- ${info.title} content ---`);
    text.split('\n').forEach(line => this.term.writeln(line));
    this.term.writeln(`--- End of ${info.title} ---`);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}