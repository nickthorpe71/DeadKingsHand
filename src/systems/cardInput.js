import { addCardToBoard, calcQuadrant, updatedBoardCards } from '../entities/board';
import { createCardData } from '../entities/card';

export function subscribeToLocalCardInputEvents(scene) {

    scene.input.on('dragstart', (pointer, card) => {
        card.setTint(0x5ee0cc);
        scene.children.bringToTop(card);
    });

    scene.input.on('drag', (pointer, card, dragX, dragY) => {
        card.x = dragX;
        card.y = dragY;
    });

    scene.input.on('dragend', (pointer, card, dropped) => {
        card.setTint();
        if (!dropped) {
            card.x = card.input.dragStartX;
            card.y = card.input.dragStartY;
        }
    });

    scene.input.on('drop', (pointer, card) => {
        const xQuadrant = calcQuadrant(pointer.upX, 280, scene.board.width);
        const yQuadrant = calcQuadrant(pointer.upY, 125, scene.board.height);

        // if there is not a card in this slot
        if (scene.board.data.values.cards[yQuadrant][xQuadrant] !== null) {
            card.setTint();
            card.x = card.input.dragStartX;
            card.y = card.input.dragStartY;
        } else {
            // set quadrants of card
            card.setData(createCardData(
                card.data.values.name,
                card.data.values.attack,
                card.data.values.defense,
                card.data.values.up,
                card.data.values.right,
                card.data.values.down,
                card.data.values.left,
                card.data.values.image,
                xQuadrant,
                yQuadrant,
                card.data.values.ownerColor,
                card.data.values.currentColor,
            ));

            const updatedCard = addCardToBoard(scene, true, card, xQuadrant, yQuadrant);
            // emit event to server (to send to other player)
            scene.socket.emit('cardPlayed', updatedCard, updatedCard.data.values, scene.localPlayer.isPlayerA, xQuadrant, yQuadrant);
        }
    });
}