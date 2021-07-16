import { GameObjects } from "phaser";

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

        this.card = this.add.image(300, 300, 'cyanCardFront').setScale(0.3, 0.3).setInteractive();

        this.input.setDraggable(this.card);

        this.dealCards = () => {

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