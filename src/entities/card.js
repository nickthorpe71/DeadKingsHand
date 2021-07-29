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

export function instantiateCard(scene, x, y, cardData) {
    const container = scene.add.container(x, y);

    const image = instantiateGameObject(scene, x, y, cardData.image, cardData, 1, 1, true, true);
    const style = { font: "32px Arial", fill: "#000", wordWrap: true, wordWrapWidth: image.width, align: "center", backgroundColor: "transparent" };
    const text = scene.add.text(x + 50, y, "test", style);
    // text.anchor.set(0.5);
    
    container.add([image, text]);

    return container;
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
