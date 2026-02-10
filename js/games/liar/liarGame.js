import CardGame from "../common/cardGame.js";
import LiarCard from "./liarCard.js";

export default class LiarGame extends CardGame {
    constructor() {
        super();
        this.isPlayerTurn = true;
        this.result = '';
        this.firstBotHand = [];
        this.secondBotHand = [];
        this.thirdBotHand = [];
        this.thirdBotHand = [];
        this.currentGameSuit = null;
        this.gameStack = [];
        this.lastPlayedCard = null;

        this.playerCardsDiv = document.getElementById('playerCards');
        this.firstBotDiv = document.getElementById('firstBotCardsDiv');
        this.secondBotDiv = document.getElementById('secondBotCardsDiv');
        this.thirdBotDiv = document.getElementById('thirdBotCardsDiv');
        this.centralPileDiv = document.getElementById('centralPile');
        this.gameColorNameDiv = document.getElementById('currentGameSuit');
        this.lieBtn = document.getElementById('lieBtn');
        this.passBtn = document.getElementById('passBtn');
        this.resultDiv = document.getElementById('result');
        this.passBtn = document.getElementById('passBtn');

        this.init();
    }

    init() {
        this.cards = [];
        for (let s of this.suits) {
            for (let r of this.rank) {
                this.cards.push(new LiarCard(s, r));
            }
        }
        this.shuffle();
        this.dealInitialCards();
        this.passBtn.addEventListener('click', () => {
            console.log("Joueur passe");
        });
        this.updateUI();
    }

    dealInitialCards() {
        do {
            this.drawCard(this.playerHand);
            this.drawCard(this.firstBotHand);
            this.drawCard(this.secondBotHand);
            this.drawCard(this.thirdBotHand);
        } while (this.cards.length > 0);
    }

    updateUI() {
        this.renderShowedHandOnDiv(this.playerHand, this.playerCardsDiv);
        this.renderHiddenHandOnDiv(this.firstBotHand, this.firstBotDiv);
        this.renderHiddenHandOnDiv(this.secondBotHand, this.secondBotDiv);
        this.renderHiddenHandOnDiv(this.thirdBotHand, this.thirdBotDiv);
        this.gameColorNameDiv.innerHTML=this.currentGameSuit ? this.currentGameSuit : 'Aucune couleur jouée';
        if(this.gameStack.length <= 1) {
            this.renderShowedHandOnDiv(this.gameStack, this.centralPileDiv);
        } else {
            this.renderHiddenHandOnDiv(this.gameStack, this.centralPileDiv);
        }
    }

    renderShowedHandOnDiv(hand, div) {
        this.renderHandOnDiv(hand, div, true);
    }

    renderHiddenHandOnDiv(hand, div) {
        this.renderHandOnDiv(hand, div, false);
    }

    renderHandOnDiv(playerHand, div, showCards = false) {
        div.innerHTML = '';

        playerHand.forEach((card, index) => {
            const img = document.createElement('img');
            img.src = showCards ? card.cardImage.src : '../../assets/games/cards/back.svg';
            img.alt = card.toString();
            img.className = 'card-img';
            img.style.zIndex = index;
            img.style.top = `calc(50% + ${index * 2}px)`;
            img.style.left = `calc(50% + ${index * 2}px)`;
            div.appendChild(img);
            img.addEventListener('click', () => {
                this.playCard(playerHand, card);
                this.playTurn(playerHand, card);
            });
        });
    }

    playTurn(playerHand, card) {
        this.manageBotsTurn(this.firstBotHand);
        this.manageBotsTurn(this.secondBotHand);
        this.manageBotsTurn(this.thirdBotHand);
    }

    manageBotsTurn(botHand) {
        let randomBotCard = botHand[Math.floor(Math.random() * botHand.length)];
        this.lastPlayedCard = randomBotCard;
        this.playCard(botHand, randomBotCard);
        this.lieBtn.disabled = false;
        this.passBtn.disabled = false;
    }

    playCard(hand, card) {
        if(!this.currentGameSuit) {
            this.currentGameSuit=card.suit;
        }
        console.log(`Card played: ${card.toString()}`);
        const index = hand.indexOf(card);
        this.gameStack.push(card);
        if (index > -1) {
            hand.splice(index, 1);
        }
        this.updateUI();
    }
}
