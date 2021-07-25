import { calcQuadrant, incrementBoardCardsLayed } from "../entities/board";

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
            incrementBoardCardsLayed(scene.board);

            const xQuadrant = calcQuadrant(pointer.upX, 280, scene.board.width);
            const yQuadrant = calcQuadrant(pointer.upY, 125, scene.board.height);
            
            // Trigger lay card on board function / event flow
            // scene.dropZone.data.values.cards[yQuadrant][xQuadrant] = card;

            // card.x = xQuadrant * 180 + 370;
            // card.y = yQuadrant * 180 + 205;
            
            // card.disableInteractive();

            scene.socket.emit('cardPlayed', card, scene.isPlayerA, xQuadrant, yQuadrant);
        });
}