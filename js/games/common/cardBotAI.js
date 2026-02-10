export default class CardBotAI {

    constructor() {
        if(new.target === CardBotAI) {
            throw new Error("CardBotAI is abstract and cannot be instantiated directly.");
        }
        this.cards = [];
    }
    
}