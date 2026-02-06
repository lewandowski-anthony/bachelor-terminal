import AbstractListOpenCommand from '../core/AbstractListOpenCommand.js';
import { renderTable } from '../utils/table.js';
import { decodeBase64Utf8 } from '../utils/base64.js';
import { isValidInput } from '../../utils/stringUtils.js';
import { mediaList } from '../../data/medias.js';

export default class MediasCommand extends AbstractListOpenCommand {
  constructor(term) {
    super('medias', 'List and open medias', term);
  }

  list() {
    const medias = [...mediaList].sort((a, b) => a.name.localeCompare(b.name)).map(m => {
      m.visibility = m.password ? 'Protected' : 'Public';
      m.locked = m.isLocked ? 'Yes' : 'No';
      return m;
    });
    const headers = ['Name', 'Type', 'Visibility', 'Locked'];
    renderTable(this.term, headers, medias);
  }

  open(name, pwd) {
    if (!name) return this.usage();
    const media = mediaList.find(f => f.name.toLowerCase() === name.toLowerCase());
    if (!media) return this.term.writeln(`Media not found: ${name}`);
    if (media.password) {
      if (!pwd) {
        return this.term.writeln('This media is protected by a password. Please provide it as the last argument.');
      }
      if (!isValidInput(pwd)) {
        return this.term.writeln('Invalid password. Use only lowercase letters and numbers, no accents or apostrophes.');
      }
      if (decodeBase64Utf8(media.password).toLowerCase() !== String(pwd || '').toLowerCase()) {
        return this.term.writeln('Wrong password!');
      }
    }
    if (media.isLocked) {
      return this.term.writeln(`This media is locked and cannot be opened for the moment.`);
    }
    this.term.writeln(`Opening ${media.name} (${media.type}) ...`);
    if (media.type === 'video') {
      window.open(decodeBase64Utf8(media.data), '_blank');
    } else if (media.type === 'image') {
      const imgWindow = window.open('');
      imgWindow.document.write(`<img src="${decodeBase64Utf8(media.data)}" style="max-width:100%;height:auto;">`);
    } else {
      const text = decodeBase64Utf8(media.data);
      this.term.writeln(`--- ${media.name} content ---`);
      text.split('\n').forEach(line => this.term.writeln(line));
      this.term.writeln(`--- End of ${media.name} ---`);
    }
  }

  usage() {
    this.term.writeln('Usage: medias <subcommand> [args] [password]');
    this.term.writeln('Subcommands:');
    this.term.writeln('- list : List all medias');
    this.term.writeln('- open <name> : Open media with the given name');
    this.term.writeln('If the media is protected by a password, you can provide it as the last argument');
  }
}
