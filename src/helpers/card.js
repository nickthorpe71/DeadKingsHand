export default class Card {
    constructor(scene, name, attack, defense, up, right, down, left, image) {
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
        this.image = image;
        
        this.render = (x, y, sprite) => {
            let card = scene.add.image(x, y, sprite).setScale(0.246, 0.246).setInteractive();
            scene.input.setDraggable(card);
            return card;
        };
    }
}