import ICommand from '../core/ICommand.js';
import { giveASlap, fetchSlapCount } from '../../core/api/providers/counter.api.js';
import { displayAsciiArt } from '../utils/ascii.js';

const SLAP_ASCII_ART = [
    '    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⠖⠛⠋⠙⠛⠛⠲⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀    ',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠘⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⣤⡄⠀⠀⠀⠀⢿⡷⠀⠀⠀⠀⠀⢸⠁⠀⠀⠀⠀⠀⣴⠚⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⠀⣿⢷⢀⡞⠁⣠⡯⠞⢛⡆⠀⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡄⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⣸⠛⠛⠓⢾⡌⠛⠀⡀⠋⠀⣠⣾⡀⠀⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠞⢿⡀⠀⠈⠉⠁⠀⠀⠀⠀⠀⠀⠃⢀⣠⣴⠞⠁⣠⠞⠁⠀⠞⢉⣴⣃⠀⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠋⠀⠀⠀⠷⠀⠀⠀⠀⠀⠀⢀⣀⡤⠴⢚⠽⠋⠁⣠⠞⠁⠀⡠⠂⠀⠉⣉⡿⠀⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠁⠀⠀⠀⢤⣀⣀⣀⡤⠴⠖⠚⠉⣁⠴⠊⠁⢀⠤⠊⠁⢀⡠⢊⢄⣀⡴⠚⠯⣄⠀⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠖⠋⠁⣀⠔⠊⠁⠀⣀⠔⣉⣴⠟⠋⠁⠀⠀⠀⠉⠷⣄⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⢀⣰⠶⠇⠀⣰⣾⣷⡆⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⠀⠀⠀⠀⠀⠀⠀⣰⠎⠁⠀⠀⠀⠀⠀⠀⠀⡰⢎⣰⡾⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣆⠀⠀⠀⠀',
    '⠀⠀⠀⣠⢶⡫⠗⠀⠐⠫⠛⠛⠉⢀⡤⣖⣤⠴⠂⠀⠀⠐⣇⠀⠀⠀⠀⠀⠠⠒⠉⠀⠀⠀⠀⠀⠀⢀⡠⣴⣽⡶⠟⠁⠀⠀⠀⠀⣄⠀⠀⠀⠀⠀⠀⠀⠙⣆⠀⠀⠀',
    '⠀⠀⣰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠪⣟⠭⣢⢠⡀⠀⠀⠹⣆⣀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⡤⠶⢟⡫⠝⠉⠀⠀⠀⠀⠀⠀⠀⠹⣦⡀⠀⠀⠀⠀⠀⠀⠘⣇⠀⠀',
    '⠀⢠⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠊⠵⠊⠁⢸⠛⠶⠤⠤⣤⡿⠉⠙⢓⣒⣾⣟⡩⠟⠉⢀⡠⠖⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡛⣦⠀⠀⠀⠀⠀⠀⠸⡆⠀',
    '⠀⣸⠀⠀⠀⢰⣾⡿⢖⡚⠀⠀⠀⠀⠀⠀⣀⡴⠏⠀⣀⡀⣤⡿⠒⣂⡩⠕⠂⢻⡀⠀⠤⠒⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠘⣧⠀⠀⠀⠀⠀⠀⢻⠀',
    '⠀⣿⣴⡴⠄⠀⠁⣴⠋⠁⠀⠀⠀⠀⠘⠛⠓⢦⡄⠀⠀⠀⠈⢧⡉⠀⡀⠀⠀⠈⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡆⠘⡇⠀⠀⠀⠀⠀⢸⡆',
    '⠀⢻⠁⠀⠀⠀⢀⣿⠞⣉⠀⠀⠀⠀⣠⢔⡂⠀⢹⠀⠀⠀⠀⠀⢩⠟⠁⠀⠀⠀⢹⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⡇⠀⠀⠀⠀⠀⢸⠇',
    '⢀⣼⡖⠃⠀⠀⠀⠛⣉⡤⢒⡁⢀⡤⠞⣡⠀⢠⡿⠒⠓⢲⣄⠀⡟⠀⠀⠀⠀⠀⠀⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣼⠃⠀⠀⠀⠀⠀⣸⠀',
    '⠈⢠⡷⠚⢋⠁⠀⠀⠀⢺⣡⡔⠣⠞⠋⠀⢀⡴⠀⠀⠀⠀⠙⠂⠛⠀⠀⠀⠀⠀⠀⠸⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠏⣀⠀⠀⠀⠀⢀⡇⠀',
    '⠀⠀⠙⡿⣛⡴⠖⠀⠀⠀⠈⠉⠀⠀⠀⠀⠚⠛⠛⠛⠲⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠶⣿⣤⣾⢡⡆⡼⠁⠀',
    '⠀⠀⠀⠉⠉⠉⢻⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣶⠀⠀⠀⠀⠀⠀⠀⠀⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡆⠈⠉⠙⠁⠀⠀',
    '⠀⠀⠀⢀⡴⠚⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡀⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠀⠀⠀⠀⠀⠀',
    '⠀⠀⣰⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣧⠀⠀⠀⠀⠀⠀⠀⢸⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡇⠀⠀⠀⠀⠀',
    '⠀⢰⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡆⠀⠀⠀⠀⠀⠀⢸⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⠀⠀⠀⠀⠀',
    '⠀⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠈⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    '⢸⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀'
]

export default class SlapCommand extends ICommand {
    constructor(term) {
        super('slap', 'Manage slaps: give a slap to someone or count the number of slaps received by each', term);
        this.term = term;
    }

    async execute(args) {
        if (args.length === 0) {
            this.term.writeln('Usage: slap [give|count] <receiverName>');
            return;
        }

        switch (args[0]) {
            case 'give':
                await this.giveSlap(args[1]);
                break;
            case 'count':
                await this.countSlaps();
                break;
            default:
                this.term.writeln('Unknown subcommand. Usage: slap [give|count] <receiverName>');
        }
    }

    async countSlaps() {
        try {
            const slapPerPerson = await fetchSlapCount();
            displaySlapCountsAscii(this.term, slapPerPerson);
        }
        catch (error) {
            this.term.writeln(`Failed to fetch slap count. Please try again later : `, error);
        }
    }

    async giveSlap(receiverName) {
        if (!receiverName) {
            this.term.writeln('Please specify a receiver name. Usage: slap give <receiverName>');
            return;
        }

        try {
            await giveASlap(receiverName);
            this.term.writeln(`You gave a slap to ${receiverName}!`);
            displayAsciiArt(SLAP_ASCII_ART, this.term, {
                speed: 150,
                startingText: 'GIVING A SLAP TO ' + receiverName.toUpperCase(),
                finalText: 'OH MY GOD THIS ONE SHOULD HURT ',
            });
        } catch (error) {
            this.term.writeln(`Failed to give a slap to ${receiverName}. Please try again later.`);
        }
    }
}

function displaySlapCountsAscii(term, slapCountsArray) {
    const maxCount = Math.max(...slapCountsArray.map(([_, count]) => count));

    slapCountsArray.forEach(([username, count]) => {
        const bar = '█'.repeat(count);
        const koMarker = count === maxCount ? ' <- KO !' : '';
        term.writeln(`${username.padEnd(8)}: ${bar} ${count}${koMarker}`);
    });
}

