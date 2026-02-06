import AbstractListOpenCommand from '../core/AbstractListOpenCommand.js';
import { renderTable } from '../utils/table.js';
import { decodeBase64Utf8 } from '../utils/base64.js';

class MediasCommand extends AbstractListOpenCommand {
  constructor(term) {
    super('medias', 'List and open medias', term);
  }

  list() {
    const medias = [...window.mediaList].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const headers = ['ID', 'Name', 'Type', 'Date'];
    const sizes = [10, 15, 15, 25];
    renderTable(this.term, headers, medias, sizes);
  }

  open(id) {
    const media = window.mediaList.find(l => String(l.id) === String(id));
    if (!media) return this.term.writeln('Media not found');

    const text = decodeBase64Utf8(media.data);
    text.split('\n').forEach(l => this.term.writeln(l));
  }
}

window.MediasCommand = MediasCommand;