import { instantiateGameObject } from "../systems/gameEvents";
import { capitalizeFirstLetter } from "../systems/utils";

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

export function instantiateCard(scene, x, y, cardData, interactive) {
    const newCardContainer = scene.add.container(x, y);    
    newCardContainer.setData(cardData);
    newCardContainer.setSize(180, 180);

    if (interactive){
        newCardContainer.setInteractive();
        scene.input.setDraggable(newCardContainer);
    }

    const image = instantiateGameObject(scene, 0, 0, cardData.image, {}, cardData.heightScale, cardData.widthScale, false, false);
    const textStyle = { font: "20px Arial", fill: "#000", wordWrap: true, wordWrapWidth: image.width, align: "center", backgroundColor: "transparent" };

    if (cardData.image !== 'cardBack') {
        const upText = scene.add.text(0, -85, cardData.up, textStyle);
        const rightText = scene.add.text(70, -10, cardData.right, textStyle);
        const downText = scene.add.text(0, 60, cardData.down, textStyle);
        const leftText = scene.add.text(-80, -10, cardData.left, textStyle);

        const attkText = scene.add.text(-85, -85, 'A:' + cardData.attack, textStyle);
        const defText = scene.add.text(-85, -65, 'D:' + cardData.defense, textStyle);

        newCardContainer.add([image, upText, rightText, downText, leftText, attkText, defText]);
    } else {
        newCardContainer.add([image]);
    }

    return newCardContainer;
}

export function attackSuccess(attacker, defender, attackDirection, defendDirection) {
    return (attacker[attackDirection] * attacker.attack) > (defender[defendDirection] * defender.defense);
}

export function flipCard(scene, card) {
    // TODO: play flip animation

    // create and render new card
    const newColor = (card.data.values.currentColor === 'red' ) ? 'blue' : 'red';
    const newCard = instantiateGameObject(
        scene,
        card.x,
        card.y,
        `mockCard${capitalizeFirstLetter(newColor)}`,
        {...card.data.values, image: `mockCard${capitalizeFirstLetter(newColor)}`},
        card.data.values.heightScale,
        card.data.values.widthScale,
        false,
        false
    );

    // TODO: Destroy old card render at some point
    // card.destroy();

    return newCard;
}
