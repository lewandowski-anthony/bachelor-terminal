export default class Card {

    constructor(suit, rank) {

        if (new.target === Card) {
            throw new Error("Card is abstract and cannot be instantiated directly.");
        }

        this.suit = suit;
        this.rank = rank;
        this.cardImage = new Image();
        this.cardImage.src = `../../assets/games/cards/${rank.toLowerCase()}_of_${suit.toLowerCase()}.svg`;
    }

    get value() {
        throw new Error("Abstract getter 'value' must be implemented by subclass.");
    }

    toString() {
        return `${this.rank} of ${this.suit}`;
    }
}