import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.numCardsToDeal = 8;
        this.dealCards = () => {
            let playerSprite;

            // Determine player colors
            if (scene.isPlayerA) {
                playerSprite = 'mockCardBlue';
            } else {
                playerSprite = 'mockCardRed';
            }

            for (let i = 0; i < scene.myHand.length; i++) {
                scene.myHand[i].render(1135, 250 + (i * 60), playerSprite);

                let opponentCard = new Card(scene);
                scene.opponentCardBacks.push(opponentCard.render(145, 250 + (i * 60), 'cardBack').disableInteractive());
            }
        }
    }
}