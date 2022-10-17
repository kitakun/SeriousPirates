declare interface IStaticSprite extends Phaser.GameObjects.Sprite {
    // myMethod(): void
}

declare namespace Phaser.GameObjects {
    interface GameObjectFactory {
        staticSprite(x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number): IStaticSprite;
    }
}