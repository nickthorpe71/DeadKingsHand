import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.numCardsToDeal = 8;
        this.dealCards = () => {
            for (let i = 0; i < scene.myHand.length; i++) {
                // TODO: add background color check here
                scene.myHand[i].render(1135, 250 + (i * 60), scene.myHand[i].image);

                let opponentCard = new Card(scene);
                scene.opponentCardBacks.push(opponentCard.render(145, 250 + (i * 60), 'cardBack').disableInteractive());
            }
        }
    }
}