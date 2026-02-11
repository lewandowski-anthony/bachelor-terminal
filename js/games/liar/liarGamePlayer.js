import CardPlayer from '../common/cardPlayer.js';

export default class LiarGameBotAI extends CardPlayer {

    constructor(playerCardDiv) {
        super();
        this.playerCardDiv = playerCardDiv;
        this.isPlayerTurn = true;
    }

}