import { updateBoard } from "./board"
import { createCard } from '../entities/card';
import { instantiateGameObject } from "../systems/gameEvents";

export function createPlayerData(name, deck, color = 'red', hand = [], isLocalPlayer = false) {
    return Object.freeze({
        name,
        deck,
        color,
        hand,
        isLocalPlayer,
    })
}

/**
 * 
 * @param {Object} playedCard card gameObject
 * @param {Array} hand an array of cards
 * @param {Array} board a matrix of cards
 * @returns A new player hand array
 */
export function playCard(playedCard, hand, board) {
    updateBoard(board, playedCard);

    const indexToRemove = hand.indexOf(playedCard);
    return hand.filter((card, index) => index === indexToRemove);
}

export function dealPlayerHand(scene, deck, player) {
    return deck.map((cardData, index) => {
        const handDistanceFromTop = 250;
        // determine which x position to render hand
        const handPosition = player.isLocalPlayer ? 1135 : 145;
        const card = createCard(...cardData, 0, 0, player.color, player.color);
        return instantiateGameObject(
            scene,
            handPosition, 
            handDistanceFromTop + (index * 60),
            card.image,
            card,
            0.246,
            0.246,
            isLocalPlayer,
            isLocalPlayer
        )
    });
}