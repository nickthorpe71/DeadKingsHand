import { updateBoard } from "./board";

export function createCardData(name, attack, defense, up, right, down, left, image, xQuadrant, yQuadrant, ownerColor, currentColor) {
    return Object.freeze({
        name, 
        attack, 
        defense, 
        up, 
        right, 
        down, 
        left, 
        image,
        xQuadrant,
        yQuadrant,
        ownerColor,
        currentColor,
        heightScale: 0.246,
        widthScale: 0.246,
    });
}

export function playInteraction(board, attacker, defender) {
    // compare attacker and defender to determine if the attack was a success
    const victoryColor = (attacker.attack > defender.defense) ? attacker.currentColor : defender.currentColor;

    // update attacker & defender
    const updatedAttacker = createCardData(
        attacker.name, 
        attacker.attack, 
        attacker.defense, 
        attacker.up, 
        attacker.right, 
        attacker.down, 
        attacker.left, 
        attacker.image,
        attacker.xQuadrant,
        attacker.yQuadrant,
        attacker.ownerColor,
        victoryColor,
        attacker.heightScale,
        attacker.widthScale,
    )
    const updatedDefender = createCardData(
        defender.name, 
        defender.attack, 
        defender.defense, 
        defender.up, 
        defender.right, 
        defender.down, 
        defender.left, 
        defender.image,
        defender.xQuadrant,
        defender.yQuadrant,
        defender.ownerColor,
        victoryColor,
        defender.heightScale,
        defender.widthScale,
    )    
    
    // update board
    // TODO: There is probably a cleaner way to do this
    const updatedBoardAttk = updateBoard(board, updatedAttacker);
    const updatedBoardFinal = updateBoard(updatedBoardAttk, updatedDefender);

    return updatedBoardFinal;
}

