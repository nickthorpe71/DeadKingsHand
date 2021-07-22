import { updateBoard } from "./board"

export function createPlayerData(name, deck, color = 'red', hand = [], isPlayerA = false) {
    return {
        name,
        deck,
        color,
        hand,
        isPlayerA,
    }
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