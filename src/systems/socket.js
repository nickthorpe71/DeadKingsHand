import io from 'socket.io-client';
import { addCardToBoard } from '../entities/board';
import { dealPlayerHand } from '../entities/player';
import { enableDealing } from './gameEvents';
import { instantiateCard } from '../entities/card';
import { updateScores, renderScores } from './gameEvents';

export function createSocket(uri) {
    // return io(uri, {transports : ["websocket"] })
    return io(uri, {transports : ["websocket"] })
}

export function subscribeSocketToEvents(socket, scene) {
    
    socket.on('connect', () => {
        console.log('connected to server');
    });

    socket.on('isPlayerA', () => {
        scene.localPlayer = {...scene.localPlayer, color: 'blue', isPlayerA: true};
        scene.mockOpponent = {...scene.mockOpponent, color: 'red'};

        enableDealing(scene);
    });

    socket.on('dealCards', () => {
        scene.localPlayer = {...scene.localPlayer, hand: dealPlayerHand(scene, scene.localPlayer.deck, scene.localPlayer)};
        scene.mockOpponent = {...scene.mockOpponent, hand: dealPlayerHand(scene, scene.mockOpponent.deck, scene.mockOpponent)};
        if (scene.dealText)
            scene.dealText.disableInteractive();
        renderScores(scene);
    });

    socket.on('cardPlayed', (card, cardData, isPlayerA, xQuadrant, yQuadrant) => {
        // if the other player plays a card
        if (isPlayerA !== scene.localPlayer.isPlayerA) {
            const newCardData = cardData;
            const updatedCard = instantiateCard(scene, 0, 0, newCardData, false);
            addCardToBoard(scene, false, updatedCard, xQuadrant, yQuadrant);
        }

        updateScores(scene);
    });
}
