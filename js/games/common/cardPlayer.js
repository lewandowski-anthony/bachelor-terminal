export default class CardPlayer {

    constructor(playerName) {
        if(new.target === CardPlayer) {
            throw new Error("CardBotAI is abstract and cannot be instantiated directly.");
        }
        this.cards = [];
        this.playerName = playerName;
    }

}