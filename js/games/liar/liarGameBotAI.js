import LiarGamePlayer from "./liarGamePlayer.js";

export default class LiarGameBotAI extends LiarGamePlayer {

    constructor(botName, lieChance, botCardsDiv) {
        super(botName, botCardsDiv);
        this.botLieCallChance = 0.15;
        this.botLiePlayChance = 0.33;
        this.cards = [];
    }

    chooseCardsToPlay(currentRank, cardsPlayedThisRound) {
        const lieChance = this.calculateLyingChances(cardsPlayedThisRound);
        this.cards.forEach(card => console.log(card.toString()))
        console.log(`Bot ${this.playerName} has a ${Math.round(lieChance * 100)}% chance to lie this turn.`);
        const willLieThisTurn = Math.random() < lieChance;

        let possibleCards = this.cards.filter(card => {
            if (willLieThisTurn) return card.suit !== currentRank;
            return card.suit === currentRank;
        });

        if (possibleCards.length === 0) {
            return this.cards[Math.floor(Math.random() * this.cards.length)];
        }

        return possibleCards[Math.floor(Math.random() * possibleCards.length)];
    }


    calculateLyingChances(cardsPlayedThisRound) {
        let chance = this.botLiePlayChance
            - (this.numberOfTimeHeGotCaugthLying * 0.05)
            - (cardsPlayedThisRound * 0.02);
        return Math.max(0, Math.min(1, chance));
    }
}