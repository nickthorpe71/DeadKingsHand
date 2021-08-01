export function instantiateGameObject(scene, x, y, sprite, data = {}, heightScale = 1, widthScale = 1, interactive = true, draggable = true) {
    const newGameObject = scene.add.image(x, y, sprite).setScale(heightScale, widthScale);

    if (interactive) newGameObject.setInteractive();
    if (draggable) scene.input.setDraggable(newGameObject);
    
    newGameObject.setData(data);

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

export function renderScores(scene) {
    const redStyle = { font: "42px TimesNewRoman", fill: "#f00", wordWrap: true, wordWrapWidth: 100, align: "center", backgroundColor: "transparent" };
    const blueStyle = { font: "42px TimesNewRoman", fill: "#00f", wordWrap: true, wordWrapWidth: 100, align: "center", backgroundColor: "transparent" };
    
    scene.localPlayerScore = scene.add.text(1060, 50, scene.localPlayer.score, scene.localPlayer.color === 'red' ? redStyle : blueStyle);
    scene.mockOpponentScore = scene.add.text(200, 50, scene.mockOpponent.score, scene.mockOpponent.color === 'red' ? redStyle : blueStyle);

    updateScores(scene);
}

// TODO: need to refactor to get rid of loop
export function updateScores(scene) {
    let playerScore = 0;
    let opponentScore = 0;

    for (let i = 0; i < scene.board.data.values.cards.length; i++) {
        for (let j = 0; j < scene.board.data.values.cards[i].length; j++) {
            if (scene.board.data.values.cards[i][j]) {
                if (scene.board.data.values.cards[i][j].data.values.currentColor === scene.localPlayer.color)
                    playerScore++;
                if (scene.board.data.values.cards[i][j].data.values.currentColor === scene.mockOpponent.color)
                    opponentScore++;
            }
        }
    }

    scene.localPlayer.score = playerScore;
    scene.mockOpponent.score = opponentScore;

    scene.localPlayerScore.setText(playerScore);
    scene.mockOpponentScore.setText(opponentScore);
}