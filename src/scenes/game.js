import Card from '../entities/card';
import Zone from '../entities/zone';
import Dealer from '../entities/dealer';
import {createPlayerData} from '../entities/player';

import io from 'socket.io-client';

import randomInt from '../entities/utils';

// only contains card backs as this player will not need to 
// know about their opponents card data until a card is played
const opponentHand = [];

const playerHand = createRandomHandData();
const playerData = createPlayerData();

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        this.load.image('cardBack', 'src/assets/CardBack.png');
        this.load.image('mockCardBlue', 'src/assets/MockCardBlue.png');
        this.load.image('mockCardRed', 'src/assets/MockCardRed.png');

        this.objects = {};
    }

    create() {
        let self = this;

        // Camera
        this.objects.camera = this.cameras.add(0, 0, 1280, 950);
        this.objects.camera.setBackgroundColor('#d6c56f');

        // DropZone & Board
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
            playerData.isPlayerA = true;
            this.myHand = this.loadRandomCards();
            this.enableDealing();
        });

        this.socket.on('dealCards', () => {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        });
        this.socket.on('cardPlayed', (gameObject, isPlayerA, xQuadrant, yQuadrant) => {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;

                self.opponentCards.shift().destroy();

                self.dropZone.data.values.cardsLayed++;
                gameObject.data.test = 'test'
                self.dropZone.data.values.cards[yQuadrant][xQuadrant] = gameObject;
                console.log(self.dropZone.data.values.cards);

                let card = new Card(self);
                card.render(xQuadrant * 180 + 370, yQuadrant * 180 + 205, sprite).disableInteractive();
            }
        });

        // Input
        this.input.on('dragstart', (pointer, card) => {
            card.setTint(0x5ee0cc);
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
            
            self.dropZone.data.values.cards[yQuadrant][xQuadrant] = card;

            card.x = xQuadrant * 180 + 370;
            card.y = yQuadrant * 180 + 205;
            
            card.disableInteractive();
            self.socket.emit('cardPlayed', card, self.isPlayerA, xQuadrant, yQuadrant);
        });
    }

    enableDealing() {
        this.dealText = this.add.text(600, 875, ['Deal Cards']).setFontSize(22).setFontFamily('Trebuchet MS').setColor('#222').setInteractive();

        this.dealText.on('pointerdown', () => {
            this.socket.emit('dealCards');
        });

        this.dealText.on('pointerover', () => {
            this.dealText.setColor('#5ee0cc');
        });

        this.dealText.on('pointerout', () => {
            this.dealText.setColor('#222');
        });
    }

    // update() {}
}

function createRandomHandData() {
    const mockHand = []

    for (let i = 0; i < 8; i++) {
        const cardBack = (this.isPlayerA) ? 'mockCardBlue' : 'mockCardRed';
        const newCard = Card.createCardData(
            'mock card',
            randomInt(2,13),
            randomInt(2,13),
            randomInt(1,4),
            randomInt(1,4),
            randomInt(1,4),
            randomInt(1,4),
            cardBack
        );
        mockHand.push(newCard);
    }

    return mockHand;
}

function instantiateGameObject(scene, x, y, sprite, data = {}, heightScale = 1, widthScale = 1, interactive = true, draggable = true) {
    const newGameObject = scene.add.image(x, y, sprite).setScale(heightScale, widthScale);

    if (interactive) newGameObject.setInteractive();
    if (draggable) newGameObject.setDraggable(newGameObject);

    scene.input.setDraggable(card);
    newGameObject.data = data;

    return newGameObject;
}

function dealCards(scene, xPos, handData = {}, numCardsToDeal = 8) {
    const rightPlayerHandXPos = 1135;
    const leftPlayerHandXpos = 145;
    const handDistanceFromTop = 250;

    for (let i = 0; i < numCardsToDeal; i++) {
        // TODO: add background color check here
        playerHand.myHand[i].render(rightPlayerHandXPos, handDistanceFromTop + (i * 60), scene.myHand[i].image);

        const opponentCard =  instantiateGameObject(
            scene, 
            leftPlayerHandXpos, 
            handDistanceFromTop + (i * 60),
            'cardBack',
            0.246,
            0.246,
            false,
            false
            )
        opponentHand.push(opponentCard.render(leftPlayerHandXpos, handDistanceFromTop + (i * 60), 'cardBack').disableInteractive());
    }
}

function dealCards(scene, xPos, deckData = {}, numCardsToDeal = 8) {
    const handDistanceFromTop = 250;

    for (let i = 0; i < numCardsToDeal; i++) {
        // TODO: add background color check here
        playerHand.myHand[i].render(rightPlayerHandXPos, handDistanceFromTop + (i * 60), scene.myHand[i].image);

        const opponentCard =  instantiateGameObject(
            scene, 
            xPos, 
            handDistanceFromTop + (i * 60),
            'cardBack',
            0.246,
            0.246,
            false,
            false
            )
        opponentHand.push(opponentCard.render(leftPlayerHandXpos, handDistanceFromTop + (i * 60), 'cardBack').disableInteractive());
    }
}