import { addCardToBoard, calcQuadrant } from '../entities/board';

export function subscribeToLocalCardInputEvents(scene) {

    scene.input.on('dragstart', (pointer, card) => {
        // set tint of card image
        card.list[0].setTint(0x5ee0cc);
        scene.children.bringToTop(card);
    });

    scene.input.on('drag', (pointer, card, dragX, dragY) => {
        card.x = dragX;
        card.y = dragY;
    });

    scene.input.on('dragend', (pointer, card, dropped) => {
        // set tint of card image
        card.list[0].setTint();
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
            // set tint of card image
            card.list[0].setTint();
            card.x = card.input.dragStartX;
            card.y = card.input.dragStartY;
        } else {
            // set quadrants of card
            card.setData({...card.data.values, xQuadrant, yQuadrant});

            const updatedCard = addCardToBoard(scene, true, card, xQuadrant, yQuadrant);
            // emit event to server (to send to other player)
            scene.socket.emit('cardPlayed', updatedCard, updatedCard.data.values, scene.localPlayer.isPlayerA, xQuadrant, yQuadrant);
        }
    });
}