import Card from "../common/card.js";

export default class LiarCard extends Card {

    constructor(suit, rank) {
        super(suit, rank);
    }

    get value() {
        if(this.rank === 'Jack') return 11;
        if(this.rank === 'Queen') return 12;
        if(this.rank === 'King') return 13;
        if (this.rank === 'Ace') return 14;
        return parseInt(this.rank);
    }
}