export function instantiateGameObject(scene, x, y, sprite, data = {}, heightScale = 1, widthScale = 1, interactive = true, draggable = true) {
    const newGameObject = scene.add.image(x, y, sprite).setScale(heightScale, widthScale);

    if (interactive) newGameObject.setInteractive();
    if (draggable) newGameObject.setDraggable(newGameObject);

    scene.input.setDraggable(newGameObject);
    newGameObject.data = data;

    return newGameObject;
}

export function enableDealing(scene) {
    scene.dealText = scene.add.text(600, 875, ['Deal Cards']).setFontSize(22).setFontFamily('Trebuchet MS').setColor('#222').setInteractive();

    scene.dealText.on('pointerdown', () => {
        scene.socket.emit('dealCards');
    });

    scene.dealText.on('pointerover', () => {
        scene.dealText.setColor('#5ee0cc');
    });

    scene.dealText.on('pointerout', () => {
        scene.dealText.setColor('#222');
    });
}