import { attackSuccess, flipCard } from "./card";
import { createPlayerData, removeCardFromHand } from "./player";

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
            if (yPos === newCard.data.values.yQuadrant && xPos === newCard.data.values.xQuadrant)
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
    // snap card to board slot
    card.x = xQuadrant * 180 + 370;
    card.y = yQuadrant * 180 + 205;
    
    if (isLocalPlayer) {
        // remove card from players hand
        scene.localPlayer = createPlayerData(
            scene.localPlayer.name,
            scene.localPlayer.deck,
            scene.localPlayer.isLocalPlayer,
            scene.localPlayer.score,
            scene.localPlayer.color,
            removeCardFromHand(scene.localPlayer.hand.indexOf(card), scene.localPlayer.hand),
            scene.localPlayer.isPlayerA
        );
    } else {
        // remove top placeholder card from opponents hand
        scene.mockOpponent.hand[0].destroy();

        scene.mockOpponent = createPlayerData(
            scene.mockOpponent.name,
            scene.mockOpponent.deck,
            scene.mockOpponent.isLocalPlayer,
            scene.mockOpponent.score,
            scene.mockOpponent.color,
            removeCardFromHand(0, scene.mockOpponent.hand),
            scene.mockOpponent.isPlayerA
        );
    }

    // add card to board data 
    scene.board.setData(createBoardData(
        updatedCardsLayed(scene.board),
        updatedBoardCards(scene.board, card)
    ));
    
    // trigger attack to new cards surrounding neighbors
    attackNeighbors(scene, card, scene.board)

    return card;
}

export function attackNeighbors(scene, card, board) {
    const navPointerMap = [
        { yAdjust:-1, xAdjust: 0, attackDirection: 'up', defendDirection: 'down' },
        { yAdjust: 0, xAdjust: 1, attackDirection: 'right', defendDirection: 'left' },
        { yAdjust: 1, xAdjust: 0, attackDirection: 'down', defendDirection: 'up' },
        { yAdjust: 0, xAdjust: -1, attackDirection: 'left', defendDirection: 'right' },
    ];

    navPointerMap.forEach(navPointer => {
        if (board.data.values.cards[card.data.values.yQuadrant + navPointer.yAdjust]) {
            const target = board.data.values.cards[card.data.values.yQuadrant + navPointer.yAdjust][card.data.values.xQuadrant + navPointer.xAdjust];

            if (target && target.data.values.currentColor !== card.data.values.currentColor
                && attackSuccess(card.data.values, target.data.values, navPointer.attackDirection, navPointer.defendDirection)) {
                board.setData(createBoardData(
                    board.data.values.cardsLayed,
                    updatedBoardCards(board, flipCard(scene, target))
                ));

                // TODO: Destroy old card render at some point
            }
        }
    });
}