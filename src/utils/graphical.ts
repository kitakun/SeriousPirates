export const drawCornerRect = (
    scene: Phaser.Scene,
    worldSize: ISize,
    frameSize: ISize,
    internalScreenSize: ISize,
    hexColor: number,
): CornerRectGraphic => {
    const graphics = scene.add.graphics() as CornerRectGraphic;

    const lineWidth = 3;
    const lineAlpha = 0.7;

    graphics.redraw = (
        worldSize: ISize,
        frameSize: ISize,
        internalScreenSize: ISize) => {
        graphics.clear();

        graphics.lineStyle(lineWidth, hexColor, lineAlpha);

        const halfOfWidth = (frameSize.width - internalScreenSize.width) / 2;
        const halfOfHeight = (frameSize.height - internalScreenSize.height) / 2;

        graphics.strokeRect(halfOfWidth + 5, halfOfHeight + 5, worldSize.width, worldSize.height);

    };

    graphics.redraw(worldSize, frameSize, internalScreenSize);

    return graphics;
}

export interface CornerRectGraphic extends Phaser.GameObjects.Graphics {
    redraw(
        worldSize: ISize,
        frameSize: ISize,
        internalScreenSize: ISize
    ): void;
}

export const drawCorner = (
    scene: Phaser.Scene,
    rectangle: IRectangle,
    hexColor: number): CornerGraphic => {
    const graphics = scene.add.graphics() as CornerGraphic;

    const lineWidth = 3;
    const alpha = 0.7;

    graphics.redraw = (rectangle: IRectangle) => {
        graphics.clear();

        graphics.lineStyle(lineWidth, hexColor, alpha);
        graphics.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }
    graphics.redraw(rectangle)

    return graphics;
}

export interface CornerGraphic extends Phaser.GameObjects.Graphics {
    redraw(rectangle: IRectangle): void;
}