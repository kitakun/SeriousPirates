export const drawCornerRect = (
    scene: Phaser.Scene,
    worldSize: ISize,
    frameSize: ISize,
    internalScreenSize: ISize,
    hexColor: number): Phaser.GameObjects.Graphics => {
    const graphics = scene.add.graphics();
    graphics.lineStyle(3, hexColor, 0.7);

    const halfOfWidth = (frameSize.width - internalScreenSize.width) / 2;
    const halfOfHeight = (frameSize.height - internalScreenSize.height) / 2;

    graphics.strokeRect(
        halfOfWidth + 5,
        halfOfHeight + 5,
        worldSize.width - halfOfWidth * 2,
        worldSize.height - halfOfHeight * 2);

    return graphics;
}