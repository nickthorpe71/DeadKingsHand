import { addCardToBoard, calcQuadrant } from '../entities/board';

export function subscribeToLocalCardInputEvents(scene) {

    scene.input.on('dragstart', (pointer, card) => {
        card.setTint(0x5ee0cc);
        scene.children.bringToTop(card);

        console.log(scene.player.hand);
        console.log(card.data);
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
        console.log(card.data);
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
            addCardToBoard(scene, true, card, xQuadrant, yQuadrant);
            
            // emit event to server (to send to other player)
            scene.socket.emit('cardPlayed', card, scene.player.isPlayerA, xQuadrant, yQuadrant);
        }            
    });
}