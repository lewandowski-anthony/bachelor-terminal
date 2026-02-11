import CardGame from "../common/cardGame.js";
import LiarCard from "./liarCard.js";
import LiarGameBotAI from "./liarGameBotAI.js";

export default class LiarGame extends CardGame {
    constructor() {
        super();

        /* ===== ÉTAT DU JEU ===== */
        this.isPlayerTurn = true;
        this.isWaitingForDecision = false;
        this.currentGameSuit = null;
        this.gameStack = [];
        this.lastPlayedCard = null;
        this.result = '';
        this.isRoundOver = false;

        /* ===== BOTS ===== */
        this.bots = [
            new LiarGameBotAI(document.getElementById('firstBotCardsDiv')),
            new LiarGameBotAI(document.getElementById('secondBotCardsDiv')),
            new LiarGameBotAI(document.getElementById('thirdBotCardsDiv'))
        ];

        /* ===== DOM ===== */
        this.playerCardsDiv = document.getElementById('playerCards');
        this.centralPileDiv = document.getElementById('centralPile');
        this.gameColorNameDiv = document.getElementById('currentGameSuit');
        this.resultDiv = document.getElementById('gameResult');
        this.lieBtn = document.getElementById('lieBtn');
        this.passBtn = document.getElementById('passBtn');
        this.nextRoundBtn = document.getElementById('nextRoundBtn');
        this.newGameBtn = document.getElementById('newGameBtn');

        this.nextRoundBtn.addEventListener('click', () => this.nextRound());
        this.newGameBtn.addEventListener('click', () => this.init());

        this.init();
    }

    /* ================= INIT ================= */
    init() {
        this.cards = [];
        this.resultDiv.innerHTML = '';
        this.isGameOver=false;
        this.isRoundOver=false;
        this.isWaitingForDecision=false;
        this.isPlayerTurn = true;
        this.playerHand = [];
        this.bots.forEach(bot => bot.cards = []);
        this.newGameBtn.style.display = 'none';

        for (let s of this.suits) {
            for (let r of this.rank) {
                this.cards.push(new LiarCard(s, r));
            }
        }

        this.shuffle();
        this.dealInitialCards();

        this.updateDecisionButtons();
        this.updateUI();
    }

    nextRound() {
        // Réinitialisation pour la manche suivante
        this.gameStack = [];
        this.currentGameSuit = null;
        this.lastPlayedCard = null;
        this.isPlayerTurn = true;
        this.isWaitingForDecision = false;
        this.resultDiv.innerHTML = '';
        this.nextRoundBtn.style.display = 'none';
        this.isRoundOver = false;
        this.updateUI();
    }

    dealInitialCards() {
        do {
            this.drawCard(this.playerHand);
            this.bots.forEach(bot => this.drawCard(bot.cards));
        } while (this.cards.length > 0);
    }

    /* ================= UI ================= */
    updateUI() {
        this.renderShowedHandOnDiv(this.playerHand, this.playerCardsDiv);
        this.shouldMakePlayerCardsActivable(this.isPlayerTurn);

        this.bots.forEach(bot =>
            this.renderHiddenHandOnDiv(bot.cards, bot.botCardsDiv)
        );

        this.gameColorNameDiv.innerHTML =
            this.currentGameSuit ?? 'Aucune couleur jouée';

        if (this.gameStack.length <= 1 || this.isRoundOver) {
            this.renderShowedHandOnDiv(this.gameStack, this.centralPileDiv);
        } else {
            this.renderHiddenHandOnDiv(this.gameStack, this.centralPileDiv);
        }

        this.updateDecisionButtons();
    }

    updateDecisionButtons() {
        const display = this.isWaitingForDecision ? "inline-flex" : "none";
        this.lieBtn.style.display = display;
        this.passBtn.style.display = display;
    }

    shouldMakePlayerCardsActivable(active) {
        this.playerCardsDiv
            .querySelectorAll('.card-img')
            .forEach(card =>
                active
                    ? card.classList.remove('disabled')
                    : card.classList.add('disabled')
            );
    }

    /* ================= RENDER ================= */
    renderShowedHandOnDiv(hand, div) {
        this.renderHandOnDiv(hand, div, true);
    }

