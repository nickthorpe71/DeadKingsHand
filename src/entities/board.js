import { createCardData } from "./card";
import { createPlayerData, removeCardFromHand } from "./player";
import { instantiateGameObject } from "../systems/gameEvents";

export function createBoardData(cardsLayed = 0, cards = [
    [null, null,  null, null],
    [null, null,  null, null],
    [null, null,  null, null],
    [null, null,  null, null]
]) {
    return Object.freeze({ cardsLayed, cards});
}

export function createBoard (scene, width, height) {
    // x,y,width,height
    const dropZone = scene.add.zone(640, 475, width, height).setRectangleDropZone(width, height);

    const dropZoneOutline = scene.add.graphics();
    dropZoneOutline.lineStyle(2, 0x222222);
    dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width/2, dropZone.y - dropZone.input.hitArea.height/2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);

    dropZone.setData(createBoardData(0));

    return dropZone;
};

export function updatedCardsLayed(board) {
    return board.data.values.cardsLayed + 1
}

export function updatedBoardCards(board, newCard) {
    return board.data.values.cards.map((currentBoardRow, yPos) => {
        return board.data.values.cards[yPos].map((currentBoardSlotItem, xPos) => {
            if (yPos === newCard.data.yQuadrant && xPos === newCard.data.xQuadrant)
                return newCard;
            return currentBoardSlotItem;
        });
    });
};

export function calcQuadrant(pointerDown, edgeComp, widthOrHeight) {
    // compensate for the distance between the left most edge 
    // of the screen and the left or right most edge of the board
    const placed = (pointerDown - edgeComp);
    let quadrant = 0;

    if (placed < widthOrHeight * 0.25)
        quadrant = 0;
    else if (placed < widthOrHeight * 0.5)
        quadrant = 1;
    else if (placed < widthOrHeight * 0.75)
        quadrant = 2;
    else if (placed < widthOrHeight)
        quadrant = 3;

    return quadrant;
}

export function addCardToBoard(scene, isLocalPlayer, card, xQuadrant, yQuadrant) {
    // calculate position of new card
    const xPos = xQuadrant * 180 + 370;
    const yPos = yQuadrant * 180 + 205;

    // set quadrants of card
    card.data = createCardData(
        card.data.name,
        card.data.attack,
        card.data.defence,
        card.data.up,
        card.data.right,
        card.data.down,
        card.data.left,
        card.data.image,
        xQuadrant,
        yQuadrant,
        card.data.ownerColor,
        card.data.currentColor,
    )
    
    if (isLocalPlayer) {
        // remove card from players hand
        scene.player = createPlayerData(
            scene.player.name, 
            scene.player.deck, 
            scene.player.isLocalPlayer,
            scene.player.color, 
            removeCardFromHand(scene.player.hand.indexOf(card), scene.player.hand),
            scene.player.isPlayerA
        );
        
        // snap card to board slot
        card.x = xPos;
        card.y = yPos;
    } else {
        // remove card from opponents mock hand
        scene.opponent = createPlayerData(
            scene.opponent.name,
            scene.opponent.deck,
            scene.opponent.isLocalPlayer,
            scene.opponent.color,
            removeCardFromHand(scene.opponent.hand.length-1, scene.opponent.hand),
            scene.opponent.isPlayerA
        );
        
        instantiateGameObject(scene, xPos, yPos, card.data, card.data.heightScale, card.data.widthScale, false, false);
    }

    // add card to board data 
    scene.board.data.values = createBoardData(
        updatedCardsLayed(scene.board),
        updatedBoardCards(scene.board, card)
    );
}
