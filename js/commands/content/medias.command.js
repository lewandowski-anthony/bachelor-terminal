import AbstractListOpenCommand from '../core/AbstractListOpenCommand.js';
import { renderTable } from '../utils/table.js';
import { decodeBase64Utf8 } from '../utils/base64.js';

export default class MediasCommand extends AbstractListOpenCommand {
  constructor(term) {
    super('medias', 'List and open medias', term);
  }

  list() {
    const medias = [...window.mediaList].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const headers = ['Name', 'Type'];
    renderTable(this.term, headers, medias);
  }

  open(id) {
    const media = window.mediaList.find(l => String(l.id) === String(id));
    if (!media) return this.term.writeln('Media not found');

    const text = decodeBase64Utf8(media.data);
    text.split('\n').forEach(l => this.term.writeln(l));
  }
}