    renderHiddenHandOnDiv(hand, div) {
        this.renderHandOnDiv(hand, div, false);
    }

    renderHandOnDiv(hand, div, showCards = false) {
        div.innerHTML = '';

        hand.forEach((card, index) => {
            const img = document.createElement('img');
            img.src = showCards
                ? card.cardImage.src
                : '../../assets/games/cards/back.svg';
            img.alt = card.toString();
            img.className = 'card-img';
            img.style.zIndex = index;
            img.style.top = `calc(50% + ${index * 2}px)`;
            img.style.left = `calc(50% + ${index * 2}px)`;

            img.addEventListener('click', async () => {
                await this.playsWholeTurn(hand, card);
            });

            div.appendChild(img);
        });
    }

    /* ================= FLOW DE JEU ================= */
    async playsWholeTurn(hand, card) {
        if (!this.isPlayerTurn || this.isRoundOver) return;

        this.isPlayerTurn = false;
        this.playCard(hand, card);
        this.checkGameOver();

        for (const bot of this.bots) {
            await this.manageBotsTurn(bot);
            if (this.isRoundOver) break;
        }

        this.checkGameOver();
        if(!this.isGameOver) {
            this.isPlayerTurn = !this.isRoundOver;
            this.updateUI();
        }
    }

    async manageBotsTurn(bot) {
        if (this.isRoundOver) return;

        const card = bot.cards[Math.floor(Math.random() * bot.cards.length)];
        this.lastPlayedCard = card;
        this.playCard(bot.cards, card);

        this.isWaitingForDecision = true;
        this.updateUI();
        const decision = await this.waitForPlayerDecision();
        this.isWaitingForDecision = false;
        this.updateUI();

        if (decision === 'lie') {
            await this.manageRoundEnd(bot);
            this.isRoundOver = true;
        }

        this.checkGameOver();
    }

    waitForPlayerDecision() {
        return new Promise(resolve => {
            const onLie = () => cleanup('lie');
            const onPass = () => cleanup('pass');

            const cleanup = decision => {
                this.lieBtn.removeEventListener('click', onLie);
                this.passBtn.removeEventListener('click', onPass);
                resolve(decision);
            };

            this.lieBtn.addEventListener('click', onLie);
            this.passBtn.addEventListener('click', onPass);
        });
    }

    async manageRoundEnd(bot) {
        if (this.lastPlayedCard.suit === this.currentGameSuit) {
            this.result = 'Le bot disait la vérité. Vous ramassez.';
            this.playerHand.push(...this.gameStack);
        } else {
            this.result = 'Le bot mentait. Il ramasse.';
            bot.cards.push(...this.gameStack);
        }

        this.resultDiv.innerHTML = this.result;
        this.nextRoundBtn.style.display = 'inline-flex';
        this.isPlayerTurn = false;
        this.isWaitingForDecision = false;
        this.isRoundOver = true;
    }

    /* ================= FIN DE JEU ================= */
    checkGameOver() {
        if (this.playerHand.length === 0) {
            this.result = 'Félicitations ! Vous avez gagné la partie.';
            this.endGame();
        } else if (this.bots.some(bot => bot.cards.length === 0)) {
            this.result = 'Les bots ont gagné la partie !';
            this.endGame();
        }
    }

    endGame() {
        this.newGameBtn.style.display = 'inline-flex';
        this.isRoundOver = true;
        this.isPlayerTurn = false;
        this.isWaitingForDecision = false;
        this.resultDiv.innerHTML = this.result;
        this.currentGameSuit.innerHTML= '';
        this.renderShowedHandOnDiv(this.gameStack, this.centralPileDiv);
        this.nextRoundBtn.style.display = 'inline-flex';
        this.renderShowedHandOnDiv(this.playerHand);
        this.bots.forEach(bot =>
            this.renderShowedHandOnDiv(bot.cards, bot.botCardsDiv)
        );
    }

    /* ================= LOGIQUE DE CARTE ================= */
    playCard(hand, card) {
        if (!this.currentGameSuit) this.currentGameSuit = card.suit;

        const index = hand.indexOf(card);
        if (index > -1) hand.splice(index, 1);

        this.gameStack.push(card);
        this.updateUI();
    }
}
