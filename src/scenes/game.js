import Card from '../helpers/card';
import Zone from '../helpers/zone';
import Dealer from '../helpers/dealer';

import io from 'socket.io-client';

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

        this.isPlayerA = false;
        this.opponentCards = [];

        // DropZone
        this.board = new Zone(this);
        this.dropZone = this.board.renderZone();
        this.outline = this.board.renderOutline(this.dropZone);

        // Dealer
        this.dealer = new Dealer(this);

        // Socket 
        this.socket = io('http://localhost:3000', {transports : ["websocket"] })
        this.socket.on('connect', () => {
            console.log('connected to server');
        });
        this.socket.on('isPlayerA', () => {
            self.isPlayerA = true;
        });
        this.socket.on('dealCards', () => {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        });
        this.socket.on('cardPlayed', (card, isPlayerA) => {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = card.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cardsLayed++;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cardsLayed * 50)), (self.dropZone.y), sprite).disableInteractive();
            }
        });

        this.dealText = this.add.text(600, 875, ['Deal Cards']).setFontSize(22).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealText.on('pointerdown', () => {
            self.socket.emit('dealCards');
        });

        this.dealText.on('pointerover', () => {
            self.dealText.setColor('#ff69bf');
        });

        this.dealText.on('pointerout', () => {
            self.dealText.setColor('#00ffff');
        });

        this.input.on('dragstart', (pointer, card) => {
            card.setTint(0xff69b4);
            self.children.bringToTop(card);
        });

        this.input.on('dragend', (pointer, card, dropped) => {
            card.setTint();
            if (!dropped) {
                card.x = card.input.dragStartX;
                card.y = card.input.dragStartY;
            }
        });

        this.input.on('drag', (pointer, card, dragX, dragY) => {
            card.x = dragX;
            card.y = dragY;
        });

        this.input.on('drop', (pointer, card, dropZone) => {
            self.dropZone.data.values.cardsLayed++;

            const xQuadrant = self.board.calcQuadrant(pointer.upX, 280, this.board.width);
            const yQuadrant = self.board.calcQuadrant(pointer.upY, 125, this.board.height);

            // TODO: need to create a card struct and use it to save card data
            // could use existing Card class
            self.dropZone.data.values.cards[yQuadrant][xQuadrant] = card;
            console.log(self.dropZone.data.values.cards);

            card.x = xQuadrant * 180 + 365;
            card.y = yQuadrant * 180 + 232;
            
            card.disableInteractive();
            self.socket.emit('cardPlayed', card, self.isPlayerA);
        });
    }

    // update() {

    // }
}
