import io from 'socket.io-client';
import { createPlayerData, dealPlayerHand } from '../entities/player';
import { enableDealing } from './gameEvents';

export function createSocket(uri) {
    return io(uri, {transports : ["websocket"] })
}

export function subscribeSocketToEvents(socket, scene) {
    
    socket.on('connect', () => {
        console.log('connected to server');
    });

    socket.on('isLocalPlayer', () => {
        scene.player = createPlayerData(scene.player.name, scene.player.deck, 'blue', [], true);
        enableDealing(scene);
    });

    socket.on('dealCards', () => {
        scene.player = createPlayerData(
            scene.player.name, 
            scene.player.deck, 
            scene.player.color, 
            dealPlayerHand(scene, scene.player.deck, scene.player),
            scene.player.isLocalPlayer
        );

        scene.opponent = createPlayerData(
            scene.opponent.name, 
            scene.opponent.deck, 
            scene.opponent.color, 
            dealPlayerHand(scene, scene.opponent.deck, scene.opponent),
            scene.opponent.isLocalPlayer
        );

        scene.dealText.disableInteractive();
    });

    socket.on('cardPlayed', (gameObject, isLocalPlayer, xQuadrant, yQuadrant) => {
        if (isLocalPlayer !== scene.isLocalPlayer) {
            let sprite = gameObject.textureKey;

            scene.opponentCards.shift().destroy();

            scene.dropZone.data.values.cardsLayed++;
            scene.dropZone.data.values.cards[yQuadrant][xQuadrant] = gameObject;

            let card = new Card(self);
            card.render(xQuadrant * 180 + 370, yQuadrant * 180 + 205, sprite).disableInteractive();
        }
    });
}
