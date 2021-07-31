// Entities
import {createPlayerData} from '../entities/player';
import {createBoard} from '../entities/board';

// Event Systems
import {createSocket, subscribeSocketToEvents} from '../systems/socket';
import {subscribeToLocalCardInputEvents} from '../systems/cardInput';

// Mock API calls
const playerDataRequest = require('../data/mockPlayer.json');

const mockOpponent = require('../data/mockOpponent.json');

// Use this example to switch to function instead of class
// https://phaser.io/examples/v3/view/game-objects/container/draggable-container

export default class OnlineMatch extends Phaser.Scene {
    constructor() {
        super({
            key: 'OnlineMatch'
        });
    }

    preload() {
        this.load.image('cardBack', 'src/assets/CardBack.png');
        this.load.image('redBG', 'src/assets/RedCardBack.png');
        this.load.image('blueBG', 'src/assets/BlueCardBack.png');
        this.load.image('gambler', 'src/assets/gambler.png');
        this.load.image('gris', 'src/assets/gris.png');
        this.load.image('maid', 'src/assets/maid.png');
        this.load.image('puke', 'src/assets/puke.png');

        // this.load.image('mockCardBlue', 'src/assets/MockCardBlue.png');
        // this.load.image('mockCardRed', 'src/assets/MockCardRed.png');

        this.objects = {};
    }

    create() {
        const self = this;
        this.count = 0;

        // Systems
        self.socket = createSocket('http://localhost:3000');
        subscribeSocketToEvents(self.socket, self);
        subscribeToLocalCardInputEvents(self);

        // Entities
        createCamera(self);
        self.localPlayer = createPlayerData(playerDataRequest.name, playerDataRequest.deck, true, 0);
        self.mockOpponent = createPlayerData(mockOpponent.name, mockOpponent.deck, false, 0);
        self.board = createBoard(self, 720, 720);
    }

    // update() {
    // }
}

function createCamera(scene) {
    scene.objects.camera = scene.cameras.add(0, 0, 1280, 950);
    scene.objects.camera.setBackgroundColor('#d6c56f');
}
