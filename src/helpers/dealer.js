import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.numCardsToDeal = 8;
        this.dealCards = () => {
            let playerSprite;
            let opponentSprite;

            // Determine player colors
            if (scene.isPlayerA) {
                playerSprite = 'cyanCardFront';
                opponentSprite = 'magentaCardBack';
            } else {
                playerSprite = 'magentaCardFront';
                opponentSprite = 'cyanCardBack';
            }

            for (let i = 0; i < this.numCardsToDeal; i++) {
                let playerCard = new Card(scene);
                playerCard.render(1135, 250 + (i * 60), playerSprite);

                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(145, 250 + (i * 60), opponentSprite).disableInteractive());
            }
        }
    }
}