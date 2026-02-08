export default class Card {

    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.cardImage = new Image();
        this.cardImage.src = `../../assets/games/blackjack/cards/${rank.toLowerCase()}_of_${suit.toLowerCase()}.svg`;
    }

    get value() {
        if (['Jack', 'Queen', 'King'].includes(this.rank)) return 10;
        if (this.rank === 'Ace') return 11;
        return parseInt(this.rank);
    }

    toString() {
        return `${this.rank} of ${this.suit}`;
    }
}