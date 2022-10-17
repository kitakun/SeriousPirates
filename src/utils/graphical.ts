export const drawCornerRect = (scene: Phaser.Scene, size: ISize, hexColor: number): Phaser.GameObjects.Graphics => {
    const graphics = scene.add.graphics();
    graphics.lineStyle(3, hexColor, 0.7);
    graphics.strokeRect(5, 5, size.width - 10, size.height - 10);

    return graphics;
}