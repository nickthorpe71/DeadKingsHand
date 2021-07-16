import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let playerSprite;
            let opponentSprite;
            if (scene.isPlayerA) {
                playerSprite = 'cyanCardFront';
                opponentSprite = 'magentaCardBack';
            } else {
                playerSprite = 'magentaCardFront';
                opponentSprite = 'cyanCardBack';
            }
        }
    }
}