import io from 'socket.io-client';
import { addCardToBoard } from '../entities/board';
import { createPlayerData, dealPlayerHand } from '../entities/player';
import { enableDealing, instantiateGameObject } from './gameEvents';

export function createSocket(uri) {
    return io(uri, {transports : ["websocket"] })
}

export function subscribeSocketToEvents(socket, scene) {
    
    socket.on('connect', () => {
        console.log('connected to server');
    });

    socket.on('isPlayerA', () => {
        // Will need to change to only adjust the background of the card
        const playerDeckColorAdjust = scene.localPlayer.deck.map(card => {
            return {
                name:card.name, 
                attack: card.attack, 
                defense: card.defense, 
                up: card.up, 
                right: card.right, 
                down: card.down, 
                left: card.left, 
                image: "mockCardBlue"
            }
        });

        scene.localPlayer = createPlayerData(scene.localPlayer.name, playerDeckColorAdjust, scene.localPlayer.isLocalPlayer, scene.localPlayer.score, 'blue', [], true);
        enableDealing(scene);
    });

    socket.on('dealCards', () => {
        scene.localPlayer = createPlayerData(
            scene.localPlayer.name, 
            scene.localPlayer.deck, 
            scene.localPlayer.isLocalPlayer,
            scene.localPlayer.score,
            scene.localPlayer.color, 
            dealPlayerHand(scene, scene.localPlayer.deck, scene.localPlayer),
            scene.localPlayer.isPlayerA
        );

        scene.mockOpponent = createPlayerData(
            scene.mockOpponent.name, 
            scene.mockOpponent.deck, 
            scene.mockOpponent.isLocalPlayer,
            scene.mockOpponent.score, 
            scene.mockOpponent.color, 
            dealPlayerHand(scene, scene.mockOpponent.deck, scene.mockOpponent),
            scene.mockOpponent.isPlayerA
        );
    });

    socket.on('cardPlayed', (card, cardData, isPlayerA, xQuadrant, yQuadrant) => {
        // if the other player plays a card
        if (isPlayerA !== scene.localPlayer.isPlayerA) {
            const updatedCard = instantiateGameObject(scene, 0, 0, card.textureKey, cardData, cardData.heightScale, cardData.widthScale, false, false);
            addCardToBoard(scene, false, updatedCard, xQuadrant, yQuadrant);
        }
    });
}
