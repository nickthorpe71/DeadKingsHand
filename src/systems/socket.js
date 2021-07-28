import io from 'socket.io-client';
import { addCardToBoard } from '../entities/board';
import { dealPlayerHand } from '../entities/player';
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

        scene.localPlayer = {...scene.localPlayer, deck: playerDeckColorAdjust, color: 'blue', isPlayerA: true};
        enableDealing(scene);
    });

    socket.on('dealCards', () => {
        scene.localPlayer = {...scene.localPlayer, hand: dealPlayerHand(scene, scene.localPlayer.deck, scene.localPlayer)};
        scene.mockOpponent = {...scene.mockOpponent, hand: dealPlayerHand(scene, scene.mockOpponent.deck, scene.mockOpponent)};
    });

    socket.on('cardPlayed', (card, cardData, isPlayerA, xQuadrant, yQuadrant) => {
        // if the other player plays a card
        if (isPlayerA !== scene.localPlayer.isPlayerA) {
            const updatedCard = instantiateGameObject(scene, 0, 0, card.textureKey, cardData, cardData.heightScale, cardData.widthScale, false, false);
            addCardToBoard(scene, false, updatedCard, xQuadrant, yQuadrant);
        }
    });
}
