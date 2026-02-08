import Card from './card.js';

export default class Game {
    constructor() {
        this.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        this.rank = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.cards = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.isPlayerTurn = true;
        this.isGameOver = false;
        this.result = '';
        this.init();
    }
    
    init() {
        for (let suit of this.suits) {
            for (let rank of this.rank) {
                this.cards.push(new Card(suit, rank));
            }
        }
        this.shuffle();
        this.dealInitialCards();
    }

    shuffle() {
        for(let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard(hand) {
        if (this.cards.length === 0) {
            this.result = 'No more cards in the deck!';
            this.isGameOver = true;
            return;
        }
        hand.push(this.cards.pop());
    }
    
    dealInitialCards() {
        this.drawCard(this.playerHand);
        this.drawCard(this.dealerHand);
        this.drawCard(this.playerHand);
        this.drawCard(this.dealerHand);
    }

    showHands() {
        console.log('Player Hand:', this.playerHand.map(card => card.toString()).join(', '), 'Value:', this.calculateHandValue(this.playerHand));
        console.log('Dealer Hand:', this.dealerHand[0].toString(), ', [Hidden]');
    }

    calculateHandValue(hand) {
        let value = hand.reduce((sum, card) => sum + card.value, 0);
        let aceCount = hand.filter(card => card.rank === 'A').length;
        while (value > 21 && aceCount > 0) {
            value -= 10;
            aceCount--;
        }
        return value;
    }

    determineWinner() {
        const playerValue = this.calculateHandValue(this.playerHand);
        const dealerValue = this.calculateHandValue(this.dealerHand);
        
        if (dealerValue > 21) {
            this.result = 'Dealer busts! Player wins.';
        } else if (playerValue > dealerValue) {
            this.result = 'Player wins!';
        } else if (playerValue < dealerValue) {
            this.result = 'Dealer wins!';
        } else {
            this.result = 'It\'s a tie!';
        }
        this.isGameOver = true;
    }

    hit() {
        if (!this.isPlayerTurn || this.isGameOver) return;
        this.drawCard(this.playerHand);
        if (this.calculateHandValue(this.playerHand) > 21) {
            this.result = 'Player busts! Dealer wins.';
            this.isGameOver = true;
        }
    }

    stand() {
        if (!this.isPlayerTurn || this.isGameOver) return;
        this.isPlayerTurn = false;
        while (this.calculateHandValue(this.dealerHand) < 17) {
            this.drawCard(this.dealerHand);
        }
        this.determineWinner();
    }

    start() {
        this.showHands();
        do {
            if(this.isPlayerTurn) {
                const action = prompt('Do you want to hit or stand? (h/s)');
                if (action === 'h') {
                    this.hit();
                    this.showHands();
                } else if (action === 's') {
                    this.stand();
                } else {
                    console.log('Invalid input, please enter "h" for hit or "s" for stand.');
                }
            }
        } while (!this.isGameOver);
        console.log(this.result);
    }
}