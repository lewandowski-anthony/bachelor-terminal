import CardGame from "../common/cardGame.js";
import LiarCard from "./liarCard.js";
import LiarGameBotAI from "./liarGameBotAI.js";
import LiarGamePlayer from "./liarGamePlayer.js";
import {mediaList} from "../../data/medias.js";

/* ================= ÉTATS DU JEU ================= */

const GAME_STATE = {
    PLAYER_TURN: 'PLAYER_TURN',
    BOT_TURN: 'BOT_TURN',
    WAITING_DECISION: 'WAITING_DECISION',
    ROUND_END: 'ROUND_END',
    GAME_OVER: 'GAME_OVER'
};

export default class LiarGame extends CardGame {
    constructor() {
        super();

        /* ===== ÉTAT ===== */
        this.state = GAME_STATE.PLAYER_TURN;
        this.turnIndex = 0;
        this.gameStack = [];
        this.currentGameSuit = null;
        this.lastPlayedCard = null;
        this.result = '';

        /* ===== PLAYER ===== */
        this.player = new LiarGamePlayer("Player", document.getElementById('playerCards'));

        /* ===== BOTS ===== */
        this.bots = [
            new LiarGameBotAI('Laurent', Math.random(), document.getElementById('firstBotCardsDiv')),
            new LiarGameBotAI('Antoine', Math.random(), document.getElementById('secondBotCardsDiv')),
            new LiarGameBotAI('Guillaume', Math.random(), document.getElementById('thirdBotCardsDiv'))
        ];

        this.turnOrder = [this.player, ...this.bots];

        /* ===== DOM ===== */
        this.centralPileDiv = document.getElementById('centralPile');
        this.gameColorNameDiv = document.getElementById('currentGameSuit');
        this.resultDiv = document.getElementById('gameResult');
        this.lieBtn = document.getElementById('lieBtn');
        this.passBtn = document.getElementById('passBtn');
        this.nextRoundBtn = document.getElementById('nextRoundBtn');
        this.newGameBtn = document.getElementById('newGameBtn');

        this.botOneNameDiv = document.getElementById('bot1-name');
        this.botTwoNameDiv = document.getElementById('bot2-name');
        this.botThreeNameDiv = document.getElementById('bot3-name');

        this.nextRoundBtn.addEventListener('click', () => this.nextRound());
        this.newGameBtn.addEventListener('click', () => this.init());

        this.init();
    }

    /* ================= INIT ================= */

    init() {
        this.cards = [];
        this.gameStack = [];
        this.currentGameSuit = null;
        this.lastPlayedCard = null;
        this.result = '';

        this.state = GAME_STATE.PLAYER_TURN;
        this.turnIndex = 0;

        this.player.cards = [];
        this.player.numberOfCardsPlayedThisRound=0;
        this.player.numberOfTimeHeGotCaugthLying=0;
        this.bots.forEach(bot => {
            bot.cards = [];
            bot.numberOfTimeHeGotCaugthLying=0;
        });

        this.newGameBtn.style.display = 'none';
        this.nextRoundBtn.style.display = 'none';
        this.resultDiv.innerHTML = '';
        this.botOneNameDiv.innerHTML = this.bots[0].playerName;
        this.botTwoNameDiv.innerHTML = this.bots[1].playerName;
        this.botThreeNameDiv.innerHTML = this.bots[2].playerName;

        for (let s of this.suits) {
            for (let r of this.rank) {
                this.cards.push(new LiarCard(s, r));
            }
        }

        this.shuffle();
        this.dealInitialCards();

        this.updateUI();
        this.nextTurn();
    }

    dealInitialCards() {
        while (this.cards.length) {
            this.drawCard(this.player.cards);
            this.bots.forEach(bot => this.drawCard(bot.cards));
        }
    }

    /* ================= TOURS ================= */

    async nextTurn() {
        if (this.state === GAME_STATE.GAME_OVER) return;

        const current = this.turnOrder[this.turnIndex];

        if (current === this.player) {
            this.state = GAME_STATE.PLAYER_TURN;
            this.player.isPlayerTurn = true;
            this.updateUI();
            return;
        }

        this.state = GAME_STATE.BOT_TURN;
        await this.playBotTurn(current);
    }

    async playsWholeTurn(hand, card) {
        if (this.state !== GAME_STATE.PLAYER_TURN) return;

        this.player.isPlayerTurn = false;
        this.lastPlayedCard = card;
        this.player.numberOfCardsPlayedThisRound++;

        this.playCard(hand, card);
        const botAccused = await this.botsMayCallLieOnPlayer();
        if (botAccused) return;
        this.advanceTurn();
    }

    async playBotTurn(bot) {
        const card = bot.chooseCardsToPlay(this.currentGameSuit, this.gameStack.length);
        this.lastPlayedCard = card;

        this.playCard(bot.cards, card);

        this.state = GAME_STATE.WAITING_DECISION;
        this.updateUI();

        const decision = await this.waitForPlayerDecision();

        if (decision === 'lie') {
            this.resolveLie(bot, this.player);
            return;
        }

        this.advanceTurn();
    }

