import AbstractListOpenCommand from '../core/AbstractListOpenCommand.js';
import { renderTable } from '../utils/table.js';

export default class GamesCommand extends AbstractListOpenCommand {
    constructor(term) {
        super('games', 'List and open games', term);
    }

    games = [
        {
            id: 1,
            title: 'Flappy Ben',
            description: 'Help Ben (a.k.a Bounzi) fly through the pipes and beat the high score!',
            link: './pages/flappy/flappy.html'
        },
    ];

    list() {
        const games = [...this.games].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
        const headers = ['Id', 'Title', 'Description'];
        renderTable(this.term, headers, games);
    }

    open(id) {
        this.term.writeln(`============ Opening game with id: ${id} ============`);
        const game = this.games.find(g => String(g.id) === String(id));
        if (!game) return this.term.writeln('Game not found');
        window.open(game.link, '_blank');
    }

    usage() {
        this.term.writeln('Usage: games <subcommand> [args]');
        this.term.writeln('Subcommands:');
        this.term.writeln('- list : List all games');
        this.term.writeln('- open <id> : Open game with the given id');
    }
}
