import { instantiateGameObject } from "../systems/gameEvents";
import { capitalizeFirstLetter } from "../systems/utils";

export function createCardData(name, rankClass, level, up, right, down, left, image, xQuadrant, yQuadrant, ownerColor, currentColor) {
    return Object.freeze({
        name, 
        rankClass, 
        level, 
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

    let background = 'blueBG';

    if(cardData.currentColor === 'red')
    background = 'redBG'

    const backgroundImage = instantiateGameObject(scene, 0, 0, background, {}, cardData.heightScale, cardData.widthScale, false, false);
    const image = instantiateGameObject(scene, 0, 0, cardData.image, {}, cardData.heightScale, cardData.widthScale, false, false);
    const textStyle = { font: "16px Arial", fill: "#000", wordWrap: true, wordWrapWidth: image.width, align: "center", backgroundColor: "transparent" };

    if (cardData.image !== 'cardBack') {
        const upText = scene.add.text(-10, -85, cardData.up, textStyle);
        const rightText = scene.add.text(66, 10, cardData.right, textStyle);
        const downText = scene.add.text(-10, 65, cardData.down, textStyle);
        const leftText = scene.add.text(-66, -15, cardData.left, textStyle);

        leftText.angle = 90;
        rightText.angle = -90;

        const rankClassText = scene.add.text(-85, -85, 'C:' + cardData.rankClass, textStyle);
        const levelText = scene.add.text(-85, -65, 'Lvl:' + cardData.level, textStyle);

        newCardContainer.add([backgroundImage, image, upText, rightText, downText, leftText, rankClassText, levelText]);
    } else {
        newCardContainer.add([image]);
    }

    return newCardContainer;
}

export function attackSuccess(attacker, defender, attackDirection, defendDirection) {
    return (attacker[attackDirection] > defender[defendDirection]);
}

export function flipCard(scene, card) {
    // TODO: play flip animation

    // create and render new card
    const newColor = (card.data.values.currentColor === 'red' ) ? 'blue' : 'red';
    const newCard = instantiateCard(
        scene,
        card.x,
        card.y,
        {...card.data.values, currentColor: newColor},
        false
    );

    // TODO: Destroy old card render at some point
    // card.destroy();

    return newCard;
}