    advanceTurn() {
        this.checkGameOver();
        if (this.state === GAME_STATE.GAME_OVER) return;

        this.turnIndex = (this.turnIndex + 1) % this.turnOrder.length;
        this.nextTurn();
    }

    /* ================= DÉCISION ================= */

    async botsMayCallLieOnPlayer() {
        if(this.player.numberOfCardsPlayedThisRound <= 1) return false;
        for (const bot of this.bots) {
            if (Math.random() < bot.botLieCallChance) {
                await this.resolveLie(this.player, bot);
                return true;
            }
        }
        return false;
    }


    waitForPlayerDecision() {
        return new Promise(resolve => {
            const cleanup = decision => {
                this.lieBtn.removeEventListener('click', onLie);
                this.passBtn.removeEventListener('click', onPass);
                resolve(decision);
            };

            const onLie = () => cleanup('lie');
            const onPass = () => cleanup('pass');

            this.lieBtn.addEventListener('click', onLie);
            this.passBtn.addEventListener('click', onPass);
        });
    }

    resolveLie(accusedPlayer, attackingPlayer) {
        this.state = GAME_STATE.ROUND_END;
        this.result = `Player : ${attackingPlayer.playerName} accused ${accusedPlayer.playerName} of lying `;
        if (this.lastPlayedCard.suit === this.currentGameSuit) {
            this.result += `${accusedPlayer.playerName} was telling the truth ! ${attackingPlayer.playerName} picks up.`;
            attackingPlayer.cards.push(...this.gameStack);
        } else {
            this.result += `${accusedPlayer.playerName} was lying! He picks up.`;
            accusedPlayer.numberOfTimeHeGotCaugthLying++;
            accusedPlayer.cards.push(...this.gameStack);
        }

        this.resultDiv.innerHTML = this.result;
        this.nextRoundBtn.style.display = 'inline-flex';
        this.updateUI();
    }

    nextRound() {
        this.gameStack = [];
        this.currentGameSuit = null;
        this.lastPlayedCard = null;
        this.resultDiv.innerHTML = '';
        this.player.numberOfCardsPlayedThisRound=0;

        this.state = GAME_STATE.PLAYER_TURN;
        this.turnIndex = 0;

        this.nextRoundBtn.style.display = 'none';
        this.updateUI();
        this.nextTurn();
    }

    /* ================= FIN DE PARTIE ================= */

    checkGameOver() {
        let tldFile = mediaList.filter(e => e.name==='cbqp.mp4')[0];
        if (this.player.cards.length === 0) {
            this.endGame(`Congratulation, you won, the password for ${tldFile.name} is ${atob(tldFile.password)} 🎉`);
        } else if (this.bots.some(bot => bot.cards.length === 0)) {
            this.endGame('Bots won 🤖');
        }
    }

    endGame(message) {
        this.state = GAME_STATE.GAME_OVER;
        this.resultDiv.innerHTML = message;
        this.newGameBtn.style.display = 'inline-flex';

        this.renderShowedHandOnDiv(this.gameStack, this.centralPileDiv);
        this.renderShowedHandOnDiv(this.player.cards, this.player.playerCardDiv);
        this.bots.forEach(bot =>
            this.renderShowedHandOnDiv(bot.cards, bot.playerCardDiv)
        );
    }

    /* ================= UI ================= */

    updateUI() {
        this.renderShowedHandOnDiv(this.player.cards, this.player.playerCardDiv);
        this.shouldMakePlayerCardsActivable(
            this.state === GAME_STATE.PLAYER_TURN
        );

        this.bots.forEach(bot =>
            this.renderHiddenHandOnDiv(bot.cards, bot.playerCardDiv)
        );

        this.gameColorNameDiv.innerHTML =
            this.currentGameSuit ?? 'Aucune couleur';

        this.renderHiddenHandOnDiv(this.gameStack, this.centralPileDiv);
        if(this.state===GAME_STATE.ROUND_END) {
            this.renderShowedHandOnDiv(this.gameStack, this.centralPileDiv);
        }

        const showDecision = this.state === GAME_STATE.WAITING_DECISION;
        this.lieBtn.style.display = showDecision ? 'inline-flex' : 'none';
        this.passBtn.style.display = showDecision ? 'inline-flex' : 'none';
    }

    shouldMakePlayerCardsActivable(active) {
        this.player.playerCardDiv
            .querySelectorAll('.card-img')
            .forEach(card =>
                card.classList.toggle('disabled', !active)
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
        if (!div) return;

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
                if (hand !== this.player.cards) return;
                await this.playsWholeTurn(hand, card);
            });

            div.appendChild(img);
        });
    }

    /* ================= LOGIQUE DE CARTE ================= */

    playCard(hand, card) {
        if (!this.currentGameSuit) {
            this.currentGameSuit = card.suit;
        }

        const index = hand.indexOf(card);
        if (index !== -1) {
            hand.splice(index, 1);
        }

        this.gameStack.push(card);
        this.updateUI();
    }
}
