import Phaser from 'phaser';
import Game from './scenes/game';
import Title from './scenes/title';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1280,
    height: 950,
    scene: [
        Game,
        Title
    ]
};

const game = new Phaser.Game(config);