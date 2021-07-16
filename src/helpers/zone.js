export default class Zone {
    constructor(scene) {
        this.width = 720;
        this.height = 720;
        this.renderZone = () => {
            // x,y,width,height
            let dropZone = scene.add.zone(640, 475, this.width, this.height).setRectangleDropZone(this.width, this.height);

            dropZone.setData({ 
                cardsLayed: 0,
                cards: [
                [null, null,  null, null],
                [null, null,  null, null],
                [null, null,  null, null],
                [null, null,  null, null]
            ]});

            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(2, 0xff69b4);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width/2, dropZone.y - dropZone.input.hitArea.height/2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
        }
        this.calcQuadrant = (pointerDown, edgeComp, widthOrHeight) => {
            // compensate for the distance between the left most edge 
            // of the screen and the left most edge of the board
            const placed = (pointerDown - edgeComp);
            let quadrant = 0;

            if (placed < widthOrHeight * 0.25)
                quadrant = 0;
            else if (placed < widthOrHeight * 0.5)
                quadrant = 1;
            else if (placed < widthOrHeight * 0.75)
                quadrant = 2;
            else if (placed < widthOrHeight)
                quadrant = 3;

            return quadrant;
        }
    }
}