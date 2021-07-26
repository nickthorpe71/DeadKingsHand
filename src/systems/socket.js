import io from 'socket.io-client';
import { incrementBoardCardsLayed } from '../entities/board';
import { createPlayerData, dealPlayerHand, removeCardFromHand } from '../entities/player';
import { enableDealing } from './gameEvents';

export function createSocket(uri) {
    return io(uri, {transports : ["websocket"] })
}

export function subscribeSocketToEvents(socket, scene) {
    
    socket.on('connect', () => {
        console.log('connected to server');
    });

    socket.on('isPlayerA', () => {
        // Will need to change to only adjust the background of the card
        const playerDeckColorAdjust = scene.player.deck.map(card => {
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
        })

        scene.player = createPlayerData(scene.player.name, playerDeckColorAdjust, scene.player.isLocalPlayer, 'blue', [], true);
        enableDealing(scene);
        
        

    });

    socket.on('dealCards', () => {
        scene.player = createPlayerData(
            scene.player.name, 
            scene.player.deck, 
            scene.player.isLocalPlayer,
            scene.player.color, 
            dealPlayerHand(scene, scene.player.deck, scene.player),
            scene.player.isPlayerA
        );

        scene.opponent = createPlayerData(
            scene.opponent.name, 
            scene.opponent.deck, 
            scene.opponent.isLocalPlayer,
            scene.opponent.color, 
            dealPlayerHand(scene, scene.opponent.deck, scene.opponent),
            scene.opponent.isPlayerA
        );

        scene.dealText.disableInteractive();
    });

    socket.on('cardPlayed', (gameObject, isPlayerA, xQuadrant, yQuadrant) => {
        // if the other player plays a card
        if (isPlayerA !== scene.player.isPlayerA) {
            const sprite = gameObject.textureKey;

            scene.opponent = createPlayerData(
                scene.opponent.name,
                scene.opponent.deck,
                scene.opponent.isLocalPlayer,
                scene.opponent.color,
                removeCardFromHand(scene.opponent.hand.length-1, scene.opponent.hand),
                scene.opponent.isPlayerA
            )

            incrementBoardCardsLayed(scene.board);

            // Lay card and play out recursive events

            // scene.dropZone.data.values.cards[yQuadrant][xQuadrant] = gameObject;
            // const card = new Card(self);
            // card.render(xQuadrant * 180 + 370, yQuadrant * 180 + 205, sprite).disableInteractive();
        }
    });
}
