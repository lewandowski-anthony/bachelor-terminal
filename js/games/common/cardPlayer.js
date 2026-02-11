export default class CardPlayer {

    constructor() {
        if(new.target === CardPlayer) {
            throw new Error("CardBotAI is abstract and cannot be instantiated directly.");
        }
        this.cards = [];
    }

}