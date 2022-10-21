import WorldDefinition from "../model/data/worldDefinition";

export const renderCollisionData = (world: WorldDefinition, scene: Phaser.Scene, xyOffset: IVector2) => {
    // for (let j = 0; j < world.worldSize.height; j++) {
    //     for (let i = 0; i < world.worldSize.width; i++) {
    //         renderRectForTile(i, j, world, scene, xyOffset, 0x00FF00);
    //     }
    // }

    for (const coll of world.collisionData) {
        const { x: tileX, y: tileY } = coll;

        renderRectForTile(tileX, tileY, world, scene, xyOffset, 0x00FF00);
    }
}

const renderRectForTile = (tileX: number, tileY: number, world: WorldDefinition, scene: Phaser.Scene, xyOffset: IVector2, color: number) => {
    const tileW = world.tileSize.width;
    const tileH = world.tileSize.height;

    const actualX = xyOffset.x + tileX * tileW;
    const actualY = xyOffset.y + tileY * tileH;

    scene.add.rectangle(actualX + 2, actualY + 2, tileW - 2, tileH - 2, color, 0.5).setOrigin(0, 0);
    scene.add.text(actualX, actualY, `(${tileX}|${tileY})`).setOrigin(0, 0).setFontSize(10);
};