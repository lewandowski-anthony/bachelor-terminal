import { mediaList } from '../../data/medias.js';
import BlackJackCard from './blackJackCard.js';
import CardGame from "../common/cardGame.js";

const REQUIRED_VICTORY_NUMBER = 10;

export default class BlackJackGame extends CardGame{
    constructor() {
        super();
        this.dealerHand = [];
        this.isPlayerTurn = true;
        this.result = '';
        this.playerVictories = 0;
        this.dealerVictories = 0;
        this.init();
    }

    init() {
        this.cards = [];
        for (let s of this.suits) {
            for (let r of this.rank) {
                this.cards.push(new BlackJackCard(s, r));
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
            this.determineWinner();
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
        if (d > 21) {
            this.result = "Dealer busts! Player wins!";
            this.playerVictories++;
        } else if (p > 21) {
            this.result = "Player busts! Dealer wins!";
            this.dealerVictories++;
        }
        else if (p > d) {
            this.result = "Player wins!";
            this.playerVictories++;
        }
        else if (p < d) {
            this.result = "Dealer wins!";
            this.dealerVictories++;
        }
        else this.result = "It's a tie!";
        this.isGameOver = true;
    }

    updateUI() {

        const playerCardsDiv = document.getElementById('playerCards');
        const dealerCardsDiv = document.getElementById('dealerCards');
        const CARD_BACK = '../../assets/games/cards/back.svg';

        const toggleElement = (id, show) => {
            const el = document.getElementById(id);
            if (el) el.style.display = show ? 'inline-block' : 'none';
        };

        const createCardImg = (card, hidden = false) => {
            const img = document.createElement('img');
            img.src = hidden ? CARD_BACK : card.cardImage.src;
            img.alt = hidden ? 'Hidden card' : card.toString();
            img.className = 'card-img';
            return img;
        };

        playerCardsDiv.innerHTML = '';
        dealerCardsDiv.innerHTML = '';

        this.playerHand.forEach(c => playerCardsDiv.appendChild(createCardImg(c)));

        this.dealerHand.forEach((c, i) => {
            const hidden = !this.isGameOver && i !== 0;
            dealerCardsDiv.appendChild(createCardImg(c, hidden));
        });

        toggleElement('hitBtn', !this.isGameOver);
        toggleElement('standBtn', !this.isGameOver);
        toggleElement('restartBtn', this.isGameOver);

        const playerWinsGame = this.playerVictories >= REQUIRED_VICTORY_NUMBER;
        const dealerWinsGame = this.dealerVictories >= REQUIRED_VICTORY_NUMBER;
        document.getElementById('gameWinner').textContent = "";

        if (this.isGameOver) {
            toggleElement('replayBtn', !(playerWinsGame || dealerWinsGame));
            if (playerWinsGame || dealerWinsGame) {
                this.playerVictories = 0;
                this.dealerVictories = 0;
                let tldFile = mediaList.filter(e => e.name=='projet-secret.png')[0];
                document.getElementById('gameWinner').style.color = playerWinsGame ? 'green' : 'red';
                document.getElementById('gameWinner').textContent = playerWinsGame ?
                `Player wins the game ! Password of ${tldFile.name} is ${atob(tldFile.password)}` :
                `Dealer wins the game`;
            }
        }

        document.getElementById('playerValue').textContent = `Value: ${this.calculateHandValue(this.playerHand)}`;
        document.getElementById('dealerValue').textContent = this.isGameOver ? `Value: ${this.calculateHandValue(this.dealerHand)}` : '';
        document.getElementById('playerVictories').textContent = this.playerVictories;
        document.getElementById('dealerVictories').textContent = this.dealerVictories;
        document.getElementById('result').textContent = this.result;
    }

}
