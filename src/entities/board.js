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

// TODO: need to refactor so its less confusing
// Shouldn't be passing in width OR height
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
