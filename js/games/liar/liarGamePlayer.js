import CardPlayer from '../common/cardPlayer.js';

export default class LiarGameBotAI extends CardPlayer {

    constructor(playerName, playerCardDiv) {
        super(playerName);
        this.playerCardDiv = playerCardDiv;
        this.isPlayerTurn = true;
        this.numberOfCardsPlayedThisRound = 0;
        this.numberOfTimeHeGotCaugthLying = 0;
    }

}