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
        createCardData(
            card.data.values.name,
            card.data.values.attack,
            card.data.values.defense,
            card.data.values.up,
            card.data.values.right,
            card.data.values.down,
            card.data.values.left,
            `mockCard${capitalizeFirstLetter(newColor)}`,
            card.data.values.xQuadrant,
            card.data.values.yQuadrant,
            card.data.values.ownerColor,
            newColor,
        ),
        card.data.values.heightScale,
        card.data.values.widthScale,
        false,
        false
    );

    // TODO: Destroy old card render at some point
    // card.destroy();

    return newCard;
}
