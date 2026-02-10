import Card from "../common/card.js";

export default class BlackJackCard extends Card {

    constructor(suit, rank) {
        super(suit, rank);
    }

    get value() {
        if (['Jack', 'Queen', 'King'].includes(this.rank)) return 10;
        if (this.rank === 'Ace') return 11;
        return parseInt(this.rank);
    }
}