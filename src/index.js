import Phaser from 'phaser';
import OnlineMatch from './scenes/onlineMatch';
import Title from './scenes/title';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1280,
    height: 950,
    scene: [
        OnlineMatch,
        Title
    ]
};

const game = new Phaser.Game(config);