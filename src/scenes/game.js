import Card from '../helpers/card';
import Zone from '../helpers/zone';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        this.load.image('cyanCardFront', 'src/assets/cyanCardFront.png');
        this.load.image('cyanCardBack', 'src/assets/cyanCardBack.png');
        this.load.image('magentaCardFront', 'src/assets/magentaCardFront.png');
        this.load.image('magentaCardBack', 'src/assets/magentaCardBack.png');
    }

    create() {
        let self = this;

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.dealCards = () => {
            for (let i = 0; i < 5; i++) {
                let playerCard = new Card(this);
                playerCard.render(475 + (i*100), 650, 'cyanCardFront');
            }
        }

        this.dealText = this.add.text(75, 350, ['Deal Cards']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealText.on('pointerdown', () => {
            self.dealCards();
        });

        this.dealText.on('pointerover', () => {
            self.dealText.setColor('#ff69bf');
        });

        this.dealText.on('pointerout', () => {
            self.dealText.setColor('#00ffff');
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
    }

    // update() {

    // }
}