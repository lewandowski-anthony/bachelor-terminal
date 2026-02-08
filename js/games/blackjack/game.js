import Card from './card.js';

export default class Game {
    constructor() {
        this.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        this.rank = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        this.cards = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.isPlayerTurn = true;
        this.isGameOver = false;
        this.result = '';
        this.init();
    }

    init() {
        this.cards = [];
        for (let s of this.suits) {
            for (let r of this.rank) {
                this.cards.push(new Card(s, r));
            }
        }
        this.shuffle();
        this.playerHand = [];
        this.dealerHand = [];
        this.isPlayerTurn = true;
        this.isGameOver = false;
        this.result = '';
        this.dealInitialCards();
        this.updateUI();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard(hand) {
        hand.push(this.cards.pop());
    }

    dealInitialCards() {
        this.drawCard(this.playerHand);
        this.drawCard(this.dealerHand);
        this.drawCard(this.playerHand);
        this.drawCard(this.dealerHand);
    }

    calculateHandValue(hand) {
        let value = hand.reduce((sum, c) => sum + c.value, 0);
        let aceCount = hand.filter(c => c.rank === 'A').length;
        while (value > 21 && aceCount > 0) { value -= 10; aceCount--; }
        return value;
    }

    hit() {
        if (!this.isPlayerTurn || this.isGameOver) return;
        this.drawCard(this.playerHand);
        if (this.calculateHandValue(this.playerHand) > 21) {
            this.result = "Player busts! Dealer wins!";
            this.isGameOver = true;
        }
        this.updateUI();
    }

    stand() {
        if (!this.isPlayerTurn || this.isGameOver) return;
        this.isPlayerTurn = false;
        while (this.calculateHandValue(this.dealerHand) < 17) {
            this.drawCard(this.dealerHand);
        }
        this.determineWinner();
        this.updateUI();
    }

    determineWinner() {
        const p = this.calculateHandValue(this.playerHand);
        const d = this.calculateHandValue(this.dealerHand);
        if (d > 21) this.result = "Dealer busts! Player wins!";
        else if (p > d) this.result = "Player wins!";
        else if (p < d) this.result = "Dealer wins!";
        else this.result = "It's a tie!";
        this.isGameOver = true;
    }

    updateUI() {
        const playerCardsDiv = document.getElementById('playerCards');
        const dealerCardsDiv = document.getElementById('dealerCards');
        playerCardsDiv.innerHTML = '';
        dealerCardsDiv.innerHTML = '';

        this.playerHand.forEach(c => {
            const img = document.createElement('img');
            img.src = c.cardImage.src;
            img.alt = c.toString();
            img.className = 'card-img';
            playerCardsDiv.appendChild(img);
        });

        this.dealerHand.forEach((c, i) => {
            const img = document.createElement('img');
            img.src = (i === 0 || this.isGameOver) ? c.cardImage.src : '../../assets/games/blackjack/cards/back.svg';
            img.alt = (i === 0 || this.isGameOver) ? c.toString() : "Hidden card";
            img.className = 'card-img';
            dealerCardsDiv.appendChild(img);
        });

        document.getElementById('playerValue').textContent = `Value: ${this.calculateHandValue(this.playerHand)}`;
        document.getElementById('dealerValue').textContent = this.isGameOver ? `Value: ${this.calculateHandValue(this.dealerHand)}` : '';
        document.getElementById('result').textContent = this.result;
    }
}
