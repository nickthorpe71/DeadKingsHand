import {createPlayerData} from '../entities/player';
import {createBoard} from '../entities/board';
import {createSocket, subscribeSocketToEvents} from '../systems/socket';

const playerDataRequest = require('../data/mockPlayer.json');
const mockOpponent = require('../data/mockPlayer.json');

export default class OnlineMatch extends Phaser.Scene {
    constructor() {
        super({
            key: 'OnlineMatch'
        });
    }

    preload() {
        this.load.image('cardBack', 'src/assets/CardBack.png');
        this.load.image('mockCardBlue', 'src/assets/MockCardBlue.png');
        this.load.image('mockCardRed', 'src/assets/MockCardRed.png');

        this.objects = {};
    }

    create() {
        const self = this;

        createCamera(self);
        self.player = createPlayerData(playerDataRequest.name, playerDataRequest.deck);
        self.opponent = createPlayerData(mockOpponent.name, mockOpponent.deck);
        self.board = createBoard(self, 720, 720);

        // create input events

        self.socket = createSocket('http://localhost:3000');
        subscribeSocketToEvents(socket, self);

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
            self.socket.emit('cardPlayed', card, self.isLocalPlayer, xQuadrant, yQuadrant);
        });
    }
}

function createCamera(scene) {
    scene.objects.camera = this.cameras.add(0, 0, 1280, 950);
    scene.objects.camera.setBackgroundColor('#d6c56f');
}
