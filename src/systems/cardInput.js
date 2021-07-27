import { calcQuadrant, createBoardData, updatedBoardCards, updatedCardsLayed } from "../entities/board";
import { createCardData } from "../entities/card";
import { createPlayerData, removeCardFromHand } from "../entities/player";

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

            console.log('pre manip', scene.board)

            if (scene.board.data.values.cards[yQuadrant][xQuadrant] !== null) {
                card.setTint();
                card.x = card.input.dragStartX;
                card.y = card.input.dragStartY;
            } else {
                // snap card to board quadrant
                card.x = xQuadrant * 180 + 370;
                card.y = yQuadrant * 180 + 205;

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

                // remove card from players hand
                scene.player = createPlayerData(
                    scene.player.name, 
                    scene.player.deck, 
                    scene.player.isLocalPlayer,
                    scene.player.color, 
                    removeCardFromHand(scene.player.hand.indexOf(card), scene.player.hand),
                    scene.player.isPlayerA
                );

                // add card to board data 
                scene.board.data.values = createBoardData(
                    updatedCardsLayed(scene.board),
                    updatedBoardCards(scene.board, card)
                );
                
                console.log(scene.board.data.values);
                
                card.disableInteractive();

                scene.socket.emit('cardPlayed', card, scene.player.isPlayerA, xQuadrant, yQuadrant);
            }            
        });
}