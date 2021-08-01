import { instantiateGameObject, updateScores } from "../systems/gameEvents";
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
        heightScale: 0.33,
        widthScale: 0.33,
    });
}

export function instantiateCard(scene, x, y, cardData, interactive) {
    const newCardContainer = scene.add.container(x, y);    
    newCardContainer.setData(cardData);
    newCardContainer.setSize(240, 240);

    if (interactive){
        newCardContainer.setInteractive();
        scene.input.setDraggable(newCardContainer);
    }

    let background = 'blueBG';

    if(cardData.currentColor === 'red')
        background = 'redBG'

    const image = instantiateGameObject(scene, 0, 0, cardData.image, {}, cardData.heightScale, cardData.widthScale, false, false);

    if (cardData.image !== 'cardBack') {
        const backgroundImage = instantiateGameObject(scene, 0, 0, background, {}, cardData.heightScale, cardData.widthScale, false, false);
        const textStyle = { font: "18px TimesNewRoman", fill: "#000", wordWrap: true, wordWrapWidth: image.width, align: "center", backgroundColor: "transparent" };

        const upText = scene.add.text(-12, -112, cardData.up, textStyle);
        const rightText = scene.add.text(94, 10, cardData.right, textStyle);
        const downText = scene.add.text(-12, 95, cardData.down, textStyle);
        const leftText = scene.add.text(-94, -15, cardData.left, textStyle);

        leftText.angle = 90;
        rightText.angle = -90;

        const rankClassText = scene.add.text(-110, -110, cardData.rankClass === 11 ? 'J' : cardData.rankClass === 12 ? 'Q' : cardData.rankClass === 13 ? 'A' : cardData.rankClass, textStyle);
        const levelText = scene.add.text(-110, -90, 'Lvl:' + cardData.level, textStyle);

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

    updateScores(scene);

    return newCard;
}
