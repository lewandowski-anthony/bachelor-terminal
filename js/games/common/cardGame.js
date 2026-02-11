export default class CardGame {
    constructor() {
        if (new.target === CardGame) {
            throw new Error("CardGame is an abstract class and cannot be instantiated directly.");
        }
        this.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        this.rank = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        this.cards=[];
        this.playerHand = [];
        this.isGameOver = false;
    }

    // Abstract methods to be implemented by subclasses

    init() {
        throw new Error("Abstract method 'init' must be implemented by subclass.");
    }

    updateUI() {
        throw new Error("Abstract method 'updateUI' must be implemented by subclass.");
    }

    dealInitialCards() {
        throw new Error("Abstract method 'dealInitialCards' must be implemented by subclass.");
    }

    // Common methods for card games

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard(hand) {
        hand.push(this.cards.pop());
    }
}